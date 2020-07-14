export interface IQuestionnaire {
    entry: IEntry[];
    id: string;
    total: number;
}

export interface IEntry {
    fullUrl: string;
    resource: fhir.Questionnaire;
}
