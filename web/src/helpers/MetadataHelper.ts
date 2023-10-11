import { Coding, Questionnaire, Meta } from '../types/fhir';
import {
    IQuestionnaireStatus,
    IQuestionnaireMetadata,
    IQuestionnaireMetadataType,
} from '../types/IQuestionnaireMetadataType';
import { updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { IExtentionType, MetaSecuritySystem, UseContextSystem } from '../types/IQuestionnareItemType';
import { ActionType } from '../store/treeStore/treeStore';

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

export enum tjenesteomraadeDisplay {
    helseregister = 'Helseregister (Basis)',
    pasientjournal = 'Pasientjournal (Basis +)',
    helsehjelp = 'Helsehjelp (Full)',
    forvaltning = 'Forvaltning (Full)',
    sekundærbruk = 'Sekundærbruk (Full)',
}

export enum tjenesteomraadeCode {
    helseregister = '1',
    pasientjournal = '2',
    helsehjelp = '3',
    forvaltning = '4',
    sekundærbruk = '5',
}

export const tjenesteomaadeOptions = [
    {
        code: tjenesteomraadeCode.helseregister,
        display: tjenesteomraadeDisplay.helseregister,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: tjenesteomraadeCode.pasientjournal,
        display: tjenesteomraadeDisplay.pasientjournal,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: tjenesteomraadeCode.helsehjelp,
        display: tjenesteomraadeDisplay.helsehjelp,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: tjenesteomraadeCode.forvaltning,
        display: tjenesteomraadeDisplay.forvaltning,
        system: MetaSecuritySystem.tjenesteomraade,
    },
    {
        code: tjenesteomraadeCode.sekundærbruk,
        display: tjenesteomraadeDisplay.sekundærbruk,
        system: MetaSecuritySystem.tjenesteomraade,
    },
];

export const getTjenesteomraadeCoding = (code: string): Coding => {
    return tjenesteomaadeOptions.filter((option) => option.code === code)?.[0];
};

export enum skjemaUtfyllerCode {
    Standard = 'Standard',
    Tilpasset = 'Tilpasset',
}

export enum skjemaUtfyllerDisplay {
    Standard = 'Standard tilgangsstyring (innbygger selv, foreldre på vegne av barn < 12 år, foreldre på vegne av barn 12-16 år, representant med tildelt fullmakt, representant med ordinær fullmakt)',
    Tilpasset = 'Tilpasset tilgangsstyring',
}

export const skjemaUtfyllerOptions = [
    { code: skjemaUtfyllerCode.Standard, display: skjemaUtfyllerDisplay.Standard },
    { code: skjemaUtfyllerCode.Tilpasset, display: skjemaUtfyllerDisplay.Tilpasset },
];

export enum tilgangsstyringsCode {
    kunInnbygger = '1',
    barnUnder12 = '2',
    barnMellom12Og16 = '3',
    representantTildeltFullmakt = '4',
    representantOrdinaerFullmakt = '5',
}

export enum tilgangsstyringsDisplay {
    kunInnbygger = 'Kun innbygger selv',
    barnUnder12 = 'Foreldre på vegne av barn < 12 år',
    barnMellom12Og16 = 'Foreldre på vegne av barn 12-16 år',
    representantTildeltFullmakt = 'Representant med tildelt fullmakt',
    representantOrdinaerFullmakt = 'Representant med ordinær fullmakt',
}

export const tilgangsstyringOptions = [
    {
        code: tilgangsstyringsCode.barnUnder12,
        display: tilgangsstyringsDisplay.barnUnder12,
        system: MetaSecuritySystem.kanUtforesAv,
    },
    {
        code: tilgangsstyringsCode.barnMellom12Og16,
        display: tilgangsstyringsDisplay.barnMellom12Og16,
        system: MetaSecuritySystem.kanUtforesAv,
    },
    {
        code: tilgangsstyringsCode.representantTildeltFullmakt,
        display: tilgangsstyringsDisplay.representantTildeltFullmakt,
        system: MetaSecuritySystem.kanUtforesAv,
    },
    {
        code: tilgangsstyringsCode.representantOrdinaerFullmakt,
        display: tilgangsstyringsDisplay.representantOrdinaerFullmakt,
        system: MetaSecuritySystem.kanUtforesAv,
    },
];

export const getTilgangsstyringCoding = (code: string): Coding => {
    return tilgangsstyringOptions.filter((option) => option.code === code)?.[0];
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

export const mapUseContextToTjenesteomraadeMetaSecurity = (useContext: string): Coding => {
    switch (useContext) {
        case UseContextSystem.journalinnsyn_basispluss:
            return getTjenesteomraadeCoding(tjenesteomraadeCode.pasientjournal);
        case UseContextSystem.registerinnsyn_basis:
            return getTjenesteomraadeCoding(tjenesteomraadeCode.helseregister);
        case UseContextSystem.helsetjeneste_full:
        default:
            return getTjenesteomraadeCoding(tjenesteomraadeCode.helsehjelp);
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
        filterMetaSecurity(qMetadata, MetaSecuritySystem.kanUtforesAv)?.map((m) => m.code);

    return kanUtforesAv || [];
};

export const addMetaSecurityIfDoesNotExist = (questionnaire: Questionnaire): Questionnaire => {
    if (!questionnaire.meta?.security) {
        const useContextCode = getUseContextSystem(questionnaire);
        const newMeta = {
            ...questionnaire.meta,
            security: [mapUseContextToTjenesteomraadeMetaSecurity(useContextCode)],
        } as Meta;
        questionnaire = { ...questionnaire, meta: newMeta } as Questionnaire;
    }
    return questionnaire;
};

export const addMetaSecurityIfCanBePerformedByExist = (questionnaire: Questionnaire): Questionnaire => {
    const canBePerformedBy = questionnaire?.extension?.find((ex) => ex.url === IExtentionType.canBePerformedBy)
        ?.valueCoding?.code;
    const kanUtforesAv = questionnaire?.meta?.security?.find((ex) => ex.system === MetaSecuritySystem.kanUtforesAv);
    const kunInnbyggerExtensionCode = '2';
    if (canBePerformedBy) {
        const extentionToUpdate = questionnaire?.extension?.filter((ex) => ex.url !== IExtentionType.canBePerformedBy);
        if (!kanUtforesAv) {
            if (canBePerformedBy === kunInnbyggerExtensionCode) {
                const securityToUpdate = questionnaire.meta?.security || [];
                securityToUpdate?.push(kunInnbyggerMetaSecurity);
                const newMeta = { ...questionnaire.meta, security: securityToUpdate } as Meta;
                questionnaire = { ...questionnaire, meta: newMeta } as Questionnaire;
            }
        }
        questionnaire = { ...questionnaire, extension: extentionToUpdate } as Questionnaire;
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

export const filterMetaSecurity = (
    qMetadata: IQuestionnaireMetadata,
    systemCode: MetaSecuritySystem,
): undefined | Coding[] => {
    return qMetadata.meta?.security?.filter((f) => f.system === systemCode);
};

export const filterOutMetaSecurity = (
    qMetadata: IQuestionnaireMetadata,
    systemCode: MetaSecuritySystem,
): undefined | Coding[] => {
    return qMetadata.meta?.security?.filter((f) => f.system !== systemCode);
};

export const kunInnbyggerMetaSecurity = {
    code: tilgangsstyringsCode.kunInnbygger,
    display: tilgangsstyringsDisplay.kunInnbygger,
    system: MetaSecuritySystem.kanUtforesAv,
};
