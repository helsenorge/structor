import createUUID from './CreateUUID';
import { TFunction } from 'react-i18next';
import { Coding } from '../types/fhir';
import { ICodeSystem } from '../types/IQuestionnareItemType';
import { deleteItemCodeAction, addItemCodeAction } from '../store/treeStore/treeActions';
import { ActionType } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';

export enum RenderingOptionsEnum {
    None = '0',
    Default = '1',
    KunPdf = '2',
    KunSkjemautfyller = '3',
    Hidden = '4',
}

export enum ChoiceRenderOptionCodes {
    Default = 'Default',
    Full = 'Full',
    Compact = 'Compact',
}

export const renderingOptions = [
    { code: RenderingOptionsEnum.Default, display: 'Display in form filler and PDF', codeDisplay: 'Default' },
    { code: RenderingOptionsEnum.KunPdf, display: 'Display only in PDF', codeDisplay: 'KunPdf' },
    {
        code: RenderingOptionsEnum.KunSkjemautfyller,
        display: 'Display only in form filler',
        codeDisplay: 'KunSkjemautfyller',
    },
    { code: RenderingOptionsEnum.Hidden, display: 'Hide in form filler and PDF' },
];

export const choiceRenderOptions = (t: TFunction<'translation'>): ValueSetComposeIncludeConcept[] => [
    { code: ChoiceRenderOptionCodes.Default, display: t('Show only answered options') },
    { code: ChoiceRenderOptionCodes.Full, display: t('Full display') },
    { code: ChoiceRenderOptionCodes.Compact, display: t('Compact display') },
];

export const erRenderingOption = (code: Coding): boolean => {
    return code.system === ICodeSystem.renderOptionsCodeSystem;
};

export const addItemCode = (item: QuestionnaireItem, code: Coding, dispatch: (value: ActionType) => void): void => {
    dispatch(addItemCodeAction(item.linkId, code));
};

export const removeItemCode = (
    item: QuestionnaireItem,
    systemUrl: string,
    dispatch: (value: ActionType) => void,
): void => {
    const index = item.code?.findIndex((code) => code.system === systemUrl);
    if (index !== undefined && index > -1) {
        dispatch(deleteItemCodeAction(item.linkId, index));
    }
};

export const addRenderOptionItemCode = (
    item: QuestionnaireItem,
    code: string,
    dispatch: (value: ActionType) => void,
): void => {
    const renderOption = renderingOptions.find((c) => c.code === code);
    if (renderOption) {
        const coding = {
            code: renderOption.code,
            display: renderOption.codeDisplay,
            system: ICodeSystem.renderOptionsCodeSystem,
            id: createUUID(),
        };
        dispatch(addItemCodeAction(item.linkId, coding));
    }
};

export const addChoiceRenderOptionItemCode = (
    item: QuestionnaireItem,
    code: string,
    t: TFunction<'translation'>,
    dispatch: (value: ActionType) => void,
): void => {
    const choiceRenderOption = choiceRenderOptions(t).find((c) => c.code === code);
    if (choiceRenderOption) {
        const coding = {
            code: choiceRenderOption.code,
            display: choiceRenderOption.display,
            system: ICodeSystem.choiceRenderOptions,
            id: createUUID(),
        };
        dispatch(addItemCodeAction(item.linkId, coding));
    }
};
