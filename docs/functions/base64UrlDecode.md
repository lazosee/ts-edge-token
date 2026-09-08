[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / base64UrlDecode

# Function: base64UrlDecode()

> **base64UrlDecode**(`input`): `Uint8Array`

Defined in: encoding/base-64-url.ts:98

Decodes an unpadded URL-safe Base64 string into a `Uint8Array`.

Normalizes URL-safe characters (`-` and `_`) back to standard Base64
(`+` and `/`), re-applies necessary `=` padding, and returns decoded bytes.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The URL-safe Base64 string to decode. |

## Returns

`Uint8Array`

The decoded raw bytes as a `Uint8Array`.

## Example

```ts
const bytes = base64UrlDecode("ZXlKaGJHY2lPaUpJVXpJMU5pSjA");
```
