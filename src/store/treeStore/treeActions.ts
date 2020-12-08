import CreateUUID from '../../helpers/CreateUUID';
import { IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';

export const NEW_ITEM_ACTION = 'newItem';
export const DELETE_ITEM_ACTION = 'deleteItem';
export const UPDATE_ITEM_ACTION = 'updateItem';
export const NEW_VALUESET_CODE_ACTION = 'newValueSetCode';
export const UPDATE_VALUESET_CODE_ACTION = 'updateValueSetCode';
export const DELETE_VALUESET_CODE_ACTION = 'deleteValueSetCode';

type ItemValueType = string | boolean; // TODO: legg på alle lovlige verdier

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

export interface NewValueSetCodeAction {
    type: typeof NEW_VALUESET_CODE_ACTION;
    linkId: string;
    conceptValue: ValueSetComposeIncludeConcept;
}

export interface UpdateValueSetCodeAction {
    type: typeof UPDATE_VALUESET_CODE_ACTION;
    linkId: string;
    conceptValue: ValueSetComposeIncludeConcept;
}

export interface DeleteValueSetCodeAction {
    type: typeof DELETE_VALUESET_CODE_ACTION;
    linkId: string;
    code: string;
}

export const newItemAction = (type: IQuestionnaireItemType, order: Array<string>): NewItemAction => {
    const newQuestionnaireItem = {
        linkId: CreateUUID(),
        type: type,
        text: '',
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

export const newValueSetCodeAction = (linkId: string, displayValue: string): NewValueSetCodeAction => {
    const conceptValue = {
        code: CreateUUID(),
        display: displayValue,
    };
    return {
        type: NEW_VALUESET_CODE_ACTION,
        linkId,
        conceptValue,
    };
};

export const updateValueSetCodeAction = (
    linkId: string,
    consept: ValueSetComposeIncludeConcept,
): UpdateValueSetCodeAction => {
    return {
        type: UPDATE_VALUESET_CODE_ACTION,
        linkId,
        conceptValue: consept,
    };
};

export const deleteValueSetCodeAction = (linkId: string, code: string): DeleteValueSetCodeAction => {
    return {
        type: DELETE_VALUESET_CODE_ACTION,
        linkId,
        code,
    };
};
