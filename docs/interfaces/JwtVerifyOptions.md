[**@edgetoken/core**](../README.md)

***

[@edgetoken/core](../README.md) / JwtVerifyOptions

# Interface: JwtVerifyOptions

Defined in: jwt/index.ts:45

Verification criteria and constraints when validating a JSON Web Token.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-audience"></a> `audience?` | `string` \| `string`[] | If provided, validates that the token's `aud` claim matches this audience. | jwt/index.ts:54 |
| <a id="property-issuer"></a> `issuer?` | `string` | If provided, validates that the token's `iss` claim matches this value. | jwt/index.ts:49 |
