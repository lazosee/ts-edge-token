[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / verifyJwt

# Function: verifyJwt()

> **verifyJwt**\<`T`\>(`token`, `secret`, `options?`): `Promise`\<`T`\>

Defined in: jwt/index.ts:162

Verifies a compact JWT's HMAC signature, expiration, and claim constraints.

Enforces strict algorithm validation to prevent algorithm confusion attacks
(such as rejecting the unsigned `none` algorithm).

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> | The expected shape of the claims payload. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `token` | `string` | The serialized compact JWT (`header.payload.signature`). |
| `secret` | `string` \| `Uint8Array`\<`ArrayBufferLike`\> | The shared symmetric key matching the one used to sign the token. |
| `options` | [`JwtVerifyOptions`](../interfaces/JwtVerifyOptions.md) | Validation constraints for `issuer` and `audience`. |

## Returns

`Promise`\<`T`\>

A Promise resolving to the typed claims payload.

## Throws

If the token structure is malformed.

## Throws

If the algorithm is unsupported or insecure.

## Throws

If the HMAC signature is invalid.

## Throws

If the token is expired (`exp`) or not yet active (`nbf`).

## Throws

If `issuer` or `audience` constraints fail.

## Example

```ts
try {
  const claims = await verifyJwt<{ sub: string }>(token, "my-super-secret-key");
  console.log("Authenticated user:", claims.sub);
} catch (err) {
  console.error("JWT verification failed:", err.message);
}
```
