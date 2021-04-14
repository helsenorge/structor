const { generators, Issuer } = require('openid-client');

exports.handler = async (event, context) => {
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const ehelseIssuer = await Issuer.discover('https://helseid-sts.test.nhn.no/.well-known/openid-configuration');

    const client = new ehelseIssuer.Client({
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uris: [process.env.REACT_APP_REDIRECT_URI],
        response_types: ['code'],
    });

    let authUrl = client.authorizationUrl({
        redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        scope: 'openid profile helseid://scopes/identity/pid helseid://scopes/identity/security_level',
        response_type: 'code',
        code_challenge,
        code_challenge_method: 'S256',
    });

    return { statusCode: 200, body: JSON.stringify({ code_verifier, auth_url: authUrl }) };
};
