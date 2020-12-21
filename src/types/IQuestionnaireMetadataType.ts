import { ContactDetail, Meta, UsageContext } from './fhir';

export enum IQuestionnaireMetadataType {
    title = 'title',
    description = 'description',
    id = 'id',
    status = 'status',
    publisher = 'publisher',
    language = 'language',
    url = 'url',
}

export interface IQuestionnaireMetadata {
    url?: string;
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

export enum IQuestionnaireStatus {
    active = 'active',
    draft = 'draft',
    retired = 'retired',
    unknown = 'unknown',
}
