import { updateItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { ActionType } from '../store/treeStore/treeStore';
import { Element, Extension, QuestionnaireItem } from '../types/fhir';
import { IQuestionnaireMetadata, IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { IExtentionType, IItemProperty, IValueSetSystem } from '../types/IQuestionnareItemType';
import createUUID from './CreateUUID';
import { ItemControlType } from './itemControl';

export const setItemExtension = (
    item: QuestionnaireItem,
    extensionValue: Extension,
    dispatch: (value: ActionType) => void,
): void => {
    const extensionsToSet = (item.extension || []).filter((x: Extension) => x.url !== extensionValue.url);
    extensionsToSet.push(extensionValue);
    dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
};

export const removeItemExtension = (
    item: QuestionnaireItem,
    extensionUrl: string | string[],
    dispatch: (value: ActionType) => void,
): void => {
    const extensionsToSet = Array.isArray(extensionUrl)
        ? (item.extension || []).filter((x: Extension) => extensionUrl.indexOf(x.url) === -1)
        : (item.extension || []).filter((x: Extension) => x.url !== extensionUrl);
    dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
};

export const setQuestionnaireExtension = (
    qMetadata: IQuestionnaireMetadata,
    extensionValue: Extension,
    dispatch: (value: ActionType) => void,
): void => {
    const extensionsToSet = (qMetadata.extension || []).filter((x: Extension) => x.url !== extensionValue.url);
    extensionsToSet.push(extensionValue);
    dispatch(updateQuestionnaireMetadataAction(IQuestionnaireMetadataType.extension, extensionsToSet));
};

export const removeQuestionnaireExtension = (
    qMetadata: IQuestionnaireMetadata,
    extensionUrl: string,
    dispatch: (value: ActionType) => void,
): void => {
    const extensionsToSet = (qMetadata.extension || []).filter((x: Extension) => x.url !== extensionUrl);
    dispatch(updateQuestionnaireMetadataAction(IQuestionnaireMetadataType.extension, extensionsToSet));
};

export const createOptionReferenceExtensions = [
    {
        url: IExtentionType.optionReference,
        valueReference: {
            reference: '',
            display: '',
            id: createUUID(),
        },
    },
    {
        url: IExtentionType.optionReference,
        valueReference: {
            reference: '',
            display: '',
            id: createUUID(),
        },
    },
];

export const createDropdown = {
    url: IExtentionType.itemControl,
    valueCodeableConcept: {
        coding: [
            {
                system: IValueSetSystem.itemControlValueSet,
                code: ItemControlType.dropdown,
            },
        ],
    },
};

export const hasExtension = (extensionParent: Element | undefined, extensionType: IExtentionType): boolean => {
    if (extensionParent && extensionParent.extension) {
        return extensionParent.extension.some((ext) => ext.url === extensionType);
    }
    return false;
};

export const createGuidanceActionExtension = (valueString = ''): Extension => ({
    url: IExtentionType.guidanceAction,
    valueString,
});

export const createGuidanceParameterExtension = (valueString = ''): Extension => ({
    url: IExtentionType.guidanceParam,
    valueString,
});
