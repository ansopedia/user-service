accessToken: This is the token that your application receives from the OAuth provider (in this case, Google) after the user has authenticated. This token is used to make authenticated requests on behalf of the user.

refreshToken: This is the token that your application can use to obtain new access tokens when the current access token expires. This field is optional because not all OAuth providers issue refresh tokens.

tokenExpiryDate: This is the date and time when the current access token expires. This field is also optional because not all OAuth providers include the expiry time in their responses.
