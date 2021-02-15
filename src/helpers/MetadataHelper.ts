import { IQuestionnaireStatus } from '../types/IQuestionnaireMetadataType';

export const metadataOperators = [
    {
        code: IQuestionnaireStatus.active,
        display: 'Aktiv',
    },
    {
        code: IQuestionnaireStatus.draft,
        display: 'Skisse',
    },
    {
        code: IQuestionnaireStatus.retired,
        display: 'Avsluttet',
    },
    {
        code: IQuestionnaireStatus.unknown,
        display: 'Ukjent',
    },
];

interface Language {
    code: string;
    display: string;
    localDisplay: string;
}

export const metadataLanguage: Language[] = [
    { code: 'nb-no', display: 'Norsk Bokmål', localDisplay: 'Norsk bokmål' },
    { code: 'nn-no', display: 'Nynorsk', localDisplay: 'Norsk nynorsk' },
    { code: 'se-no', display: 'Samisk', localDisplay: 'Davvisámegillii' },
    { code: 'en-gb', display: 'Engelsk', localDisplay: 'English' },
];

export const getLanguageFromCode = (languageCode: string): Language | undefined => {
    return metadataLanguage.find((x) => x.code.toLowerCase() === languageCode.toLowerCase());
};

export const presentationButtons = [
    { code: 'none', display: 'Ingen' },
    { code: 'static', display: 'Fast' },
    { code: 'sticky', display: 'Flytende' },
];

export const canBePerformedBy = [
    { code: '1', display: 'Default' },
    { code: '2', display: 'SubjectOnly' },
];
