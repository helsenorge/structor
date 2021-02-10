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

export const metadataLanguage = [
    { code: 'nb-no', display: 'Norsk Bokmål', localDisplay: 'Norsk bokmål' },
    { code: 'nn-no', display: 'Nynorsk', localDisplay: 'Norsk nynorsk' },
    { code: 'se-no', display: 'Samisk', localDisplay: 'Davvisámegillii' },
    { code: 'en-gb', display: 'Engelsk', localDisplay: 'English' },
];
