export interface IQuestionnaireResponse {
    entry: IEntry[];
    id: string;
}

export interface IEntry {
    fullUrl: string;
    resource: fhir.QuestionnaireResponse;
}
