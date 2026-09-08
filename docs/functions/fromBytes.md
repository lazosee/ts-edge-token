[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / fromBytes

# Function: fromBytes()

> **fromBytes**(`bytes`): `string`

Defined in: encoding/base-64-url.ts:33

Decodes a `Uint8Array` into a UTF-8 string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bytes` | `Uint8Array` | The binary data buffer to decode. |

## Returns

`string`

The decoded UTF-8 string.

## Example

```ts
const text = fromBytes(new Uint8Array([104, 101, 108, 108, 111])); // "hello"
```
