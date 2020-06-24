import { useState, useEffect } from 'react';

const useFetch = <T extends any>(
    endpoint: string,
    update?: any,
    options: RequestInit = {},
) => {
    const [response, setResponse] = useState<T>();
    const [error, setError] = useState('');

    useEffect(() => {
        let isSubscribed = true;
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/${endpoint}`, options);
                if (!res.ok) {
                    throw new Error(`${res.status} ${res.statusText}`);
                }
                const json = await res.json();
                if (!isSubscribed) {
                    return;
                }
                setResponse(json);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
        return () => {
            isSubscribed = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    return { response, error };
};

export const apiUrl = process.env.REACT_APP_API_BASE_URL;

export default useFetch;
