import { ValueSet } from '../../types/fhir';

export const UPDATE_VALUESET = 'UPDATE_VALUESET';
export const IMPORT_VALUESETS = 'IMPORT_VALUESETS';

export interface UPDATE_VALUESET_ACTION {
    type: typeof UPDATE_VALUESET;
    item: ValueSet;
}

export interface IMPORT_VALUESETS_ACTION {
    type: typeof IMPORT_VALUESETS;
    items: ValueSet[];
}

export const updateValueSetAction = (item: ValueSet): UPDATE_VALUESET_ACTION => {
    return {
        type: UPDATE_VALUESET,
        item,
    };
};

export const importValueSetAction = (items: ValueSet[]): IMPORT_VALUESETS_ACTION => {
    debugger;
    return {
        type: IMPORT_VALUESETS,
        items,
    };
};
