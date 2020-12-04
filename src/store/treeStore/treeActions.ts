import CreateUUID from '../../helpers/CreateUUID';
import { QuestionnaireItem } from '../../types/fhir';

export const NEW_ITEM_ACTION = 'newItem';
export const DELETE_ITEM_ACTION = 'deleteItem';
export const UPDATE_ITEM_ACTION = 'updateItem';

type ItemProperty =
    | 'linkId'
    | 'definition'
    | 'code'
    | 'prefix'
    | 'text'
    | 'type'
    | 'enableWhen'
    | 'enableBehavior'
    | 'maxLength'
    | 'answerOption'
    | 'initial'
    | 'answerValueSet'
    | 'required'
    | 'repeats'
    | 'readOnly'; // item og extension settes med annen action

type ItemValueType = string | boolean; // TODO: legg på alle lovlige verdier

type QuestionnaireItemType =
    | 'group'
    | 'display'
    | 'boolean'
    | 'decimal'
    | 'integer'
    | 'date'
    | 'dateTime'
    | 'time'
    | 'string'
    | 'text'
    | 'url'
    | 'choice'
    | 'open-choice'
    | 'attachment'
    | 'reference'
    | 'quantity';

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
    itemProperty: ItemProperty;
    itemValue: ItemValueType;
}

export const newItemAction = (type: QuestionnaireItemType, order: Array<string>): NewItemAction => {
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
    itemProperty: ItemProperty,
    itemValue: ItemValueType,
): UpdateItemAction => {
    return {
        type: UPDATE_ITEM_ACTION,
        linkId,
        itemProperty,
        itemValue,
    };
};
