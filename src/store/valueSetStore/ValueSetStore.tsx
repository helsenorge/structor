import React, { createContext, Dispatch, useReducer } from 'react';
import produce from 'immer';

import { ValueSet } from '../../types/fhir';
import { initPredefinedValueSet } from '../../helpers/initPredefinedValueSet';
import { UPDATE_VALUESET, UPDATE_VALUESETS_ACTION } from './ValueSetAction';

export interface ValueSetState {
    predefinedValueSet: ValueSet[];
}

export const initialState: ValueSetState = {
    predefinedValueSet: initPredefinedValueSet,
};

export type ActionType = UPDATE_VALUESETS_ACTION;

function updateValueSet(draft: ValueSetState, action: UPDATE_VALUESETS_ACTION) {
    draft.predefinedValueSet = [...draft.predefinedValueSet, ...action.items];
}

const reducer = produce((draft: ValueSetState, action: ActionType) => {
    switch (action.type) {
        case UPDATE_VALUESET:
            updateValueSet(draft, action);
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
