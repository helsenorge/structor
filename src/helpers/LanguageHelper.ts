import {
    Language,
    MetadataProperty,
    SettingsProperty,
    TranslatableItemProperty,
    TranslatableMetadataProperty,
} from '../types/LanguageTypes';
import { Languages, TreeState } from '../store/treeStore/treeStore';
import { isValidId } from './MetadataHelper';
import { IExtentionType } from '../types/IQuestionnareItemType';
import { Extension } from '../types/fhir';

export const INITIAL_LANGUAGE: Language = { code: 'nb-NO', display: 'Bokmål', localDisplay: 'Bokmål' };

export const supportedLanguages: Language[] = [
    INITIAL_LANGUAGE,
    { code: 'nn-NO', display: 'Nynorsk', localDisplay: 'Nynorsk' },
    { code: 'se-NO', display: 'Samisk', localDisplay: 'Davvisámegillii' },
    { code: 'en-GB', display: 'Engelsk', localDisplay: 'English' },
    { code: 'pl-PL', display: 'Polsk', localDisplay: 'Polskie' },
    { code: 'ro-RO', display: 'Rumensk', localDisplay: 'Română' },
    { code: 'lt-LT', display: 'Litauisk', localDisplay: 'Lietuvis' },
    { code: 'ru-RU', display: 'Russisk', localDisplay: 'русский' },
    { code: 'fr-FR', display: 'Fransk', localDisplay: 'Français' },
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

export const isUniqueAcrossLanguages = (
    propertyName: TranslatableMetadataProperty,
    value: string,
    { qAdditionalLanguages, qMetadata }: TreeState,
    targetLanguage: string,
): boolean => {
    if (!qAdditionalLanguages || Object.keys(qAdditionalLanguages).length < 1) {
        return false;
    }
    const usedPropertyValues: string[] = [];
    const mainPropertyValue = String(qMetadata[propertyName]);
    if (mainPropertyValue) {
        usedPropertyValues.push(mainPropertyValue);
    }
    Object.entries(qAdditionalLanguages)
        .filter(([languageCode]) => languageCode !== targetLanguage)
        .forEach(([, translation]) => {
            usedPropertyValues.push(translation.metaData[propertyName]);
        });
    return !usedPropertyValues.some((usedValue) => usedValue === value);
};

export const translatableMetadata: MetadataProperty[] = [
    {
        propertyName: TranslatableMetadataProperty.title,
        label: 'Tittel',
        markdown: false,
        validate: undefined,
    },
    {
        propertyName: TranslatableMetadataProperty.id,
        label: 'Id',
        markdown: false,
        validate: (value: string, state?: TreeState, targetLanguage?: string): string => {
            if (!isValidId(value)) {
                return 'Id must be 1-64 characters and only letters a-z, numbers, - and .';
            }
            if (
                state &&
                targetLanguage &&
                !isUniqueAcrossLanguages(TranslatableMetadataProperty.id, value, state, targetLanguage)
            ) {
                return 'Id must be unique across languages';
            }
            return '';
        },
    },
    {
        propertyName: TranslatableMetadataProperty.description,
        label: 'Description',
        markdown: false,
        validate: undefined,
    },
    {
        propertyName: TranslatableMetadataProperty.publisher,
        label: 'Publisher',
        markdown: false,
        validate: undefined,
    },
    {
        propertyName: TranslatableMetadataProperty.purpose,
        label: 'Purpose',
        markdown: true,
        validate: undefined,
    },
    {
        propertyName: TranslatableMetadataProperty.copyright,
        label: 'Copyright',
        markdown: true,
        validate: undefined,
    },
];

export const translatableSettings: { [key in IExtentionType]?: SettingsProperty } = {
    [IExtentionType.printVersion.toString()]: {
        extension: IExtentionType.printVersion,
        label: 'Print version',
        generate: (value: string): Extension => {
            return {
                url: IExtentionType.printVersion,
                valueReference: {
                    reference: value,
                },
            };
        },
        getValue: (e: Extension): string | undefined => {
            return e?.valueReference?.reference;
        },
    },
};

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
