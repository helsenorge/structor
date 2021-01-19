import React, { createContext, Dispatch, useReducer } from 'react';
import produce from 'immer';

import { QuestionnaireItem, ValueSet } from '../../types/fhir';
import {
    RESET_QUESTIONNAIRE_ACTION,
    ResetQuestionnaireAction,
    DELETE_ITEM_ACTION,
    DeleteItemAction,
    NEW_ITEM_ACTION,
    NewItemAction,
    UPDATE_ITEM_ACTION,
    UPDATE_QUESTIONNAIRE_METADATA_ACTION,
    UpdateItemAction,
    UpdateQuestionnaireMetadataAction,
    DUPLICATE_ITEM_ACTION,
    DuplicateItemAction,
    REORDER_ITEM_ACTION,
    ReorderItemAction,
} from './treeActions';
import { IQuestionnaireMetadata, IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import createUUID from '../../helpers/CreateUUID';
import { IItemProperty } from '../../types/IQuestionnareItemType';
import { createNewAnswerOption, createNewSystem } from '../../helpers/answerOptionHelper';
import { initPredefinedValueSet } from '../../helpers/initPredefinedValueSet';

type ActionType =
    | ResetQuestionnaireAction
    | UpdateQuestionnaireMetadataAction
    | NewItemAction
    | DeleteItemAction
    | UpdateItemAction
    | DuplicateItemAction
    | ReorderItemAction;

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
    qMetadata: IQuestionnaireMetadata;
    qContained?: Array<ValueSet>;
}

export const initialState: TreeState = {
    qItems: {},
    qOrder: [],
    qMetadata: {
        title: '',
        description: '',
        resourceType: 'Questionnaire',
        language: 'nb-NO',
        name: '',
        status: 'draft',
        publisher: 'NHN',
        meta: {
            profile: ['http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire'],
            tag: [
                {
                    system: 'urn:ietf:bcp:47',
                    code: 'nb-NO',
                    display: 'Norsk bokmål',
                },
            ],
        },
        useContext: [
            {
                code: {
                    system: 'uri', // TODO
                    code: 'focus',
                    display: 'Clinical focus',
                },
                valueCodeableConcept: {
                    coding: [
                        {
                            system: 'uri', // TODO
                            code: '29',
                            display: '',
                        },
                    ],
                },
            },
        ],
        contact: [
            {
                name: 'https://fhi.no/',
            },
        ],
        subjectType: ['Patient'],
        extension: [],
    },
    qContained: initPredefinedValueSet,
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

function newItem(draft: TreeState, action: NewItemAction): void {
    const itemToAdd = action.item;
    draft.qItems[itemToAdd.linkId] = itemToAdd;
    // find the correct place to add the new item
    const arrayToAddItemTo = findTreeArray(action.order, draft.qOrder);
    arrayToAddItemTo.push({ linkId: itemToAdd.linkId, items: [] });
}

function deleteItem(draft: TreeState, action: DeleteItemAction): void {
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

function updateItem(draft: TreeState, action: UpdateItemAction): void {
    draft.qItems[action.linkId] = {
        ...draft.qItems[action.linkId],
        [action.itemProperty]: action.itemValue,
    };
    // add two empty options for choice and open-choice
    if (
        action.itemProperty === IItemProperty.type &&
        (action.itemValue === 'choice' || action.itemValue === 'open-choice') &&
        !draft.qItems[action.linkId].answerOption
    ) {
        const system = createNewSystem();
        draft.qItems[action.linkId] = {
            ...draft.qItems[action.linkId],
            answerOption: [createNewAnswerOption(system), createNewAnswerOption(system)],
        };
    } else if (
        action.itemProperty === IItemProperty.type &&
        action.itemValue !== 'choice' &&
        action.itemValue !== 'open-choice' &&
        draft.qItems[action.linkId].answerOption
    ) {
        draft.qItems[action.linkId].answerOption = undefined;
    }
}

function updateQuestionnaireMetadataProperty(draft: TreeState, { propName, value }: UpdateQuestionnaireMetadataAction) {
    draft.qMetadata[propName] = value;

    if (IQuestionnaireMetadataType.title === propName) {
        const useContext = draft.qMetadata.useContext;
        if (useContext !== undefined && useContext.length > 0) {
            const codings = useContext[0].valueCodeableConcept?.coding;
            if (codings !== undefined && codings.length > 0) {
                codings[0].display = value;
            }
        }
    }
}

function resetQuestionnaireAction(draft: TreeState, action: ResetQuestionnaireAction): void {
    const newState: TreeState = action.newState || initialState;
    draft.qOrder = newState.qOrder;
    draft.qItems = newState.qItems;
    draft.qMetadata = newState.qMetadata;
    draft.qContained = newState.qContained;
}

function duplicateItemAction(draft: TreeState, action: DuplicateItemAction): void {
    // find index of item to duplicate
    const arrayToDuplicateInto = findTreeArray(action.order, draft.qOrder);
    const indexToDuplicate = arrayToDuplicateInto.findIndex((x) => x.linkId === action.linkId);

    const copyItemWithSubtrees = (itemToCopyFrom: OrderItem, parentMap: { [key: string]: string }): OrderItem => {
        const copyItem: QuestionnaireItem = JSON.parse(JSON.stringify(draft.qItems[itemToCopyFrom.linkId]));
        const newId = createUUID();
        parentMap[copyItem.linkId] = newId;
        copyItem.linkId = newId;

        // update enableWhen if condition is a copied parent
        if (copyItem.enableWhen) {
            copyItem.enableWhen = copyItem.enableWhen.map((x) => {
                return { ...x, question: parentMap[x.question] || x.question };
            });
        }

        // add new item
        draft.qItems[copyItem.linkId] = copyItem;

        // add item to tree and generate subtrees
        return {
            linkId: copyItem.linkId,
            items: itemToCopyFrom.items.map((item) => copyItemWithSubtrees(item, parentMap)),
        };
    };

    const duplictedItem = copyItemWithSubtrees(arrayToDuplicateInto[indexToDuplicate], {});

    // insert duplicated item below item that was copied from
    arrayToDuplicateInto.splice(indexToDuplicate + 1, 0, duplictedItem);
}

function reorderItem(draft: TreeState, action: ReorderItemAction): void {
    const arrayToReorderFrom = findTreeArray(action.order, draft.qOrder);
    const indexToMove = arrayToReorderFrom.findIndex((x) => x.linkId === action.linkId);
    if (indexToMove === -1) {
        throw 'Could not find item to move';
    }
    const movedOrderItem = arrayToReorderFrom.splice(indexToMove, 1);
    arrayToReorderFrom.splice(action.newIndex, 0, movedOrderItem[0]);
}

const reducer = produce((draft: TreeState, action: ActionType) => {
    switch (action.type) {
        case RESET_QUESTIONNAIRE_ACTION:
            resetQuestionnaireAction(draft, action);
            break;
        case UPDATE_QUESTIONNAIRE_METADATA_ACTION:
            updateQuestionnaireMetadataProperty(draft, action);
            break;
        case NEW_ITEM_ACTION:
            newItem(draft, action);
            break;
        case DELETE_ITEM_ACTION:
            deleteItem(draft, action);
            break;
        case UPDATE_ITEM_ACTION:
            updateItem(draft, action);
            break;
        case DUPLICATE_ITEM_ACTION:
            duplicateItemAction(draft, action);
            break;
        case REORDER_ITEM_ACTION:
            reorderItem(draft, action);
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
