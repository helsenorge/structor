import { createContext, Dispatch, SetStateAction, ReactText } from 'react';
import { IPatientIdentifier } from 'types/IPatient';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import { IQuestionnaire } from 'types/IQuestionnaire';

interface IGlobalContext {
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
    questionnaire: IQuestionnaire;
    setQuestionnaire: Dispatch<SetStateAction<IQuestionnaire>>;
    questionnaireResponse: IQuestionnaireResponse;
    setQuestionnaireResponse: Dispatch<SetStateAction<IQuestionnaireResponse>>;
}
export const GlobalContext = createContext<IGlobalContext>({
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
    questionnaire: {} as IQuestionnaire,
    setQuestionnaire: () => {},
    questionnaireResponse: {} as IQuestionnaireResponse,
    setQuestionnaireResponse: () => {},
});

export const { Provider } = GlobalContext;
