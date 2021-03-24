import React, { createContext, Dispatch, useReducer } from 'react';
import produce from 'immer';

import { ValueSet } from '../../types/fhir';
import { initPredefinedValueSet } from '../../helpers/initPredefinedValueSet';
import { IMPORT_VALUESETS, IMPORT_VALUESETS_ACTION, UPDATE_VALUESET, UPDATE_VALUESET_ACTION } from './ValueSetAction';

export interface ValueSetState {
    predefinedValueSet: ValueSet[];
}

export const initialState: ValueSetState = {
    predefinedValueSet: initPredefinedValueSet,
};

export type ActionType = UPDATE_VALUESET_ACTION | IMPORT_VALUESETS_ACTION;

function updateValueSet(draft: ValueSetState, action: UPDATE_VALUESET_ACTION) {
    const indexToUpdate = draft.predefinedValueSet.findIndex((x) => x.id === action.item.id);
    if (indexToUpdate >= 0) {
        draft.predefinedValueSet[indexToUpdate] = action.item;
    } else {
        draft.predefinedValueSet = [...draft.predefinedValueSet, action.item];
    }
}

function importValueSets(draft: ValueSetState, action: IMPORT_VALUESETS_ACTION) {
    debugger;
    console.log('jabada', action.items);
    draft.predefinedValueSet = [...draft.predefinedValueSet, ...action.items];
}

const reducer = produce((draft: ValueSetState, action: ActionType) => {
    debugger;
    switch (action.type) {
        case UPDATE_VALUESET:
            updateValueSet(draft, action);
            break;
        case IMPORT_VALUESETS:
            importValueSets(draft, action);
            break;
    }
});

export const ValueSetContext = createContext<{
    state: ValueSetState;
    dispatch: Dispatch<ActionType>;
}>({
    state: initialState,
    dispatch: () => null,
});

export const ValueSetContextProvider = (props: { children: JSX.Element }): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        // eslint-disable-next-line
        // @ts-ignore
        <ValueSetContext.Provider value={{ state, dispatch }}>{props.children}</ValueSetContext.Provider>
    );
};
