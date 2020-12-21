import { ContactDetail, Meta, UsageContext } from './fhir';

export enum IQuestionnaireMetadataType {
    title = 'title',
    description = 'description',
    // TODO Add more types
}

export interface IQuestionnaireMetadata {
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

export enum IQuestionnaireStatus {
    active = 'active',
    draft = 'draft',
    retired = 'retired',
    unknown = 'unknown',
}
