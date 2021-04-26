/* eslint-disable @typescript-eslint/no-var-requires */
const clientContext = require('./util/client-context');
const cookie = require('cookie');
const CryptoJS = require('crypto-js');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.handler = async (event, context) => {
    const cookies = cookie.parse(event.headers.cookie);

    if (!cookies || !cookies.auth_cookie) {
        return { statusCode: 400, body: 'missing cookie..' };
    }

    const bytes = CryptoJS.AES.decrypt(cookies.auth_cookie, process.env.CINCINNO);
    const access_token = bytes.toString(CryptoJS.enc.Utf8);

    const client = await clientContext.createClient();

    const redirectUri = client.endSessionUrl({
        id_token_hint: access_token,
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
