# @edgetoken/core

Fast, zero-dependency, edge-ready token engine for JSON Web Tokens (JWT) and PASETO v3.local powered exclusively by the standard W3C Web Cryptography API (`crypto.subtle`).

[![npm version](https://img.shields.io/npm/v/@edgetoken/core.svg)](https://www.npmjs.com/package/@edgetoken/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](package.json)
[![Edge Ready](https://img.shields.io/badge/Edge-Ready-brightgreen.svg)](#runtimes--compatibility)

---

## Features

- **Strictly Zero Dependencies:** Zero supply chain vulnerabilities, zero runtime dependencies (`dependencies: {}`).
- **Edge Native:** Built without Node-specific modules (`node:crypto`, `node:buffer`, `fs`). Runs natively in Cloudflare Workers, Fastly Compute, Deno, Bun, V8 isolates, Node.js, and browsers.
- **Cryptographically Robust:**
    - Compact JWS / JWT (RFC 7519) supporting HMAC-SHA (`HS256`, `HS384`, `HS512`).
    - PASETO v3.local authenticated encryption using HKDF-SHA384, AES-256-CTR, and HMAC-SHA384 with Pre-Authentication Encoding (PAE).
- **Anti-Confusion Guardrails:** Compile- and runtime-level rejection of insecure algorithms (such as the JWT `none` attack) and deterministic canonicalization via PAE.

---

## Installation

```bash
npm install @edgetoken/core
```

## Quickstart

### 1. JSON Web Tokens (JWT)

```ts
import { signJwt, verifyJwt } from '@edgetoken/core';

const secret = 'your-super-secret-signing-key';

// 1. Sign a token
const token = await signJwt(
  { sub: 'user_100', role: 'admin' },
  secret,
  {
    algorithm: 'HS256',
    expiresIn: 3600, // 1 hour
    issuer: 'auth.example.com',
    audience: 'api.example.com'
  }
);

// 2. Verify and extract claims
try {
  const claims = await verifyJwt(token, secret, {
    issuer: 'auth.example.com',
    audience: 'api.example.com'
  });
  console.log('Authenticated sub:', claims.sub);
} catch (err) {
  console.error('Invalid token:', err.message);
}
```
### 2. PASETO (v3.local Authenticated Encryption)

PASETO v3.local encrypts token claims so clients or intermediaries cannot read the contents.   

```ts
import { encryptPasetoV3Local, decryptPasetoV3Local } from '@edgetoken/core';

// PASETO v3.local requires a 32-byte symmetric key
const key = crypto.getRandomValues(new Uint8Array(32));

// 1. Encrypt payload
const token = await encryptPasetoV3Local(
  { accountId: 'acc_42', balance: 1200 },
  key,
  'kid:key_2026' // Optional unencrypted authenticated footer
);

// 2. Authenticate and decrypt
const { payload, footer } = await decryptPasetoV3Local(token, key);
console.log('Decrypted payload:', payload);
```


## API Reference

### Runtimes & Compatibility

| Runtime | Supported | Primitives Used |
| :--- | :---: | :--- |
| Cloudflare Workers | Yes | crypto.subtle, TextEncoder, TextDecoder |
| Deno / Bun | Yes | Web Cryptography standard globals |
| Node.js (>= 18) | Yes | Global crypto.subtle (Node 18+) |
| Modern Browsers | Yes | Native window.crypto.subtle |
| Vercel Edge Runtime | Yes | V8 isolate environment |


### Docs

[See API Docs](https://lazosee.github.io/ts-edge-token)

## License
MIT © 2026 Lazaro Osee. All rights reserved.















