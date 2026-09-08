[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / JwtSignOptions

# Interface: JwtSignOptions

Defined in: jwt/index.ts:12

Configuration options for generating a signed JSON Web Token.

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-algorithm"></a> `algorithm?` | `"HS256"` \| `"HS384"` \| `"HS512"` | `'HS256'` | The HMAC hashing algorithm to use. | jwt/index.ts:17 |
| <a id="property-audience"></a> `audience?` | `string` \| `string`[] | `undefined` | Identifies the recipients that the JWT is intended for (`aud` claim). | jwt/index.ts:39 |
| <a id="property-expiresin"></a> `expiresIn?` | `number` | `undefined` | Token lifetime in seconds from issuance. Sets the `exp` claim (`Date.now() / 1000 + expiresIn`). | jwt/index.ts:23 |
| <a id="property-issuer"></a> `issuer?` | `string` | `undefined` | Identifies the principal that issued the JWT (`iss` claim). | jwt/index.ts:34 |
| <a id="property-notbefore"></a> `notBefore?` | `number` | `undefined` | Number of seconds before this token becomes active. Sets the `nbf` claim (`Date.now() / 1000 + notBefore`). | jwt/index.ts:29 |
