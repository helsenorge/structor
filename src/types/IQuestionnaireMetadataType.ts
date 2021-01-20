import { ContactDetail, Extension, Meta, UsageContext } from './fhir';

export enum IQuestionnaireMetadataType {
    title = 'title',
    description = 'description',
    name = 'name',
    id = 'id',
    status = 'status',
    publisher = 'publisher',
    language = 'language',
    url = 'url',
    purpose = 'purpose',
    copyright = 'copyright',
}

export interface IQuestionnaireMetadata {
    url?: string;
    id?: string;
    resourceType?: string;
    language?: string;
    name?: string;
    title?: string;
    description?: string;
    version?: string;
    status?: string;
    publisher?: string;
    meta?: Meta;
    useContext?: Array<UsageContext>;
    contact?: Array<ContactDetail>;
    subjectType?: Array<string>;
    extension?: Array<Extension>;
    purpose?: string;
    copyright?: string;
}

export enum IQuestionnaireStatus {
    active = 'active',
    draft = 'draft',
    retired = 'retired',
    unknown = 'unknown',
}
