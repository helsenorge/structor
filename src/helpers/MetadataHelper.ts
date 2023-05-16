import { Coding, Questionnaire, Meta } from '../types/fhir';
import {
    IQuestionnaireStatus,
    IQuestionnaireMetadata,
    IQuestionnaireMetadataType,
} from '../types/IQuestionnaireMetadataType';
import { updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { MetaSecuritySystem, UseContextSystem } from '../types/IQuestionnareItemType';
import { ActionType } from '../store/treeStore/treeStore';
import { CheckboxOption } from '../types/OptionTypes';

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

export enum metaSecurityDisplay {
    helseregister = 'Helseregister (Basis)',
    pasientjournal = 'Pasientjournal (Basis +)',
    helsehjelp = 'Helsehjelp (Full)',
    forvaltning = 'Forvaltning (Full)',
    sekundærbruk = 'Sekundærbruk (Full)',
}

export enum metaSecurityCode {
    helseregister = '1',
    pasientjournal = '2',
    helsehjelp = '3',
    forvaltning = '4',
    sekundærbruk = '5',
}

export const metaSecurityOptions = [
    {
        code: metaSecurityCode.helseregister,
        display: metaSecurityDisplay.helseregister,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: metaSecurityCode.pasientjournal,
        display: metaSecurityDisplay.pasientjournal,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: metaSecurityCode.helsehjelp,
        display: metaSecurityDisplay.helsehjelp,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: metaSecurityCode.forvaltning,
        display: metaSecurityDisplay.forvaltning,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: metaSecurityCode.sekundærbruk,
        display: metaSecurityDisplay.sekundærbruk,
        system: MetaSecuritySystem.tjenesteomraade,
    },
];

export const getMetaSecurity = (code: string): Coding => {
    return metaSecurityOptions.filter((option) => option.code === code)?.[0];
};

export enum skjemaUtfyllerCode {
    Standard = 'Standard',
    Tilpassert = 'Tilpassert',
}

export enum skjemaUtfyllerDisplay {
    Standard = 'Standard tilgangsstyring (innbygger selv, foreldre på vegne av barn < 12 år, foreldre på vegne av barn 12-16 år, representant med tildelt fullmarkt)',
    Tilpassert = 'Tilpassert tilgangsstyring',
}

export const skjemaUtfyllerOptions = [
    { code: skjemaUtfyllerCode.Standard, display: skjemaUtfyllerDisplay.Standard },
    { code: skjemaUtfyllerCode.Tilpassert, display: skjemaUtfyllerDisplay.Tilpassert },
];

export enum formFillingAccessCode {
    kunInnbygger = '1',
    barnUnder12 = '2',
    barnMellom12Og16 = '3',
    representantOrdinaertFullmakt = '4',
}

export enum formFillingAccessDisplay {
    kunInnbygger = 'Innbygger selv',
    barnUnder12 = 'Foreldre på vegne av barn < 12 år',
    barnMellom12Og16 = 'Foreldre på vegne av barn 12-16 år',
    representantOrdinaertFullmakt = 'Representant med ordinær fullmakt',
}

export const formFillingAccessOptions = [
    {
        code: formFillingAccessCode.kunInnbygger,
        display: formFillingAccessDisplay.kunInnbygger,
        system: MetaSecuritySystem.kanUtforesAv,
        disabled: true,
    },
    {
        code: formFillingAccessCode.barnUnder12,
        display: formFillingAccessDisplay.barnUnder12,
        system: MetaSecuritySystem.kanUtforesAv,
        disabled: false,
    },
    {
        code: formFillingAccessCode.barnMellom12Og16,
        display: formFillingAccessDisplay.barnMellom12Og16,
        system: MetaSecuritySystem.kanUtforesAv,
        disabled: false,
    },
    {
        code: formFillingAccessCode.representantOrdinaertFullmakt,
        display: formFillingAccessDisplay.representantOrdinaertFullmakt,
        system: MetaSecuritySystem.kanUtforesAv,
        disabled: false,
    },
] as CheckboxOption[];

export const getFormFillingAccess = (code: string): Coding => {
    return formFillingAccessOptions
        .filter((option) => option.code === code)
        ?.map((s: CheckboxOption) => {
            return { code: s.code, system: s.system, display: s.display } as Coding;
        })?.[0];
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

export const mapUseContextToMetaSecurity = (useContext: string): Coding => {
    switch (useContext) {
        case UseContextSystem.journalinnsyn_basispluss:
            return getMetaSecurity(metaSecurityCode.pasientjournal);
        case UseContextSystem.registerinnsyn_basis:
            return getMetaSecurity(metaSecurityCode.helseregister);
        case UseContextSystem.helsetjeneste_full:
        default:
            return getMetaSecurity(metaSecurityCode.helsehjelp);
    }
};

export const getUseContextSystem = (questionnaire: Questionnaire): string => {
    const system =
        questionnaire.useContext &&
        questionnaire.useContext.length > 0 &&
        questionnaire.useContext[0].valueCodeableConcept?.coding &&
        questionnaire.useContext[0].valueCodeableConcept.coding.length > 0 &&
        questionnaire.useContext[0].valueCodeableConcept.coding[0].system;

    return system || UseContextSystem.helsetjeneste_full;
};

export const getTilgangsstyringCodes = (qMetadata: IQuestionnaireMetadata): (string | undefined)[] => {
    const kanUtforesAv =
        qMetadata.meta &&
        qMetadata.meta.security &&
        qMetadata.meta.security.length &&
        qMetadata.meta.security.filter((f) => f.system === MetaSecuritySystem.kanUtforesAv)?.map((m) => m.code);

    return kanUtforesAv || [];
};

export const addMetaSecurityIfDoesNotExist = (questionnaire: Questionnaire): Questionnaire => {
    if (!questionnaire.meta?.security) {
        const useContextCode = getUseContextSystem(questionnaire);
        const newMeta = {
            ...questionnaire.meta,
            security: [mapUseContextToMetaSecurity(useContextCode)],
        } as Meta;
        questionnaire = { ...questionnaire, meta: newMeta } as Questionnaire;
    }
    return questionnaire;
};

export const updateMetaSecurity = (
    qMetadata: IQuestionnaireMetadata,
    securityToSet: Coding[],
    dispatch: React.Dispatch<ActionType>,
): void => {
    const newMeta = {
        ...qMetadata.meta,
        security: securityToSet,
    } as Meta;

    dispatch(updateQuestionnaireMetadataAction(IQuestionnaireMetadataType.meta, newMeta));
};
