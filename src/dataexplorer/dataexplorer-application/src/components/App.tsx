import React, { useState, ReactNode } from 'react';
import Navigation from './Navigation/Navigation';
import { IPatientIdentifier } from 'types/IPatient';
import { Provider } from './Patient/PatientContext';

interface IStoreProviderProps {
    children: ReactNode;
}

export const StoreProvider = ({ children }: IStoreProviderProps) => {
    const [name, setName] = useState<string>('');
    const [patientId, setPatientId] = useState<string>('');
    const [schemaNumber, setSchemanumber] = useState<string>('');
    const [patient, setPatient] = useState<IPatientIdentifier>({} as IPatientIdentifier);
    return (
        <Provider
            value={{
                name,
                setName,
                patientId,
                setPatientId,
                schemaNumber,
                setSchemanumber,
                patient,
                setPatient,
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
