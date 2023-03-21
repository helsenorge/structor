import { Coding } from '../types/fhir';
import { IQuestionnaireStatus } from '../types/IQuestionnaireMetadataType';

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

export const metaSecuritySystem = 'urn:oid:2.16.578.1.12.4.1.1.7618';

export enum metaSecurityDisplay {
    helseregister = 'Helseregister',
    pasientjournal = 'Pasientjournal',
    helsehjelp = 'Helsehjelp',
    forvaltning = 'Forvaltning',
    sekundærbruk = 'Sekundærbruk',
    ungdom = 'Ungdom',
}

export enum metaSecurityCode {
    helseregister = '1',
    pasientjournal = '2',
    helsehjelp = '3',
    forvaltning = '4',
    sekundærbruk = '5',
    ungdom = '6',
}

export const metaSecurityOptions = [
    { code: metaSecurityCode.helseregister, display: metaSecurityDisplay.helseregister, system: metaSecuritySystem },
    { code: metaSecurityCode.pasientjournal, display: metaSecurityDisplay.pasientjournal, system: metaSecuritySystem },
    { code: metaSecurityCode.helsehjelp, display: metaSecurityDisplay.helsehjelp, system: metaSecuritySystem },
    { code: metaSecurityCode.forvaltning, display: metaSecurityDisplay.forvaltning, system: metaSecuritySystem },
    { code: metaSecurityCode.sekundærbruk, display: metaSecurityDisplay.sekundærbruk, system: metaSecuritySystem },
    { code: metaSecurityCode.ungdom, display: metaSecurityDisplay.ungdom, system: metaSecuritySystem },
];

export const getMetaSecurity = (code: string): Coding => {
    return metaSecurityOptions.filter((option) => option.code === code)?.[0];
};

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
