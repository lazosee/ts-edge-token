[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / pae

# Function: pae()

> **pae**(`pieces`): `Uint8Array`

Defined in: encoding/pae.ts:22

Computes PASETO Pre-Authentication Encoding (PAE).

PAE standardizes a list of arbitrary byte arrays into an unambiguous,
length-prefixed sequence to prevent canonicalization attacks.

Format:
`LE64(count) || LE64(len(p0)) || p0 || LE64(len(p1)) || p1 ...`

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pieces` | `Uint8Array`\<`ArrayBufferLike`\>[] | An array of `Uint8Array` buffers to encode in order. |

## Returns

`Uint8Array`

A single concatenated `Uint8Array` buffer containing the full PAE payload.

## Example

```ts
const encoded = pae([
  new TextEncoder().encode("v3.local."),
  nonce,
  ciphertext
]);
```
