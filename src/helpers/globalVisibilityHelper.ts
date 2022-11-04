import { Extension, Coding } from '../types/fhir';
import { ICodeSystem, IExtentionType } from '../types/IQuestionnareItemType';
import { ActionType } from '../store/treeStore/treeStore';
import { IQuestionnaireMetadata, IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';

export const globalVisibility = [
    { code: 'hide-sidebar', display: 'Hide sidebar texts' },
    { code: 'hide-help', display: 'Hide help texts' },
    { code: 'hide-sublabel', display: 'Hide sublabel texts' },
];

export enum VisibilityType {
    hideSidebar = 'hide-sidebar',
    hideHelp = 'hide-help',
    hideSublabel = 'hide-sublabel',
}

const createItemControlExtensionWithTypes = (types: VisibilityType[]): Extension => {
    const initCodingArray: Coding[] = [];
    const extension = {
        url: IExtentionType.globalVisibility,
        valueCodeableConcept: { coding: initCodingArray },
    };

    types.forEach((type: VisibilityType) => {
        extension.valueCodeableConcept.coding.push(createAttachmentRenderCoding(type));
    });
    return extension;
};

export const createItemControlExtension = (type: VisibilityType): Extension => {
    return {
        url: IExtentionType.globalVisibility,
        valueCodeableConcept: {
            coding: [
                {
                    system: ICodeSystem.attachmentRenderOptions,
                    code: type,
                    display: getVisibilityCodeDisplay(type),
                },
            ],
        },
    };
};

const existItemControlExtension = (item: IQuestionnaireMetadata): boolean => {
    return item.extension?.find((x: Extension) => x.url === IExtentionType.globalVisibility) !== undefined;
};

const existItemControlWithCode = (item: IQuestionnaireMetadata, code: string): boolean => {
    const exist =
        item.extension
            ?.filter((x: Extension) => x.url === IExtentionType.globalVisibility)
            ?.find((x: Extension) => x.valueCodeableConcept?.coding?.some((s: Coding) => s.code === code)) !==
        undefined;
    return exist;
};

const handleTypeInItemControlExtension = (item: IQuestionnaireMetadata, code: VisibilityType): Extension | null => {
    if (!existItemControlExtension(item)) {
        return createItemControlExtension(code);
    }

    const coding = item.extension
        ?.find((f: Extension) => f.url === IExtentionType.globalVisibility)
        ?.valueCodeableConcept?.coding?.filter((f: Coding) => f.code !== code)
        ?.map((c: Coding) => c.code) as VisibilityType[];

    if (!existItemControlWithCode(item, code)) {
        coding.push(code);
    }

    return coding.length > 0 ? createItemControlExtensionWithTypes(coding) : null;
};

export const isVisibilityHideSidebar = (item: IQuestionnaireMetadata): boolean => {
    return existItemControlWithCode(item, VisibilityType.hideSidebar);
};

export const isVisibilityHideHelp = (item: IQuestionnaireMetadata): boolean => {
    return existItemControlWithCode(item, VisibilityType.hideHelp);
};

export const isVisibilityHideSublabel = (item: IQuestionnaireMetadata): boolean => {
    return existItemControlWithCode(item, VisibilityType.hideSublabel);
};

export const setItemControlExtension = (
    item: IQuestionnaireMetadata,
    code: VisibilityType,
    dispatch: (value: ActionType) => void,
): void => {
    const extensionsToSet = (item.extension || []).filter((x: Extension) => x.url !== IExtentionType.globalVisibility);
    const extension = handleTypeInItemControlExtension(item, code);
    if (extension) {
        extensionsToSet.push(extension);
    }
    dispatch(updateQuestionnaireMetadataAction(IQuestionnaireMetadataType.extension, extensionsToSet));
};

export const getVisibilityCodeDisplay = (code: VisibilityType): string | undefined => {
    return globalVisibility.find((c) => c.code === code)?.display;
};

export const createAttachmentRenderCoding = (code: VisibilityType): Coding => {
    return {
        system: ICodeSystem.attachmentRenderOptions,
        code: code,
        display: getVisibilityCodeDisplay(code),
    };
};
