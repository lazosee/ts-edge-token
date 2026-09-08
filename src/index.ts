/**
 * @packageDocumentation
 * Fast, zero-dependency, edge-ready token engine for JSON Web Tokens (JWT)
 * and PASETO v3 using the standard Web Cryptography API (`crypto.subtle`).
 */

export {
    base64UrlEncode,
    base64UrlDecode,
    toBytes,
    fromBytes,
    toBuffer,
} from "./encoding/base-64-url.js";

export { pae } from "./encoding/pae.js";

export {
    signJwt,
    verifyJwt,
    type JwtSignOptions,
    type JwtVerifyOptions,
} from "./jwt/index.js";

export {
    encryptPasetoV3Local,
    decryptPasetoV3Local,
} from "./paseto/v3-local.js";
