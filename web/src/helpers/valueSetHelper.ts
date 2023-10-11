import { Coding, ValueSet, ValueSetCompose } from '../types/fhir';
import createUUID from './CreateUUID';
import { initPredefinedValueSet } from './initPredefinedValueSet';

export const addIDToValueSet = (compose: ValueSetCompose): ValueSetCompose => {
    const concept = compose.include[0].concept;

    const alteredConcept = concept?.map((x) => {
        return {
            ...x,
            id: x.id || createUUID(),
        };
    });

    return {
        include: [{ ...compose.include[0], concept: alteredConcept }],
    };
};

export const addPredefinedValueSet = (valueSets?: ValueSet[]): ValueSet[] => {
    const avalibleValueSets = valueSets?.map((x) => x.id) || ([] as string[]);

    const predefinedValueSetsToAdd = initPredefinedValueSet.filter((x) => !avalibleValueSets?.includes(x.id));

    const importedValueSets = [...(valueSets || [])].map((x) => {
        return { ...x, compose: x.compose ? addIDToValueSet(x.compose) : x.compose };
    });

    return [...predefinedValueSetsToAdd, ...importedValueSets];
};

export const getValueSetValues = (valueSet: ValueSet | undefined): Coding[] => {
    const codings: Coding[] = [];
    valueSet?.compose?.include.forEach((include) => {
        include?.concept?.forEach((concept) => {
            codings.push({
                code: concept.code,
                system: include.system,
                display: concept.display,
            });
        });
    });

    return codings;
};
