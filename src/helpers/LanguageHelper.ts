import {
    Language,
    MetadataProperty,
    TranslatableItemProperty,
    TranslatableMetadataProperty,
} from '../types/LanguageTypes';
import { Languages, TreeState } from '../store/treeStore/treeStore';

export const supportedLanguages: Language[] = [
    { code: 'nb-no', display: 'Norsk Bokmål', localDisplay: 'Norsk bokmål' },
    { code: 'nn-no', display: 'Nynorsk', localDisplay: 'Norsk nynorsk' },
    { code: 'se-no', display: 'Samisk', localDisplay: 'Davvisámegillii' },
    { code: 'en-gb', display: 'Engelsk', localDisplay: 'English' },
    { code: 'pl-PL', display: 'Polsk', localDisplay: 'Polskie' },
    { code: 'ro-RO', display: 'Rumensk', localDisplay: 'Română' },
    { code: 'lt-LT', display: 'Litauisk', localDisplay: 'Lietuvis' },
    { code: 'ru-RU', display: 'Russisk', localDisplay: 'русский' },
];

export const getLanguageFromCode = (languageCode: string): Language | undefined => {
    return supportedLanguages.find((x) => x.code.toLowerCase() === languageCode.toLowerCase());
};

export const isSupportedLanguage = (languageCode: string): boolean => {
    return supportedLanguages.some((lang) => lang.code.toLowerCase() === languageCode.toLowerCase());
};

export const getLanguagesInUse = ({ qMetadata, qAdditionalLanguages }: TreeState): Language[] => {
    return supportedLanguages.filter(
        (x) =>
            qMetadata.language?.toLowerCase() === x.code.toLowerCase() ||
            (qAdditionalLanguages && qAdditionalLanguages[x.code]),
    );
};

export const translatableMetadata: MetadataProperty[] = [
    { propertyName: TranslatableMetadataProperty.title, label: 'Tittel', markdown: false, mustBeUnique: false },
    { propertyName: TranslatableMetadataProperty.id, label: 'Id', markdown: false, mustBeUnique: true },
    {
        propertyName: TranslatableMetadataProperty.description,
        label: 'Beskrivelse',
        markdown: false,
        mustBeUnique: false,
    },
    { propertyName: TranslatableMetadataProperty.publisher, label: 'Utsteder', markdown: false, mustBeUnique: false },
    { propertyName: TranslatableMetadataProperty.purpose, label: 'Formål', markdown: true, mustBeUnique: false },
    { propertyName: TranslatableMetadataProperty.copyright, label: 'Copyright', markdown: true, mustBeUnique: false },
];

export const getItemPropertyTranslation = (
    languageCode: string,
    languages: Languages,
    linkId: string,
    property: TranslatableItemProperty,
): string => {
    if (!languages[languageCode].items[linkId]) {
        return '';
    }
    return languages[languageCode].items[linkId][property] || '';
};
