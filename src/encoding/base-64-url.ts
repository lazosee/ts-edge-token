const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Normalizes an input string or byte array into a `Uint8Array`.
 *
 * If the input is already a `Uint8Array`, it is returned directly;
 * otherwise, the string is encoded using UTF-8.
 *
 * @param {Uint8Array | string} input - The UTF-8 string or `Uint8Array` to convert.
 * @returns A `Uint8Array` representation of the input.
 *
 * @example
 * ```ts
 * const bytes = toBytes("hello world");
 * ```
 */
export function toBytes(input: Uint8Array | string): Uint8Array {
    return typeof input === "string" ? encoder.encode(input) : input;
}

/**
 * Decodes a `Uint8Array` into a UTF-8 string.
 *
 * @param bytes - The binary data buffer to decode.
 * @returns The decoded UTF-8 string.
 *
 * @example
 * ```ts
 * const text = fromBytes(new Uint8Array([104, 101, 108, 108, 111])); // "hello"
 * ```
 */
export function fromBytes(bytes: Uint8Array): string {
    return decoder.decode(bytes);
}

/**
 * Creates an unshared, standalone `ArrayBuffer` copy of a `Uint8Array`.
 *
 * Web Cryptography APIs require an unshared `BufferSource`. This helper slices
 * the underlying buffer to prevent `SharedArrayBuffer` type incompatibilities
 * and ensure clean byte offsets.
 *
 * @param {Uint8Array} bytes - The byte array view to isolate.
 * @returns An isolated `ArrayBuffer` slice containing exactly the view's data.
 *
 * @example
 * ```ts
 * const buffer = toBuffer(new Uint8Array([1, 2, 3]));
 * ```
 */
export function toBuffer(bytes: Uint8Array): ArrayBuffer {
    return bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength
    ) as ArrayBuffer;
}

/**
 * Encodes a string or byte array into an unpadded URL-safe Base64 string (RFC 4648 §5).
 *
 * Replaces `+` with `-`, `/` with `_`, and strips trailing padding `=`.
 *
 * @param input - The string or byte array to encode.
 * @returns The URL-safe Base64-encoded string without padding.
 *
 * @example
 * ```ts
 * const encoded = base64UrlEncode("sub=12345");
 * ```
 */
export function base64UrlEncode(input: Uint8Array | string): string {
    const bytes = toBytes(input);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Decodes an unpadded URL-safe Base64 string into a `Uint8Array`.
 *
 * Normalizes URL-safe characters (`-` and `_`) back to standard Base64
 * (`+` and `/`), re-applies necessary `=` padding, and returns decoded bytes.
 *
 * @param input - The URL-safe Base64 string to decode.
 * @returns The decoded raw bytes as a `Uint8Array`.
 *
 * @example
 * ```ts
 * const bytes = base64UrlDecode("ZXlKaGJHY2lPaUpJVXpJMU5pSjA");
 * ```
 */
export function base64UrlDecode(input: string): Uint8Array {
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
        base64 += "=";
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}