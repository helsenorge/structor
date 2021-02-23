import CreateUUID from '../../helpers/CreateUUID';
import { IEnableWhen, IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import {
    QuestionnaireItem,
    Extension,
    QuestionnaireItemAnswerOption,
    QuestionnaireItemInitial,
    Element,
    ValueSet,
    Meta,
    Coding,
} from '../../types/fhir';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import { TreeState } from './treeStore';

export const ADD_QUESTIONNAIRE_LANGUAGE_ACTION = 'addQuestionnaireLanguage';
export const UPDATE_ITEM_TRANSLATION_ACTION = 'updateItemTranslation';
export const UPDATE_ITEM_OPTION_TRANSLATION_ACTION = 'updateItemOptionTranslation';
export const UPDATE_QUESTIONNAIRE_METADATA_ACTION = 'updateQuestionnaireMetadata';
export const NEW_ITEM_ACTION = 'newItem';
export const REMOVE_ITEM_ATTRIBUTE_ACTION = 'removeItemAttribute';
export const DELETE_ITEM_ACTION = 'deleteItem';
export const UPDATE_ITEM_ACTION = 'updateItem';
export const DUPLICATE_ITEM_ACTION = 'duplicateItem';
export const RESET_QUESTIONNAIRE_ACTION = 'resetQuestionnaire';
export const REORDER_ITEM_ACTION = 'reorderItem';
export const APPEND_VALUESET_ACTION = 'appendValueSet';
export const UPDATE_LINK_ID_ACTION = 'updateLinkId';
export const UPDATE_MARKED_LINK_ID = 'updateMarkedLinkId';

type ItemValueType =
    | string
    | boolean
    | Extension[]
    | IEnableWhen[]
    | number
    | QuestionnaireItemAnswerOption[]
    | Element
    | QuestionnaireItemInitial[]
    | Coding[]
    | undefined; // TODO: legg på alle lovlige verdier

export interface UpdateMarkedLinkId {
    type: typeof UPDATE_MARKED_LINK_ID;
    linkId: string;
}
export interface AddQuestionnaireLanguageAction {
    type: typeof ADD_QUESTIONNAIRE_LANGUAGE_ACTION;
    additionalLanguageCode: string;
}

export interface UpdateItemTranslationAction {
    type: typeof UPDATE_ITEM_TRANSLATION_ACTION;
    languageCode: string;
    linkId: string;
    text: string;
}

export interface UpdateItemOptionTranslationAction {
    type: typeof UPDATE_ITEM_OPTION_TRANSLATION_ACTION;
    languageCode: string;
    linkId: string;
    text: string;
    optionCode: string;
}

export interface UpdateLinkIdAction {
    type: typeof UPDATE_LINK_ID_ACTION;
    oldLinkId: string;
    newLinkId: string;
    parentArray: Array<string>;
}

export interface UpdateQuestionnaireMetadataAction {
    type: typeof UPDATE_QUESTIONNAIRE_METADATA_ACTION;
    propName: IQuestionnaireMetadataType;
    value: string | Meta | Extension[];
}

export interface NewItemAction {
    type: typeof NEW_ITEM_ACTION;
    item: QuestionnaireItem;
    order: Array<string>;
}

export interface DeleteItemAction {
    type: typeof DELETE_ITEM_ACTION;
    linkId: string;
    order: Array<string>;
}

export interface UpdateItemAction {
    type: typeof UPDATE_ITEM_ACTION;
    linkId: string;
    itemProperty: IItemProperty;
    itemValue: ItemValueType;
}

export interface RemoveItemAttributeAction {
    type: typeof REMOVE_ITEM_ATTRIBUTE_ACTION;
    linkId: string;
    itemProperty: IItemProperty;
}

export interface DuplicateItemAction {
    type: typeof DUPLICATE_ITEM_ACTION;
    linkId: string;
    order: Array<string>;
}

export interface ResetQuestionnaireAction {
    type: typeof RESET_QUESTIONNAIRE_ACTION;
    newState?: TreeState;
}

export interface ReorderItemAction {
    type: typeof REORDER_ITEM_ACTION;
    linkId: string;
    order: Array<string>;
    newIndex: number;
}

export interface AppendValueSetAction {
    type: typeof APPEND_VALUESET_ACTION;
    valueSet: ValueSet[];
}

export const updateMarkedLinkIdAction = (markedLinkId: string): UpdateMarkedLinkId => {
    return {
        type: UPDATE_MARKED_LINK_ID,
        linkId: markedLinkId,
    };
};

export const addQuestionnaireLanguageAction = (additionalLanguageCode: string): AddQuestionnaireLanguageAction => {
    return {
        type: ADD_QUESTIONNAIRE_LANGUAGE_ACTION,
        additionalLanguageCode,
    };
};

export const updateItemTranslationAction = (
    languageCode: string,
    linkId: string,
    text: string,
): UpdateItemTranslationAction => {
    return {
        type: UPDATE_ITEM_TRANSLATION_ACTION,
        languageCode,
        linkId,
        text,
    };
};

export const updateItemOptionTranslationAction = (
    languageCode: string,
    linkId: string,
    text: string,
    optionCode: string,
): UpdateItemOptionTranslationAction => {
    return {
        type: UPDATE_ITEM_OPTION_TRANSLATION_ACTION,
        languageCode,
        linkId,
        text,
        optionCode,
    };
};

export const updateLinkIdAction = (
    oldLinkId: string,
    newLinkId: string,
    parentArray: Array<string>,
): UpdateLinkIdAction => {
    return {
        type: UPDATE_LINK_ID_ACTION,
        oldLinkId,
        newLinkId,
        parentArray,
    };
};

export const updateQuestionnaireMetadataAction = (
    propName: IQuestionnaireMetadataType,
    value: string | Meta | Extension[],
): UpdateQuestionnaireMetadataAction => {
    return {
        type: UPDATE_QUESTIONNAIRE_METADATA_ACTION,
        propName,
        value,
    };
};

export const newItemAction = (type: IQuestionnaireItemType, order: Array<string>): NewItemAction => {
    const newQuestionnaireItem = {
        linkId: CreateUUID(),
        type: type,
        text: '',
        extension: [],
    } as QuestionnaireItem;
    return {
        type: NEW_ITEM_ACTION,
        item: newQuestionnaireItem,
        order,
    };
};

export const newItemSidebar = (order: Array<string>): NewItemAction => {
    const sidebar = {
        extension: [
            {
                url: IExtentionType.itemControl,
                valueCodeableConcept: {
                    coding: [
                        {
                            system: IExtentionType.itemControlValueSet,
                            code: 'sidebar',
                        },
                    ],
                },
            },
        ],
        linkId: CreateUUID(),
        code: [
            {
                system: IExtentionType.sotHeader,
                code: '',
                display: '',
            },
        ],
        _text: {
            extension: [
                {
                    url: IExtentionType.markdown,
                    valueMarkdown: '',
                },
            ],
        },
        type: IQuestionnaireItemType.text,
        required: false,
        repeats: false,
        readOnly: false,
    } as QuestionnaireItem;
    return {
        type: NEW_ITEM_ACTION,
        item: sidebar,
        order,
    };
};

export const newItemHelpIconAction = (order: Array<string>): NewItemAction => {
    const newQuestionnaireItem = {
        linkId: CreateUUID(),
        type: IQuestionnaireItemType.text,
        required: false,
        repeats: false,
        readOnly: true,
        maxLength: 250,
        _text: {
            extension: [
                {
                    url: IExtentionType.markdown,
                    valueMarkdown: '',
                },
            ],
        },
        extension: [
            {
                url: IExtentionType.itemControl,
                valueCodeableConcept: {
                    coding: [
                        {
                            system: IExtentionType.itemControlValueSet,
                            code: 'help',
                        },
                    ],
                },
            },
        ],
    } as QuestionnaireItem;
    return {
        type: NEW_ITEM_ACTION,
        item: newQuestionnaireItem,
        order,
    };
};

export const deleteItemAction = (linkId: string, order: Array<string>): DeleteItemAction => {
    return {
        type: DELETE_ITEM_ACTION,
        linkId,
        order,
    };
};

export const updateItemAction = (
    linkId: string,
    itemProperty: IItemProperty,
    itemValue: ItemValueType,
): UpdateItemAction => {
    return {
        type: UPDATE_ITEM_ACTION,
        linkId,
        itemProperty,
        itemValue,
    };
};

export const removeItemAttributeAction = (linkId: string, itemProperty: IItemProperty): RemoveItemAttributeAction => {
    return {
        type: REMOVE_ITEM_ATTRIBUTE_ACTION,
        linkId,
        itemProperty,
    };
};

export const duplicateItemAction = (linkId: string, order: Array<string>): DuplicateItemAction => {
    return {
        type: DUPLICATE_ITEM_ACTION,
        linkId,
        order,
    };
};

export const resetQuestionnaireAction = (newState?: TreeState | undefined): ResetQuestionnaireAction => {
    return {
        type: RESET_QUESTIONNAIRE_ACTION,
        newState,
    };
};

export const reorderItemAction = (linkId: string, order: Array<string>, newIndex: number): ReorderItemAction => {
    return {
        type: REORDER_ITEM_ACTION,
        linkId,
        order,
        newIndex,
    };
};

export const appendValueSetAction = (valueSet: ValueSet[]): AppendValueSetAction => {
    return {
        type: APPEND_VALUESET_ACTION,
        valueSet,
    };
};
