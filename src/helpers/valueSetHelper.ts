import { ValueSet, ValueSetCompose } from '../types/fhir';
import createUUID from './CreateUUID';
import { initPredefinedValueSet } from './initPredefinedValueSet';

export const addIDToValueSet = (compose: ValueSetCompose): ValueSetCompose => {
    const concept = compose.include[0].concept;

    const alteredConcept = concept?.map((x) => {
        return {
            ...x,
            id: createUUID(),
        };
    });

    return {
        include: [{ ...compose.include[0], concept: alteredConcept }],
    };
};

export const addPredefinedValueSet = (valueSets?: ValueSet[]): ValueSet[] => {
    const avalibleValueSets = valueSets?.map((x) => x.id) || ([] as string[]);

    const valueSetsToAdd = initPredefinedValueSet.filter((x) => !avalibleValueSets?.includes(x.id));

    return [...valueSetsToAdd, ...(valueSets || [])];
};
