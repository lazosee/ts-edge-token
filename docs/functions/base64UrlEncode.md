[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / base64UrlEncode

# Function: base64UrlEncode()

> **base64UrlEncode**(`input`): `string`

Defined in: encoding/base-64-url.ts:72

Encodes a string or byte array into an unpadded URL-safe Base64 string (RFC 4648 §5).

Replaces `+` with `-`, `/` with `_`, and strips trailing padding `=`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `Uint8Array`\<`ArrayBufferLike`\> | The string or byte array to encode. |

## Returns

`string`

The URL-safe Base64-encoded string without padding.

## Example

```ts
const encoded = base64UrlEncode("sub=12345");
```
