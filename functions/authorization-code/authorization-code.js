// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generators, Issuer } = require('openid-client');

exports.handler = async (event, context) => {
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const ehelseIssuer = await Issuer.discover(`${process.env.OPENID_ISSUER}/.well-known/openid-configuration`);

    const client = new ehelseIssuer.Client({
        client_id: process.env.CLIENT_ID,
        redirect_uris: [`${process.env.REACT_APP_URL}/code`],
        response_types: ['code'],
    });

    let authUrl = client.authorizationUrl({
        redirect_uri: `${process.env.REACT_APP_URL}/code`,
        scope: 'openid profile helseid://scopes/identity/pid helseid://scopes/identity/security_level',
        response_type: 'code',
        code_challenge,
        code_challenge_method: 'S256',
    });

    return { statusCode: 200, body: JSON.stringify({ code_verifier, auth_url: authUrl }) };
};
