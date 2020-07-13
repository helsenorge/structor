import React, { useState, ReactNode, ReactText } from 'react';
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
    const [comparableSchemaNumbers, setComparableSchemaNumbers] = useState<ReactText[]>([]);
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
                comparableSchemaNumbers,
                setComparableSchemaNumbers,
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
