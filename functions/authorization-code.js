// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookie = require('cookie');

var exhangeCodeWithJwt = (code) => {
    console.log('will exchange code into jwt!');
    if (code.length === 4) {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicGlkIjoiMDEwMjg5MDAxOTQiLCJpYXQiOjE1MTYyMzkwMjJ9.qAvuSc8nV94pf3qcCF2Jl-333zk5BBMe1Z8v7Uboakc';
    }

    return '';
};

exports.handler = async (event, context) => {
    var code = event.queryStringParameters.code;
    if (!code) {
        console.log('code is missing!');
        return { statusCode: 401, body: 'code is missing!' };
    }

    var jwtToken = exhangeCodeWithJwt(code);
    if (jwtToken.length > 0) {
        const hour = 3600000;
        const twoWeeks = 14 * 24 * hour;
        const myCookie = cookie.serialize('jwt', jwtToken, {
            secure: false,
            httpOnly: true,
            path: '/',
            maxAge: twoWeeks,
        });

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': myCookie,
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ success: true }),
        };
    }

    return { statusCode: 401, body: 'JWT mangler!' };
};
