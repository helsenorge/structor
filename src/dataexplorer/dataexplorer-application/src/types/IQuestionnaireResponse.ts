export interface IQuestionnaireResponse {
    entry: IEntry[];
    id: string;
    total?: number;
}

export interface IEntry {
    fullUrl: string;
    resource: fhir.QuestionnaireResponse;
}

export interface IQuestionnaireResponses {
    id: string;
    meta: IQRmetaData;
    questionnaire: IQRReference;
}

export interface IQRIdentifier {
    entry: IQRResource[];
    total: number;
}

export interface IQRResource {
    resource: IQuestionnaireResponses;
}

export interface IQRmetaData {
    lastUpdated: string;
}

export interface IQRReference {
    reference: string;
}
