import { TreeState } from '../store/treeStore/treeStore';
import { Extension } from './fhir';
import { IExtentionType } from './IQuestionnareItemType';

export type Language = {
    code: string;
    display: string;
    localDisplay: string;
};

export enum TranslatableMetadataProperty {
    id = 'id',
    title = 'title',
    description = 'description',
    publisher = 'publisher',
    purpose = 'purpose',
    copyright = 'copyright',
}

export type MetadataProperty = {
    propertyName: TranslatableMetadataProperty;
    label: string;
    markdown: boolean;
    validate?: (value: string, state?: TreeState, targetLanguage?: string) => string;
};

export type SettingsProperty = {
    extension: IExtentionType;
    label: string;
    generate: (value: string) => Extension;
    getValue: (extension: Extension) => string | undefined;
};

export enum TranslatableItemProperty {
    initial = 'initial',
    text = 'text',
    validationText = 'validationText',
    entryFormatText = 'entryFormatText',
    sublabel = 'sublabel',
    repeatsText = 'repeatsText',
    prefix = 'prefix',
}
