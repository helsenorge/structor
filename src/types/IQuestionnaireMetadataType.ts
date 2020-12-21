import { ContactDetail, Meta, UsageContext } from './fhir';

export enum IQuestionnaireMetadataType {
    title = 'title',
    description = 'description',
    id = 'id',
    // TODO Add more types
}

export interface IQuestionnaireMetadata {
    id?: string;
    resourceType?: string;
    language?: string;
    name?: string;
    title?: string;
    description?: string;
    status?: string;
    publisher?: string;
    meta?: Meta;
    useContext?: Array<UsageContext>;
    contact?: Array<ContactDetail>;
    subjectType?: Array<string>;
}
