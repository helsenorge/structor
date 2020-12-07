import React, { useReducer, createContext, Dispatch } from 'react';
import produce from 'immer';

import { QuestionnaireItem, ValueSet } from '../../types/fhir';
import {
    NewItemAction,
    DeleteItemAction,
    UpdateItemAction,
    NewValueSetCodeAction,
    DeleteValueSetCodeAction,
    NEW_ITEM_ACTION,
    DELETE_ITEM_ACTION,
    UPDATE_ITEM_ACTION,
    NEW_VALUESET_CODE_ACTION,
    DELETE_VALUESET_CODE_ACTION,
} from './treeActions';
import { IQuestionnaireItemType } from '../../types/IQuestionnareItemType';

type ActionType =
    | NewItemAction
    | DeleteItemAction
    | UpdateItemAction
    | NewValueSetCodeAction
    | DeleteValueSetCodeAction;

export interface Items {
    [key: string]: QuestionnaireItem;
}

export interface ValueSets {
    [key: string]: ValueSet;
}

export interface OrderItem {
    linkId: string;
    items: Array<OrderItem>;
}

export interface TreeState {
    qValueSet: ValueSets;
    qItems: Items;
    qOrder: Array<OrderItem>;
}

export const initialState: TreeState = {
    qValueSet: {},
    qItems: {},
    qOrder: [],
};

function findTreeArray(searchPath: Array<string>, searchItems: Array<OrderItem>): Array<OrderItem> {
    if (searchPath.length === 0) {
        return searchItems;
    }
    // finn neste i searchPath:
    const searchIndex = searchItems.findIndex((x) => x.linkId === searchPath[0]);
    return findTreeArray(searchPath.slice(1), searchItems[searchIndex].items);
}

function getLinkIdOfAllSubItems(items: Array<OrderItem>, linkIds: Array<string>): Array<string> {
    items.forEach((x) => {
        linkIds.push(x.linkId);
        getLinkIdOfAllSubItems(x.items, linkIds);
    });
    return linkIds;
}

function isChoiceOrOpenChoice(itemType: string): boolean {
    return itemType === 'choice' || itemType === 'open-choice';
}

export function getValueSetId(linkId: string): string {
    return `${linkId}-valueSet`;
}

function createNewValueSet(valueSetId: string): ValueSet {
    return {
        resourceType: 'ValueSet',
        id: valueSetId,
        status: 'draft',
        compose: {
            include: [
                {
                    system: `${valueSetId}-system`,
                    concept: [],
                },
            ],
        },
    };
}

function newItem(draft: TreeState, action: NewItemAction): void {
    let itemToAdd = action.item;
    if (isChoiceOrOpenChoice(action.item.type)) {
        const valueSetId = getValueSetId(action.item.linkId);
        draft.qValueSet[valueSetId] = createNewValueSet(valueSetId);
        itemToAdd = {
            ...itemToAdd,
            answerValueSet: `#${valueSetId}`,
        };
    }

    draft.qItems[itemToAdd.linkId] = itemToAdd;
    // find the correct place to add the new item
    const arrayToAddItemTo = findTreeArray(action.order, draft.qOrder);
    arrayToAddItemTo.push({ linkId: itemToAdd.linkId, items: [] });
}

function deleteItem(draft: TreeState, action: DeleteItemAction): void {
    const arrayToDeleteItemFrom = findTreeArray(action.order, draft.qOrder);
    const indexToDelete = arrayToDeleteItemFrom.findIndex((x) => x.linkId === action.linkId);

    // find all child items in the tree below this node and delete from qItems and qValueSet
    const itemsToDelete = [action.linkId, ...getLinkIdOfAllSubItems(arrayToDeleteItemFrom[indexToDelete].items, [])];
    itemsToDelete.forEach((linkIdToDelete: string) => {
        delete draft.qItems[linkIdToDelete];
        delete draft.qValueSet[getValueSetId(linkIdToDelete)];
    });

    // delete node from qOrder
    arrayToDeleteItemFrom.splice(indexToDelete, 1);
}

function updateItem(draft: TreeState, action: UpdateItemAction): void {
    if (action.itemProperty === 'type') {
        // item type is changed from item type without valueSet to choice or open-choice, add valueSet for this item
        if (
            isChoiceOrOpenChoice(action.itemValue as IQuestionnaireItemType) &&
            !isChoiceOrOpenChoice(draft.qItems[action.linkId].type)
        ) {
            const valueSetId = getValueSetId(action.linkId);
            draft.qValueSet[valueSetId] = createNewValueSet(valueSetId);
            draft.qItems[action.linkId] = {
                ...draft.qItems[action.linkId],
                answerValueSet: valueSetId,
            };
        }
        // item type is changed from choice or open-choice to item type without valueSet, remove valueSet for this item
        if (
            !isChoiceOrOpenChoice(action.itemValue as IQuestionnaireItemType) &&
            isChoiceOrOpenChoice(draft.qItems[action.linkId].type)
        ) {
            delete draft.qValueSet[getValueSetId(action.linkId)];
            delete draft.qItems[action.linkId].answerValueSet;
        }
    }
    draft.qItems[action.linkId] = {
        ...draft.qItems[action.linkId],
        [action.itemProperty]: action.itemValue,
    };
}

function newValueSetCodeAction(draft: TreeState, action: NewValueSetCodeAction): void {
    draft.qValueSet[getValueSetId(action.linkId)].compose?.include[0].concept?.push(action.conceptValue);
}

function deleteValueSetCodeAction(draft: TreeState, action: DeleteValueSetCodeAction): void {
    const index = draft.qValueSet[getValueSetId(action.linkId)].compose?.include[0].concept?.findIndex(
        (x) => x.code === action.code,
    );
    if (index !== undefined && index > -1) {
        draft.qValueSet[getValueSetId(action.linkId)].compose?.include[0].concept?.splice(index, 1);
    }
}

const reducer = produce((draft: TreeState, action: ActionType) => {
    switch (action.type) {
        case NEW_ITEM_ACTION:
            newItem(draft, action);
            break;
        case DELETE_ITEM_ACTION:
            deleteItem(draft, action);
            break;
        case UPDATE_ITEM_ACTION:
            updateItem(draft, action);
            break;
        case NEW_VALUESET_CODE_ACTION:
            newValueSetCodeAction(draft, action);
            break;
        case DELETE_VALUESET_CODE_ACTION:
            deleteValueSetCodeAction(draft, action);
            break;
    }
});

export const TreeContext = createContext<{
    state: TreeState;
    dispatch: Dispatch<ActionType>;
}>({
    state: initialState,
    dispatch: () => null,
});

export const TreeContextProvider = (props: { children: JSX.Element }): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        // eslint-disable-next-line
        // @ts-ignore
        <TreeContext.Provider value={{ state, dispatch }}>{props.children}</TreeContext.Provider>
    );
};
