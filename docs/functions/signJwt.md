[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / signJwt

# Function: signJwt()

> **signJwt**(`payload`, `secret`, `options?`): `Promise`\<`string`\>

Defined in: jwt/index.ts:102

Signs a payload object and produces a compact RFC 7519 JSON Web Token (JWT).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | `Record`\<`string`, `unknown`\> | Key-value claims to bundle inside the JWT payload. |
| `secret` | `string` \| `Uint8Array`\<`ArrayBufferLike`\> | Shared HMAC symmetric secret key. |
| `options` | [`JwtSignOptions`](../interfaces/JwtSignOptions.md) | Signing options including algorithm, expiration, issuer, and audience. |

## Returns

`Promise`\<`string`\>

A Promise resolving to the signed compact JWT string (`header.payload.signature`).

## Example

```ts
const token = await signJwt(
  { sub: "usr_100", role: "admin" },
  "my-super-secret-key",
  { expiresIn: 3600, issuer: "auth.example.com" }
);
```
