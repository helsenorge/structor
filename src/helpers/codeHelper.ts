import createUUID from './CreateUUID';
import { Coding } from '../types/fhir';
import { ICodeSystem } from '../types/IQuestionnareItemType';
import { deleteItemCodeAction, addItemCodeAction } from '../store/treeStore/treeActions';
import { ActionType } from '../store/treeStore/treeStore';
import { QuestionnaireItem } from '../types/fhir';

export enum RenderingOptionsEnum {
    None = '0',
    Default = '1',
    KunPdf = '2',
    KunSkjemautfyller = '3',
    Hidden = '4',
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

export const erRenderingOption = (code: Coding): boolean => {
    return code.system === ICodeSystem.renderOptionsCodeSystem;
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

export const addItemCode = (item: QuestionnaireItem, code: string, dispatch: (value: ActionType) => void): void => {
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
