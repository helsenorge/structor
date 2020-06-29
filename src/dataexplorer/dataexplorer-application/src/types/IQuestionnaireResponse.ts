import {
    QuestionnaireResponse,
    QuestionnaireItem,
    QuestionnaireResponseItem,
} from './fhirTypes/fhir';

export interface IQuestionnaireResponse {
    entry: IEntry[];
    id: string;
}

export interface IEntry {
    fullUrl: string;
    resource: QuestionnaireResponse;
}

export interface IAnswer {
    id: string;
    answers: QuestionnaireResponseItem;
}
export interface IQuestion {
    id: string;
    answers: QuestionnaireItem;
}
