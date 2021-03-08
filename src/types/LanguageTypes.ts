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
    mustBeUnique: boolean;
};

export enum TranslatableItemProperty {
    text = 'text',
    validationText = 'validationText',
    entryFormatText = 'entryFormatText',
}
