import React, { useEffect, useState } from 'react';
import './Login.css';
import SpinnerBox from '../components/Spinner/SpinnerBox';

const Login = (): JSX.Element => {
    const [error, setError] = useState('');
    useEffect(() => {
        function delay(n: number) {
            return new Promise(function (resolve) {
                setTimeout(resolve, n * 1000);
            });
        }

        async function doFetch() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            await delay(5);
            if (code) {
                try {
                    let response = await fetch(`.netlify/functions/authorization-code?code=${code}`);
                    response = await response.json();
                    console.log(response);
                    window.location.href = '/';
                } catch (err) {
                    console.error('Error!', err);
                    setError(() => `Æsj da, koden: ${code} fungerte ikke som forventet, kontakt admin.`);
                }
            }
        }

        doFetch();
    }, []);

    return (
        <div className="login">
            <h1>Logger inn..</h1>
            <div className="align-everything">
                {!error && <SpinnerBox />} {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
