/* eslint-disable @typescript-eslint/no-var-requires */
const { Issuer } = require('openid-client');
const cookie = require('cookie');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.handler = async (event, context) => {
    const cookies = cookie.parse(event.headers.cookie);

    if (!cookies || !cookies.auth_cookie) {
        return { statusCode: 400, body: 'missing cookie..' };
    }

    const ehelseIssuer = await Issuer.discover(`${process.env.OPENID_ISSUER}/.well-known/openid-configuration`);

    const client = new ehelseIssuer.Client({
        client_id: process.env.CLIENT_ID,
        redirect_uris: [`${process.env.REACT_APP_URL}/code`],
        response_types: ['code'],
    });

    const redirectUri = client.endSessionUrl({
        id_token_hint: cookies.auth_cookie,
        post_logout_redirect_uri: `${process.env.REACT_APP_URL}/`,
    });

    const clearAuthCookie = cookie.serialize('auth_cookie', '', {
        secure: true,
        httpOnly: true,
        path: '/',
        maxAge: 0,
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ url: redirectUri }),
        headers: {
            'Set-Cookie': clearAuthCookie,
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/html',
        },
    };
};
