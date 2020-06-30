import { QuestionnaireResponse } from './fhirTypes/fhir';

export interface IQuestionnaireResponse {
    entry: IEntry[];
    id: string;
}

export interface IEntry {
    fullUrl: string;
    resource: QuestionnaireResponse;
}
