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

export const isValidId = (value: string, stateValue: string | undefined): boolean => {
    // Allow id not matching regex if imported and unchanged
    if (stateValue && value === stateValue) {
        return true;
    }
    const regExp = /^[A-Za-z0-9-.]{1,64}$/;
    return regExp.test(value);
};

export const isValidTechnicalName = (value: string, stateValue: string | undefined): boolean => {
    // Allow name not matching regex if imported and unchanged
    if (stateValue && value === stateValue) {
        return true;
    }
    const regExp = /^[A-Z]([A-Za-z0-9_]){0,254}$/;
    return regExp.test(value);
};
