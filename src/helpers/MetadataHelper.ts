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
    { code: '', display: 'Flytende nederst på skjermen (standard innstilling)' },
    { code: 'none', display: 'Ingen knapperad' },
    { code: 'static', display: 'Fast (kun nederst i skjema)' },
];

export const canBePerformedBy = [
    { code: '', display: 'Kan også utfylles av andre på vegne av pasienten (standardinnstilling)' },
    { code: '2', display: 'Må fylles ut av pasienten selv' },
];

export const authenticationRequirement = [
    { code: '', display: 'Påkrevd (standard innstilling)' },
    { code: '1', display: 'Anonym' },
    { code: '2', display: 'Valgfritt' },
];

export const saveCapability = [
    { code: '', display: 'Lagring av endelig versjon og mellomlagring (standardinnstilling)' },
    { code: '2', display: 'Kun lagring av endelig versjon' },
    { code: '3', display: 'Ingen lagring' },
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
