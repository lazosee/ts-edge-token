import {
    base64UrlDecode,
    base64UrlEncode,
    fromBytes,
    toBuffer,
    toBytes,
} from "../encoding/base-64-url.js";
import { pae } from "../encoding/pae.js";

const HEADER = "v3.local.";

/**
 * Encrypts a payload into an authenticated PASETO v3.local token.
 *
 * Uses:
 * - 32-byte CSPRNG random nonce
 * - HKDF-SHA384 key derivation (splitting key into AES-CTR and HMAC-SHA384 keys)
 * - AES-256-CTR encryption
 * - HMAC-SHA384 authentication tag computed over Pre-Authentication Encoding (PAE)
 *
 * @param payload - Data to encrypt, provided either as a JSON-serializable object or string.
 * @param key - A 32-byte symmetric key as a `Uint8Array`.
 * @param footer - Optional unencrypted, authenticated metadata to attach to the token.
 * @returns A Promise resolving to the serialized token: `v3.local.<body_base64>[.<footer_base64>]`.
 *
 * @throws {Error} If the provided key is not exactly 32 bytes.
 *
 * @example
 * ```ts
 * const key = crypto.getRandomValues(new Uint8Array(32));
 * const token = await encryptPasetoV3Local(
 *   { accountId: "acc_42" },
 *   key,
 *   "kid:key_2026"
 * );
 * ```
 */
export async function encryptPasetoV3Local(
    payload: Record<string, unknown> | string,
    key: Uint8Array,
    footer: Record<string, unknown> | string = ""
): Promise<string> {
    if (key.length !== 32) throw new Error("PASETO v3.local requires a 32-byte key");

    const m = typeof payload === "string" ? toBytes(payload) : toBytes(JSON.stringify(payload));
    const f = typeof footer === "string" ? toBytes(footer) : toBytes(JSON.stringify(footer));

    const nonce = crypto.getRandomValues(new Uint8Array(32));

    // Derive encryption key Ek and auth key Ak via HKDF (SHA-384)
    const hkdfKey = await crypto.subtle.importKey(
        "raw",
        toBuffer(key),
        "HKDF",
        false,
        ["deriveKey"]
    );

    const ek = await crypto.subtle.deriveKey(
        {
            name: "HKDF",
            hash: "SHA-384",
            salt: nonce,
            info: toBuffer(toBytes("paseto-encryption-key")),
        },
        hkdfKey,
        { name: "AES-CTR", length: 256 },
        false,
        ["encrypt"]
    );

    const ak = await crypto.subtle.deriveKey(
        {
            name: "HKDF",
            hash: "SHA-384",
            salt: nonce,
            info: toBuffer(toBytes("paseto-auth-key-for-aead")),
        },
        hkdfKey,
        { name: "HMAC", hash: "SHA-384" },
        false,
        ["sign"]
    );

    // Counter block: first 16 bytes of nonce
    const counter = nonce.slice(0, 16);
    const cipherBuffer = await crypto.subtle.encrypt(
        { name: "AES-CTR", counter, length: 128 },
        ek,
        toBuffer(m)
    );
    const c = new Uint8Array(cipherBuffer);

    // Compute tag over PAE(header, nonce, ciphertext, footer)
    const preAuth = pae([toBytes(HEADER), nonce, c, f]);
    const tagBuffer = await crypto.subtle.sign("HMAC", ak, toBuffer(preAuth));
    const t = new Uint8Array(tagBuffer).slice(0, 48); // SHA-384 output length is 48 bytes

    // Payload body: nonce || c || t
    const body = new Uint8Array(nonce.length + c.length + t.length);
    body.set(nonce, 0);
    body.set(c, nonce.length);
    body.set(t, nonce.length + c.length);

    const token = `${HEADER}${base64UrlEncode(body)}`;
    return f.length > 0 ? `${token}.${base64UrlEncode(f)}` : token;
}

/**
 * Authenticates and decrypts a PASETO v3.local token.
 *
 * @typeParam T - The expected shape of the decrypted payload.
 * @param token - The serialized PASETO token (`v3.local.<body_base64>[.<footer_base64>]`).
 * @param key - The 32-byte symmetric key used during encryption.
 * @returns A Promise resolving to an object containing the decrypted `payload` and optional `footer`.
 *
 * @throws {Error} If the provided key is not exactly 32 bytes.
 * @throws {Error} If the header does not match `v3.local.`.
 * @throws {Error} If the ciphertext body is truncated or malformed.
 * @throws {Error} If HMAC authentication fails due to tampering or an incorrect key.
 *
 * @example
 * ```ts
 * try {
 *   const { payload, footer } = await decryptPasetoV3Local(token, key);
 *   console.log("Decrypted payload:", payload);
 * } catch (err) {
 *   console.error("Token verification or decryption failed:", err.message);
 * }
 * ```
 */
export async function decryptPasetoV3Local<T = Record<string, unknown>>(
    token: string,
    key: Uint8Array
): Promise<{ payload: T; footer?: string }> {
    if (key.length !== 32) throw new Error("PASETO v3.local requires a 32-byte key");
    if (!token.startsWith(HEADER)) throw new Error("Invalid PASETO v3.local header");

    const remainder = token.slice(HEADER.length);
    const parts = remainder.split(".");
    const encodedBody = parts[0];
    const encodedFooter = parts[1] ?? "";

    const body = base64UrlDecode(encodedBody);
    const f = encodedFooter ? base64UrlDecode(encodedFooter) : new Uint8Array(0);

    if (body.length < 32 + 48) throw new Error("Ciphertext payload truncated");

    const nonce = body.slice(0, 32);
    const t = body.slice(body.length - 48);
    const c = body.slice(32, body.length - 48);

    const hkdfKey = await crypto.subtle.importKey(
        "raw",
        toBuffer(key),
        "HKDF",
        false,
        ["deriveKey"]
    );

    const ak = await crypto.subtle.deriveKey(
        {
            name: "HKDF",
            hash: "SHA-384",
            salt: nonce,
            info: toBuffer(toBytes("paseto-auth-key-for-aead")),
        },
        hkdfKey,
        { name: "HMAC", hash: "SHA-384" },
        false,
        ["verify"]
    );

    const preAuth = pae([toBytes(HEADER), nonce, c, f]);
    const isValid = await crypto.subtle.verify("HMAC", ak, t, toBuffer(preAuth));
    if (!isValid) throw new Error("Authentication check failed: tampered token");

    const ek = await crypto.subtle.deriveKey(
        {
            name: "HKDF",
            hash: "SHA-384",
            salt: nonce,
            info: toBuffer(toBytes("paseto-encryption-key")),
        },
        hkdfKey,
        { name: "AES-CTR", length: 256 },
        false,
        ["decrypt"]
    );

    const counter = nonce.slice(0, 16);
    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-CTR", counter, length: 128 },
        ek,
        c
    );

    const rawText = fromBytes(new Uint8Array(plainBuffer));
    let parsedPayload: unknown;
    try {
        parsedPayload = JSON.parse(rawText);
    } catch {
        parsedPayload = rawText;
    }

    return {
        payload: parsedPayload as T,
        footer: f.length > 0 ? fromBytes(f) : undefined,
    };
}