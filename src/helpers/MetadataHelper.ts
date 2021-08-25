import { IQuestionnaireStatus } from '../types/IQuestionnaireMetadataType';

export const metadataOperators = [
    {
        code: IQuestionnaireStatus.active,
        display: 'Active',
    },
    {
        code: IQuestionnaireStatus.draft,
        display: 'Draft',
    },
    {
        code: IQuestionnaireStatus.retired,
        display: 'Retired',
    },
    {
        code: IQuestionnaireStatus.unknown,
        display: 'Unknown',
    },
];

export const presentationButtons = [
    { code: '', display: 'Floating at the bottom of the screen (standard setting)' },
    { code: 'none', display: 'No button bar' },
    { code: 'static', display: 'Static (at the bottom of the questionnaire)' },
];

export const canBePerformedBy = [
    { code: '', display: 'Questionnaire can be answered by a representative (standard setting)' },
    { code: '2', display: 'Can only be answered by logged in patient' },
];

export const authenticationRequirement = [
    { code: '', display: 'Required (standard setting)' },
    { code: '1', display: 'Anonymous' },
    { code: '2', display: 'Optional' },
];

export const saveCapability = [
    { code: '', display: 'Save submitted questionnaire and intermediate save (standard setting)' },
    { code: '2', display: 'Only submitted questionnaire is saved' },
    { code: '3', display: 'No saving' },
];

export const isValidId = (value: string): boolean => {
    const regExp = /^[A-Za-z0-9-.]{1,64}$/;
    return regExp.test(value);
};

export const isValidTechnicalName = (value: string, stateValue?: string): boolean => {
    // Allow name not matching regex if imported and unchanged
    if (stateValue && value === stateValue) {
        return true;
    }
    const regExp = /^[A-Z]([A-Za-z0-9_]){0,254}$/;
    return regExp.test(value);
};
