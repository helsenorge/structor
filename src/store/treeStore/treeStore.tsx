import React, { useReducer, createContext, Dispatch } from 'react';
import produce from 'immer';

import { QuestionnaireItem } from '../../types/fhir';
import {
    NewItemAction,
    DeleteItemAction,
    UpdateItemAction,
    NEW_ITEM_ACTION,
    DELETE_ITEM_ACTION,
    UPDATE_ITEM_ACTION,
} from './treeActions';

export interface Items {
    [key: string]: QuestionnaireItem;
}

export interface OrderItem {
    linkId: string;
    items: Array<OrderItem>;
}

export interface TreeState {
    qItems: Items;
    qOrder: Array<OrderItem>;
}

export const initialState: TreeState = {
    qItems: {},
    qOrder: [
        /*
        {
            linkId: '1',
            items: [],
        },
        {
            linkId: '2',
            items: [
                {
                    linkId: '2.100',
                    items: [
                        {
                            linkId: '2.100.1',
                            items: [
                                {
                                    linkId: '2.100.1.100',
                                    items: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    linkId: '2.300',
                    items: [],
                },
            ],
        },
    */
    ],
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

export function newItem(draft: TreeState, action: NewItemAction): void {
    draft.qItems[action.item.linkId] = action.item;

    // find the correct place to add the new item
    const arrayToAddItemTo = findTreeArray(action.order, draft.qOrder);
    arrayToAddItemTo.push({ linkId: action.item.linkId, items: [] });
}

export function deleteItem(draft: TreeState, action: DeleteItemAction): void {
    const arrayToDeleteItemFrom = findTreeArray(action.order, draft.qOrder);
    const indexToDelete = arrayToDeleteItemFrom.findIndex((x) => x.linkId === action.linkId);

    // find all child items in the tree below this node and delete from qItems
    const itemsToDelete = [action.linkId, ...getLinkIdOfAllSubItems(arrayToDeleteItemFrom[indexToDelete].items, [])];
    itemsToDelete.forEach((linkIdToDelete: string) => {
        delete draft.qItems[linkIdToDelete];
    });

    // delete node from qOrder
    arrayToDeleteItemFrom.splice(indexToDelete, 1);
}

export function updateItem(draft: TreeState, action: UpdateItemAction): void {
    draft.qItems[action.linkId] = {
        ...draft.qItems[action.linkId],
        [action.itemProperty]: action.itemValue,
    };
}

const reducer = produce((draft: TreeState, action: NewItemAction | DeleteItemAction | UpdateItemAction) => {
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
    }
});

export const TreeContext = createContext<{
    state: TreeState;
    dispatch: Dispatch<NewItemAction | DeleteItemAction | UpdateItemAction>;
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
