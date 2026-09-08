[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / toBuffer

# Function: toBuffer()

> **toBuffer**(`bytes`): `ArrayBuffer`

Defined in: encoding/base-64-url.ts:52

Creates an unshared, standalone `ArrayBuffer` copy of a `Uint8Array`.

Web Cryptography APIs require an unshared `BufferSource`. This helper slices
the underlying buffer to prevent `SharedArrayBuffer` type incompatibilities
and ensure clean byte offsets.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bytes` | `Uint8Array` | The byte array view to isolate. |

## Returns

`ArrayBuffer`

An isolated `ArrayBuffer` slice containing exactly the view's data.

## Example

```ts
const buffer = toBuffer(new Uint8Array([1, 2, 3]));
```
