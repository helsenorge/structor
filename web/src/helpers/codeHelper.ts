import createUUID from './CreateUUID';
import { TFunction } from 'react-i18next';
import { Coding } from '../types/fhir';
import { ICodeSystem } from '../types/IQuestionnareItemType';
import { deleteItemCodeAction, addItemCodeAction } from '../store/treeStore/treeActions';
import { ActionType, Items, OrderItem } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import { Option } from '../types/OptionTypes';

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

export const getItemCode = (item: QuestionnaireItem, system: ICodeSystem) => {
    return item.code?.find((code: Coding) => code.system === system);
};

export const getItemCodeWithMatchingSystemAndCode = (item: QuestionnaireItem, system: ICodeSystem, code: string): Coding | undefined => {
    let returnValue: Coding = {};
    item.code?.forEach((coding) => {
        if (coding.system === system && coding.code === code) {
            returnValue = coding;
        }});
    return returnValue;
}

export const getAllMatchingCodes = (item: QuestionnaireItem, system: ICodeSystem): Coding[] | undefined => {
    const matchingCodes = item.code?.filter((code: Coding) => code.system === system);
    return matchingCodes;
};

export const getDisplayAndCodeValuesFromAllMatchingCodes = (item: QuestionnaireItem, system: ICodeSystem): Option[] => {
    const stringArrayToReturn: Option[] = [];
    item.code?.forEach((code: Coding) => {
        if (code.system === system && code.code && code.display) {
            stringArrayToReturn.push({code: code?.code, display: code?.display})
        }
    });
    return stringArrayToReturn;
};

export const getChildrenWithMatchingSystemAndCode = (
    qItems: Items,
    qOrder: OrderItem[], 
    itemToSearchIn: QuestionnaireItem, 
    systemToSearchFor: ICodeSystem, 
    codeToSearchFor: string, 
    itemsToReturn: QuestionnaireItem[] = []
    ): QuestionnaireItem[] => {
        qOrder.forEach((orderItem) => {
            const qItem = qItems[orderItem.linkId];

            if  (qItem.linkId === itemToSearchIn.linkId) {
                orderItem.items.forEach((childItem) => {
                    const qItemChild = qItems[childItem.linkId];
                    if (qItemChild.code) {
                        qItemChild.code.forEach((coding) => {
                            if (coding.system === systemToSearchFor && coding.code === codeToSearchFor) {
                                itemsToReturn.push(qItemChild);
                                return;
                            }
                        })
                    }
                })
            }
    
            if (orderItem.items && !itemsToReturn.length) {
                itemsToReturn = getChildrenWithMatchingSystemAndCode(qItems, orderItem.items, itemToSearchIn, systemToSearchFor, codeToSearchFor, itemsToReturn);
            }
        });
    
        return itemsToReturn;
};

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

export const updateChildrenWithMatchingSystemAndCode = (
    item: QuestionnaireItem,
    qItems: Items,
    qOrder: OrderItem[],
    parentCodingArray: Coding[] | undefined,
    systemToSearchFor: ICodeSystem,
    dispatch: React.Dispatch<ActionType>): void => {

    parentCodingArray?.forEach((parentCoding) => {
        const codeToSearchFor = parentCoding.code?.toString() || '';
        const childrenMatch = 
            getChildrenWithMatchingSystemAndCode(qItems, qOrder, item, systemToSearchFor, codeToSearchFor);
        childrenMatch.forEach((childItem) => {
            childItem?.code?.forEach((childCoding) => {
                if (childCoding.system === systemToSearchFor && childCoding.code === codeToSearchFor) {
                    const parentValueHasChanged = childCoding.display !== parentCoding.display;
                    if (parentValueHasChanged) {
                        removeItemCode(childItem, systemToSearchFor, dispatch);
                        addItemCode(
                            childItem,
                            {
                                system: systemToSearchFor,
                                code: parentCoding?.code,
                                display: parentCoding?.display,
                            }, 
                            dispatch
                        );
                    }
                }
            })
        })
    })
};
