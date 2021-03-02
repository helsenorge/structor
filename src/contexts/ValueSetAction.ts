import { ValueSet } from '../types/fhir';

export const UPDATE_VALUESET = 'UPDATE_VALUESET';

export interface UPDATE_VALUESETS_ACTION {
    type: typeof UPDATE_VALUESET;
    items: ValueSet[];
}
