import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router-dom';
import SpinnerBox from '../components/Spinner/SpinnerBox';

const Code = (): JSX.Element => {
    const { t } = useTranslation();
    const [error, setError] = useState('');

    const history = useHistory();

    useEffect(() => {
        async function getToken() {
            const urlParams = window.location.search;
            const code_verifier = localStorage.getItem('code_verifier');

            if (urlParams && code_verifier) {
                try {
                    let response = await fetch(
                        `.netlify/functions/get-token${urlParams}&code_verifier=${code_verifier}`,
                    );
                    if (response.ok) {
                        response = await response.json();
                        localStorage.setItem('code_verifier', '');
                        sessionStorage.setItem('profile', JSON.stringify(response));
                        history.replace('/');
                    } else {
                        throw new Error(`Server status: ${response.status}`);
                    }
                } catch (err) {
                    console.error('Error!', err);
                    setError(() => `Noe gikk galt, kontakt admin.`);
                }
            }
        }

        getToken();
    }, [history]);

    return (
        <div className="login">
            <h1>{t('Logging in..')}</h1>
            <div className="align-everything">
                {!error && <SpinnerBox />} {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
};

export default Code;
