import { updateItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { ActionType } from '../store/treeStore/treeStore';
import { Element, Extension, QuestionnaireItem } from '../types/fhir';
import { HyperlinkTarget } from '../types/hyperlinkTargetType';
import { IQuestionnaireMetadata, IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { IExtentionType, IValueSetSystem, IItemProperty } from '../types/IQuestionnareItemType';
import createUUID from './CreateUUID';

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

export const createMarkdownExtension = (markdownValue: string): Element => {
    return {
        extension: [
            {
                url: IExtentionType.markdown,
                valueMarkdown: markdownValue,
            },
        ],
    };
};

export const hasExtension = (extensionParent: Element | undefined, extensionType: IExtentionType): boolean => {
    if (extensionParent && extensionParent.extension) {
        return extensionParent.extension.some((ext) => ext.url === extensionType);
    }
    return false;
};

export const getExtensionStringValue = (item: QuestionnaireItem, extensionType: IExtentionType): string | undefined => {
    return item.extension?.find((f: Extension) => f.url === extensionType)?.valueString;
};

export const createGuidanceActionExtension = (valueString = ''): Extension => ({
    url: IExtentionType.guidanceAction,
    valueString,
});

export const createGuidanceParameterExtension = (valueString = ''): Extension => ({
    url: IExtentionType.guidanceParam,
    valueString,
});

export const createHyperlinkTargetExtension = (codeValue = 2): Extension => ({
    url: IExtentionType.hyperlinkTarget,
    valueCoding: { system: IValueSetSystem.hyperlinkTargetValueset, code: `${codeValue}` },
});

export const getHyperlinkTargetvalue = (extensions: Extension[]): HyperlinkTarget | undefined => {
    const hyperlinkExtension = extensions?.find((extension) => extension.url === IExtentionType.hyperlinkTarget);
    if (hyperlinkExtension) {
        const value = hyperlinkExtension.valueCoding?.code;
        if (value) return ~~value;
    }
    return undefined;
};
