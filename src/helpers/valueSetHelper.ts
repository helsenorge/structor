import { ValueSetCompose } from '../types/fhir';
import createUUID from './CreateUUID';

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
