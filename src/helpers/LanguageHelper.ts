import { Language, MetadataProperty, TranslatableMetadataProperty } from '../types/LanguageTypes';
import { Languages, TreeState } from '../store/treeStore/treeStore';

export const supportedLanguages: Language[] = [
    { code: 'nb-no', display: 'Norsk Bokmål', localDisplay: 'Norsk bokmål' },
    { code: 'nn-no', display: 'Nynorsk', localDisplay: 'Norsk nynorsk' },
    { code: 'se-no', display: 'Samisk', localDisplay: 'Davvisámegillii' },
    { code: 'en-gb', display: 'Engelsk', localDisplay: 'English' },
];

export const getLanguageFromCode = (languageCode: string): Language | undefined => {
    return supportedLanguages.find((x) => x.code.toLowerCase() === languageCode.toLowerCase());
};

export const getLanguagesInUse = ({ qMetadata, qAdditionalLanguages }: TreeState): Language[] => {
    return supportedLanguages.filter(
        (x) =>
            qMetadata.language?.toLowerCase() === x.code.toLowerCase() ||
            (qAdditionalLanguages && qAdditionalLanguages[x.code.toLowerCase()]),
    );
};

export const translatableMetadata: MetadataProperty[] = [
    { propertyName: TranslatableMetadataProperty.title, label: 'Tittel', markdown: false },
    { propertyName: TranslatableMetadataProperty.description, label: 'Beskrivelse', markdown: false },
    { propertyName: TranslatableMetadataProperty.publisher, label: 'Utsteder', markdown: false },
    { propertyName: TranslatableMetadataProperty.purpose, label: 'Formål', markdown: true },
    { propertyName: TranslatableMetadataProperty.copyright, label: 'Copyright', markdown: true },
];

export const getHelpTextTranslation = (languageCode: string, languages: Languages, linkId: string): string => {
    if (!languageCode || !languages || !languages[languageCode] || !languages[languageCode].items[linkId]) {
        return '';
    }
    return languages[languageCode].items[linkId].text;
};
