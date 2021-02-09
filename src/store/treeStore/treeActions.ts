import CreateUUID from '../../helpers/CreateUUID';
import { IEnableWhen, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import {
    QuestionnaireItem,
    Extension,
    QuestionnaireItemAnswerOption,
    QuestionnaireItemInitial,
    Element,
    ValueSet,
} from '../../types/fhir';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import { TreeState } from './treeStore';

export const UPDATE_QUESTIONNAIRE_METADATA_ACTION = 'updateQuestionnaireMetadata';
export const NEW_ITEM_ACTION = 'newItem';
export const DELETE_ITEM_ACTION = 'deleteItem';
export const UPDATE_ITEM_ACTION = 'updateItem';
export const DUPLICATE_ITEM_ACTION = 'duplicateItem';
export const RESET_QUESTIONNAIRE_ACTION = 'resetQuestionnaire';
export const REORDER_ITEM_ACTION = 'reorderItem';
export const APPEND_VALUESET_ACTION = 'appendValueSet';
export const UPDATE_LINK_ID_ACTION = 'updateLinkId';

type ItemValueType =
    | string
    | boolean
    | Extension[]
    | IEnableWhen[]
    | number
    | QuestionnaireItemAnswerOption[]
    | Element
    | QuestionnaireItemInitial[]
    | undefined; // TODO: legg på alle lovlige verdier

export interface UpdateLinkIdAction {
    type: typeof UPDATE_LINK_ID_ACTION;
    oldLinkId: string;
    newLinkId: string;
    parentArray: Array<string>;
}

export interface UpdateQuestionnaireMetadataAction {
    type: typeof UPDATE_QUESTIONNAIRE_METADATA_ACTION;
    propName: IQuestionnaireMetadataType;
    value: string;
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
    value: string,
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
