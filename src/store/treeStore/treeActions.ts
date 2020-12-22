import CreateUUID from '../../helpers/CreateUUID';
import { IEnableWhen, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import { QuestionnaireItem, Extension, QuestionnaireItemAnswerOption, Element } from '../../types/fhir';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import { TreeState } from './treeStore';

export const UPDATE_QUESTIONNAIRE_METADATA_ACTION = 'updateQuestionnaireMetadata';
export const NEW_ITEM_ACTION = 'newItem';
export const DELETE_ITEM_ACTION = 'deleteItem';
export const UPDATE_ITEM_ACTION = 'updateItem';
export const DUPLICATE_ITEM_ACTION = 'duplicateItemAction';
export const RESET_QUESTIONNAIRE_ACTION = 'resetQuestionnaire';

type ItemValueType =
    | string
    | boolean
    | Extension[]
    | IEnableWhen[]
    | number
    | QuestionnaireItemAnswerOption[]
    | Element
    | undefined; // TODO: legg på alle lovlige verdier

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
