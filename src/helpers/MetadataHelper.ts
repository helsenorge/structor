import { IQuestionnaireStatus } from '../types/IQuestionnaireMetadataType';
import { UseContextSystem } from '../types/IQuestionnareItemType';

export const questionnaireStatusOptions = [
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
    { code: 'sticky', display: 'Floating at the bottom of the screen (standard setting)' },
    { code: 'none', display: 'No button bar' },
    { code: 'static', display: 'Static (at the bottom of the questionnaire)' },
];

export const canBePerformedBy = [
    { code: '1', display: 'Questionnaire can be answered by a representative (standard setting)' },
    { code: '2', display: 'Can only be answered by logged in patient' },
];

export const authenticationRequirement = [
    { code: '3', display: 'Required (standard setting)' },
    { code: '1', display: 'Anonymous' },
    { code: '2', display: 'Optional' },
];

export const saveCapability = [
    { code: '1', display: 'Save submitted questionnaire and intermediate save (standard setting)' },
    { code: '2', display: 'Only submitted questionnaire is saved' },
    { code: '3', display: 'No saving' },
];

export const useContextSystem = [
    { code: UseContextSystem.helsetjeneste_full, display: 'Helsetjeneste (Full) (standard setting)' },
    { code: UseContextSystem.journalinnsyn_basispluss, display: 'Journalinnsyn (Basis +)' },
    { code: UseContextSystem.registerinnsyn_basis, display: 'Registerinnsyn (Basis)' },
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
