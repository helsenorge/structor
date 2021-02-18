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

export const presentationButtons = [
    { code: 'none', display: 'Ingen' },
    { code: 'static', display: 'Fast' },
    { code: 'sticky', display: 'Flytende' },
];

export const canBePerformedBy = [
    { code: '1', display: 'Default' },
    { code: '2', display: 'SubjectOnly' },
];
