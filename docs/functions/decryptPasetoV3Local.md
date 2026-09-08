[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / decryptPasetoV3Local

# Function: decryptPasetoV3Local()

> **decryptPasetoV3Local**\<`T`\>(`token`, `key`): `Promise`\<\{ `footer?`: `string`; `payload`: `T`; \}\>

Defined in: paseto/v3-local.ts:132

Authenticates and decrypts a PASETO v3.local token.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> | The expected shape of the decrypted payload. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `token` | `string` | The serialized PASETO token (`v3.local.<body_base64>[.<footer_base64>]`). |
| `key` | `Uint8Array` | The 32-byte symmetric key used during encryption. |

## Returns

`Promise`\<\{ `footer?`: `string`; `payload`: `T`; \}\>

A Promise resolving to an object containing the decrypted `payload` and optional `footer`.

## Throws

If the provided key is not exactly 32 bytes.

## Throws

If the header does not match `v3.local.`.

## Throws

If the ciphertext body is truncated or malformed.

## Throws

If HMAC authentication fails due to tampering or an incorrect key.

## Example

```ts
try {
  const { payload, footer } = await decryptPasetoV3Local(token, key);
  console.log("Decrypted payload:", payload);
} catch (err) {
  console.error("Token verification or decryption failed:", err.message);
}
```
