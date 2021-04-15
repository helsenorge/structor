// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');

exports.handler = async function () {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');

    return {
        statusCode: 200,
        body: JSON.stringify({ data: response.data, key: process.env.KEY || 'NO-KEY :(' }),
    };
};
