[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / encryptPasetoV3Local

# Function: encryptPasetoV3Local()

> **encryptPasetoV3Local**(`payload`, `key`, `footer?`): `Promise`\<`string`\>

Defined in: paseto/v3-local.ts:38

Encrypts a payload into an authenticated PASETO v3.local token.

Uses:
- 32-byte CSPRNG random nonce
- HKDF-SHA384 key derivation (splitting key into AES-CTR and HMAC-SHA384 keys)
- AES-256-CTR encryption
- HMAC-SHA384 authentication tag computed over Pre-Authentication Encoding (PAE)

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `payload` | `string` \| `Record`\<`string`, `unknown`\> | `undefined` | Data to encrypt, provided either as a JSON-serializable object or string. |
| `key` | `Uint8Array` | `undefined` | A 32-byte symmetric key as a `Uint8Array`. |
| `footer` | `string` \| `Record`\<`string`, `unknown`\> | `""` | Optional unencrypted, authenticated metadata to attach to the token. |

## Returns

`Promise`\<`string`\>

A Promise resolving to the serialized token: `v3.local.<body_base64>[.<footer_base64>]`.

## Throws

If the provided key is not exactly 32 bytes.

## Example

```ts
const key = crypto.getRandomValues(new Uint8Array(32));
const token = await encryptPasetoV3Local(
  { accountId: "acc_42" },
  key,
  "kid:key_2026"
);
```
