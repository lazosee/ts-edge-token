/**
 * Computes PASETO Pre-Authentication Encoding (PAE).
 *
 * PAE standardizes a list of arbitrary byte arrays into an unambiguous,
 * length-prefixed sequence to prevent canonicalization attacks.
 *
 * Format:
 * `LE64(count) || LE64(len(p0)) || p0 || LE64(len(p1)) || p1 ...`
 *
 * @param {Uint8Array[]} pieces - An array of `Uint8Array` buffers to encode in order.
 * @returns A single concatenated `Uint8Array` buffer containing the full PAE payload.
 *
 * @example
 * ```ts
 * const encoded = pae([
 *   new TextEncoder().encode("v3.local."),
 *   nonce,
 *   ciphertext
 * ]);
 * ```
 */
export function pae(pieces: Uint8Array[]): Uint8Array {
    let totalLength = 8;
    for (const p of pieces) {
        totalLength += 8 + p.length;
    }

    const buffer = new Uint8Array(totalLength);
    const view = new DataView(buffer.buffer);

    // Write the total count of pieces as an unsigned 64-bit little-endian integer
    view.setBigUint64(0, BigInt(pieces.length), true);
    let offset = 8;

    for (const p of pieces) {
        // Write length of current piece as 64-bit little-endian int
        view.setBigUint64(offset, BigInt(p.length), true);
        offset += 8;
        // Copy the piece bytes
        buffer.set(p, offset);
        offset += p.length;
    }

    return buffer;
}