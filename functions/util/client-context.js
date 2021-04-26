/* eslint-disable @typescript-eslint/no-var-requires */
const { Issuer } = require('openid-client');

const createClient = async () => {
    const ehelseIssuer = await Issuer.discover(`${process.env.OPENID_ISSUER}/.well-known/openid-configuration`);

    return new ehelseIssuer.Client({
        client_id: process.env.CLIENT_ID,
        redirect_uris: [`${process.env.REACT_APP_URL}/code`],
        response_types: ['code'],
    });
};

exports.createClient = createClient;
