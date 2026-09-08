import {
    base64UrlDecode,
    base64UrlEncode,
    fromBytes,
    toBuffer,
    toBytes,
} from "../encoding/base-64-url.js";

/**
 * Configuration options for generating a signed JSON Web Token.
 */
export interface JwtSignOptions {
    /**
     * The HMAC hashing algorithm to use.
     * @defaultValue `'HS256'`
     */
    algorithm?: "HS256" | "HS384" | "HS512";

    /**
     * Token lifetime in seconds from issuance.
     * Sets the `exp` claim (`Date.now() / 1000 + expiresIn`).
     */
    expiresIn?: number;

    /**
     * Number of seconds before this token becomes active.
     * Sets the `nbf` claim (`Date.now() / 1000 + notBefore`).
     */
    notBefore?: number;

    /**
     * Identifies the principal that issued the JWT (`iss` claim).
     */
    issuer?: string;

    /**
     * Identifies the recipients that the JWT is intended for (`aud` claim).
     */
    audience?: string | string[];
}

/**
 * Verification criteria and constraints when validating a JSON Web Token.
 */
export interface JwtVerifyOptions {
    /**
     * If provided, validates that the token's `iss` claim matches this value.
     */
    issuer?: string;

    /**
     * If provided, validates that the token's `aud` claim matches this audience.
     */
    audience?: string | string[];
}

/**
 * Imports a raw secret into a Web Crypto HMAC `CryptoKey`.
 *
 * @internal
 * @param key - The secret as a UTF-8 string or `Uint8Array`.
 * @param alg - The algorithm identifier (`HS256`, `HS384`, or `HS512`).
 * @returns A Promise resolving to the imported `CryptoKey`.
 */
async function getHmacCryptoKey(
    key: Uint8Array | string,
    alg: string
): Promise<CryptoKey> {
    const hash = `SHA-${alg.slice(2)}`;
    const bytes = toBytes(key);
    const buffer: ArrayBuffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength
    ) as ArrayBuffer;

    return crypto.subtle.importKey(
        "raw",
        buffer,
        { name: "HMAC", hash: { name: hash } },
        false,
        ["sign", "verify"]
    );
}

/**
 * Signs a payload object and produces a compact RFC 7519 JSON Web Token (JWT).
 *
 * @param payload - Key-value claims to bundle inside the JWT payload.
 * @param secret - Shared HMAC symmetric secret key.
 * @param options - Signing options including algorithm, expiration, issuer, and audience.
 * @returns A Promise resolving to the signed compact JWT string (`header.payload.signature`).
 *
 * @example
 * ```ts
 * const token = await signJwt(
 *   { sub: "usr_100", role: "admin" },
 *   "my-super-secret-key",
 *   { expiresIn: 3600, issuer: "auth.example.com" }
 * );
 * ```
 */
export async function signJwt(
    payload: Record<string, unknown>,
    secret: Uint8Array | string,
    options: JwtSignOptions = {}
): Promise<string> {
    const alg = options.algorithm ?? "HS256";
    const now = Math.floor(Date.now() / 1000);

    const claims: Record<string, unknown> = { ...payload };
    if (!("iat" in claims)) claims.iat = now;
    if (options.expiresIn) claims.exp = now + options.expiresIn;
    if (options.notBefore) claims.nbf = now + options.notBefore;
    if (options.issuer) claims.iss = options.issuer;
    if (options.audience) claims.aud = options.audience;

    const header = { alg, typ: "JWT" };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(claims));
    const dataToSign = toBytes(`${encodedHeader}.${encodedPayload}`);

    const cryptoKey = await getHmacCryptoKey(secret, alg);
    const signatureBytes = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        toBuffer(dataToSign)
    );

    return `${encodedHeader}.${encodedPayload}.${base64UrlEncode(
        new Uint8Array(signatureBytes)
    )}`;
}

/**
 * Verifies a compact JWT's HMAC signature, expiration, and claim constraints.
 *
 * Enforces strict algorithm validation to prevent algorithm confusion attacks
 * (such as rejecting the unsigned `none` algorithm).
 *
 * @typeParam T - The expected shape of the claims payload.
 * @param token - The serialized compact JWT (`header.payload.signature`).
 * @param secret - The shared symmetric key matching the one used to sign the token.
 * @param options - Validation constraints for `issuer` and `audience`.
 * @returns A Promise resolving to the typed claims payload.
 *
 * @throws {Error} If the token structure is malformed.
 * @throws {Error} If the algorithm is unsupported or insecure.
 * @throws {Error} If the HMAC signature is invalid.
 * @throws {Error} If the token is expired (`exp`) or not yet active (`nbf`).
 * @throws {Error} If `issuer` or `audience` constraints fail.
 *
 * @example
 * ```ts
 * try {
 *   const claims = await verifyJwt<{ sub: string }>(token, "my-super-secret-key");
 *   console.log("Authenticated user:", claims.sub);
 * } catch (err) {
 *   console.error("JWT verification failed:", err.message);
 * }
 * ```
 */
export async function verifyJwt<T = Record<string, unknown>>(
    token: string,
    secret: Uint8Array | string,
    options: JwtVerifyOptions = {}
): Promise<T> {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Malformed JWT");

    const [encodedHeader, encodedPayload, encodedSig] = parts;
    const header = JSON.parse(fromBytes(base64UrlDecode(encodedHeader)));

    if (
        header.alg !== "HS256" &&
        header.alg !== "HS384" &&
        header.alg !== "HS512"
    ) {
        throw new Error(`Unsupported or insecure algorithm: ${header.alg}`);
    }

    const cryptoKey = await getHmacCryptoKey(secret, header.alg);
    const dataToSign = toBytes(`${encodedHeader}.${encodedPayload}`);
    const signature = base64UrlDecode(encodedSig);

    const isValid = await crypto.subtle.verify(
        "HMAC",
        cryptoKey,
        toBuffer(signature),
        toBuffer(dataToSign)
    );

    if (!isValid) throw new Error("Invalid JWT signature");

    const payload = JSON.parse(
        fromBytes(base64UrlDecode(encodedPayload))
    ) as Record<string, unknown>;
    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp === "number" && now >= payload.exp) {
        throw new Error("JWT token expired");
    }
    if (typeof payload.nbf === "number" && now < payload.nbf) {
        throw new Error("JWT not yet valid");
    }
    if (options.issuer && payload.iss !== options.issuer) {
        throw new Error("JWT issuer mismatch");
    }
    if (options.audience) {
        const audMatches = Array.isArray(payload.aud)
            ? payload.aud.includes(options.audience as string)
            : payload.aud === options.audience;
        if (!audMatches) throw new Error("JWT audience mismatch");
    }

    return payload as T;
}