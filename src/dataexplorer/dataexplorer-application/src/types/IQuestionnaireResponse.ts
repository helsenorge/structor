import { QuestionnaireResponseItem } from './fhirTypes/fhir';
import { Dayjs } from 'dayjs';

export interface IQuestionnaireResponse {
    entry: IEntry[];
    id: string;
}

export interface IEntry {
    fullUrl: string;
    resource: IResource;
}

export interface IResource {
    author: { reference: string };
    authored: Dayjs;
    id: string;
    item: QuestionnaireResponseItem[];
    meta: IMeta;
    status: string;
}

export interface IMeta {
    lastUpdated: Dayjs;
    versionId: string;
    resourceType: string;
}
