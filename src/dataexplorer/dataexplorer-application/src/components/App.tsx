import React, { useState, ReactNode, ReactText } from 'react';
import Navigation from './Navigation/Navigation';
import { IPatientIdentifier } from 'types/IPatient';
import { Provider } from './Patient/PatientContext';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import { IQuestionnaire } from 'types/IQuestionnaire';

interface IStoreProviderProps {
    children: ReactNode;
}

export const StoreProvider = ({ children }: IStoreProviderProps) => {
    const [name, setName] = useState<string>('');
    const [patientId, setPatientId] = useState<string>('');
    const [schemaNumber, setSchemanumber] = useState<string>('');
    const [patient, setPatient] = useState<IPatientIdentifier>({} as IPatientIdentifier);
    const [comparableSchemaNumbers, setComparableSchemaNumbers] = useState<ReactText[]>([]);
    const [questionnaire, setQuestionnaire] = useState<IQuestionnaire>({} as IQuestionnaire);
    const [questionnaireResponse, setQuestionnaireResponse] = useState<IQuestionnaireResponse>(
        {} as IQuestionnaireResponse,
    );
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
                questionnaire,
                setQuestionnaire,
                questionnaireResponse,
                setQuestionnaireResponse,
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
