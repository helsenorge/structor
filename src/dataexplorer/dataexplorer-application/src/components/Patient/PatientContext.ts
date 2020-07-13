import { createContext, Dispatch, SetStateAction, ReactText } from 'react';
import { IPatientIdentifier } from 'types/IPatient';

interface IPatientContext {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    patientId: string;
    setPatientId: Dispatch<SetStateAction<string>>;
    schemaNumber: string;
    setSchemanumber: Dispatch<SetStateAction<string>>;
    patient: IPatientIdentifier;
    setPatient: Dispatch<SetStateAction<IPatientIdentifier>>;
    comparableSchemaNumbers: ReactText[];
    setComparableSchemaNumbers: Dispatch<SetStateAction<ReactText[]>>;
}
export const PatientContext = createContext<IPatientContext>({
    name: '',
    setName: () => {},
    patientId: '',
    setPatientId: () => {},
    schemaNumber: '',
    setSchemanumber: () => {},
    patient: {} as IPatientIdentifier,
    setPatient: () => {},
    comparableSchemaNumbers: [],
    setComparableSchemaNumbers: () => {},
});

export const { Provider } = PatientContext;
