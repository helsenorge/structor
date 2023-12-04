import { describe, it, expect} from 'vitest';
import { Items, TreeState } from '../../store/treeStore/treeStore';
import { getValueSetToTranslate } from '../validationUtils';
import { valuesetJaNei, valuesetJaNeiVetIkke, valuesetJaNeiUsikker, item_JaNei, item_JaNeiVetIkke } from '../../__data__/valuesets';

describe('validationUtils', () => {
    describe('getValueSetToTranslate', () => {
        it('Returns used valueset in questionnaire', () => {
            const state = {qContained: qContained, qItems: { item_JaNei } as Items } as TreeState;
            const valueSet = getValueSetToTranslate(state);
            expect(valueSet).toBe([valuesetJaNei]);
        });

        it('Returns used valuesets in questionnaire', () => {
            const state = {qContained: qContained, qItems: { item_JaNei, item_JaNeiVetIkke } as Items} as TreeState;
            const valueSets = getValueSetToTranslate(state);
            expect(valueSets).toBe([valuesetJaNei, valuesetJaNeiVetIkke]);
        });
    });
});

const qContained = [
    valuesetJaNei,
    valuesetJaNeiVetIkke,
    valuesetJaNeiUsikker,
];
