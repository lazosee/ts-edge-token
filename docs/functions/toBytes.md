[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / toBytes

# Function: toBytes()

> **toBytes**(`input`): `Uint8Array`

Defined in: encoding/base-64-url.ts:18

Normalizes an input string or byte array into a `Uint8Array`.

If the input is already a `Uint8Array`, it is returned directly;
otherwise, the string is encoded using UTF-8.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| `Uint8Array`\<`ArrayBufferLike`\> | The UTF-8 string or `Uint8Array` to convert. |

## Returns

`Uint8Array`

A `Uint8Array` representation of the input.

## Example

```ts
const bytes = toBytes("hello world");
```
