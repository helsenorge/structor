const { Issuer } = require('openid-client');

exports.handler = async (event, context) => {
    console.log(event.headers);
    return {
        statusCode: 200,
    };
    /*const ehelseIssuer = await Issuer.discover('https://helseid-sts.test.nhn.no/.well-known/openid-configuration');
    const client = new ehelseIssuer.Client({
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uris: [process.env.REACT_APP_REDIRECT_URI],
        response_types: ['code'],
    });
    const userInfo = await client.userinfo(access_token);
    return {
        statusCode: 200,
        body: JSON.stringify(userInfo),
    };*/
};
