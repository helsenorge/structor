/* eslint-disable @typescript-eslint/no-var-requires */
const { generators } = require('openid-client');
const clientContext = require('./util/client-context');
const CryptoJS = require('crypto-js');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.handler = async (event, context) => {
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);

    const client = await clientContext.createClient();

    let authUrl = client.authorizationUrl({
        redirect_uri: `${process.env.REACT_APP_URL}/code`,
        scope: 'openid profile helseid://scopes/identity/pid helseid://scopes/identity/security_level',
        response_type: 'code',
        code_challenge,
        code_challenge_method: 'S256',
    });

    const key = CryptoJS.AES.encrypt(code_verifier, process.env.CINCINNO).toString();

    return { statusCode: 200, body: JSON.stringify({ code_verifier: key, auth_url: authUrl }) };
};
