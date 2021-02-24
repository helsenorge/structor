export type Language = {
    code: string;
    display: string;
    localDisplay: string;
};

export enum TranslatableMetadataProperty {
    title = 'title',
    description = 'description',
    publisher = 'publisher',
    purpose = 'purpose',
    copyright = 'copyright',
}

export type MetadataProperty = {
    propertyName: TranslatableMetadataProperty;
    label: string;
    markdown?: boolean;
};
