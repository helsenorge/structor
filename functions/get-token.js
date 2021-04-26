/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const { SignJWT } = require('jose/jwt/sign');
const { parseJwk } = require('jose/jwk/parse');
const clientContext = require('./util/client-context');
const qs = require('qs');
const cookie = require('cookie');
const CryptoJS = require('crypto-js');

function createCookie(token) {
    const hour = 3600000;
    const eightHours = 1 * 8 * hour;
    const ciphertext = CryptoJS.AES.encrypt(token, process.env.CINCINNO).toString();
    return cookie.serialize('auth_cookie', ciphertext, {
        secure: true,
        httpOnly: true,
        path: '/',
        maxAge: eightHours,
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.handler = async (event, context) => {
    const client = await clientContext.createClient();

    const code = event.queryStringParameters.code;
    const verifyCode = event.queryStringParameters.code_verifier;

    if (!code || !verifyCode) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Missing code or verifycode.',
            }),
        };
    }

    const privateKey = await parseJwk(JSON.parse(process.env.CLAVIS), 'PS256');

    const clientAssertionjwt = await new SignJWT({
        sub: process.env.CLIENT_ID,
        client_id: process.env.CLIENT_ID,
    })
        .setProtectedHeader({ alg: 'PS256' })
        .setIssuedAt()
        .setAudience(`${process.env.OPENID_ISSUER}/connect/token`)
        .setIssuer(process.env.CLIENT_ID || 'SET-CLIENT-ID')
        .setExpirationTime('60s')
        .sign(privateKey);

    const body = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.REACT_APP_URL}/code`,
        client_id: process.env.CLIENT_ID,
        code_verifier: verifyCode,
        scope: 'openid profile helseid://scopes/identity/pid helseid://scopes/identity/security_level',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: clientAssertionjwt,
    };

    const options = {
        url: `${process.env.OPENID_ISSUER}/connect/token`,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(body),
    };

    try {
        const tokenSetRespons = await axios(options);
        const { access_token } = tokenSetRespons.data;
        const userInfo = await client.userinfo(access_token);
        const accessCookie = createCookie(access_token);
        return {
            statusCode: 200,
            body: JSON.stringify(userInfo),
            headers: {
                'Set-Cookie': accessCookie,
                'Cache-Control': 'no-cache',
                'Content-Type': 'text/html',
            },
        };
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ message: 'User error', error }) };
    }
};
