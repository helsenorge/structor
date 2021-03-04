import { ValueSet } from '../../types/fhir';

export const UPDATE_VALUESET = 'UPDATE_VALUESET';

export interface UPDATE_VALUESETS_ACTION {
    type: typeof UPDATE_VALUESET;
    items: ValueSet[];
}

export const appendValueSetAction = (items: ValueSet[]): UPDATE_VALUESETS_ACTION => {
    return {
        type: UPDATE_VALUESET,
        items,
    };
};
