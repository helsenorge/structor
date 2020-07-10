import React, { useState, ReactNode } from 'react';
import Navigation from './Navigation/Navigation';
import { Provider } from './Navigation/Breadcrumbs/BreadcrumbContext';

interface IStoreProviderProps {
    children: ReactNode;
}

export const StoreProvider = ({ children }: IStoreProviderProps) => {
    const [name, setName] = useState<string>('');
    const [patientId, setPatientId] = useState<string>('');
    const [schemaNumber, setSchemanumber] = useState<string>('');
    return (
        <Provider
            value={{
                name,
                setName,
                patientId,
                setPatientId,
                schemaNumber,
                setSchemanumber,
            }}
        >
            {children}
        </Provider>
    );
};

const App = () => (
    <>
        <StoreProvider>
            <Navigation />
        </StoreProvider>
    </>
);

export default App;
