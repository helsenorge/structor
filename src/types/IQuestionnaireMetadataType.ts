import { ContactDetail, Extension, Meta, UsageContext } from './fhir';

export enum IQuestionnaireMetadataType {
    title = 'title',
    description = 'description',
    name = 'name',
    id = 'id',
    status = 'status',
    date = 'date',
    publisher = 'publisher',
    contact = 'contact',
    language = 'language',
    url = 'url',
    purpose = 'purpose',
    copyright = 'copyright',
    meta = 'meta',
    extension = 'extension',
    version = 'version',
    useContext = 'useContext',
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
    date?: string;
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
