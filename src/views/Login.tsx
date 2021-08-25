import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Login.css';

import SpinnerBox from '../components/Spinner/SpinnerBox';

interface AuthPayload extends Response {
    code_verifier: string;
    auth_url: string;
}

const Login = (): JSX.Element => {
    const { t } = useTranslation();
    const [error, setError] = useState('');
    useEffect(() => {
        async function doFetch() {
            try {
                const response = await fetch('.netlify/functions/authorization-code');
                const payload = (await response.json()) as AuthPayload;
                localStorage.setItem('code_verifier', payload.code_verifier);
                location.href = payload.auth_url;
            } catch (err) {
                console.error('Error!', err);
                setError(() => `Æsj da, noe gikk galt, kontakt admin.`);
            }
        }

        doFetch();
    }, []);

    return (
        <div className="login">
            <h1>{t('Logging in..')}</h1>
            <div className="align-everything">
                {!error && <SpinnerBox />} {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
