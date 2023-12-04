import { describe, it, expect} from 'vitest';
import { Items, TreeState } from '../../store/treeStore/treeStore';
import { getValueSetToTranslate } from '../validationUtils';
import {
    valuesetJaNei,
    valuesetJaNeiVetIkke,
    valuesetJaNeiUsikker,
    item_JaNei,
    item_JaNeiVetIkke,
} from '../../__data__/valuesets';

describe('validationUtils', () => {
    describe('getValueSetToTranslate', () => {
        it('Returns used valueset in questionnaire', () => {
            const state = {qContained: qContained, qItems: { item_JaNei } as Items } as TreeState;
            const valueSet = getValueSetToTranslate(state);

            expect(valueSet?.[0].id).toBe(valuesetJaNei.id);
        });

        it('Returns used valuesets in questionnaire', () => {
            const state = {qContained: qContained, qItems: { item_JaNei, item_JaNeiVetIkke } as Items} as TreeState;
            const valueSets = getValueSetToTranslate(state);

            expect(valueSets?.[0].id).toBe(valuesetJaNei.id);
            expect(valueSets?.[1].id).toBe(valuesetJaNeiVetIkke.id);
        });
    });
});

const qContained = [
    valuesetJaNei,
    valuesetJaNeiVetIkke,
    valuesetJaNeiUsikker,
];
