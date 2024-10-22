import { describe, it, expect, beforeAll } from "vitest";

import {
  defaultState,
  item_JaNei,
  item_JaNeiVetIkke,
} from "../../__data__/stateData";
import { valuesetJaNei, valuesetJaNeiVetIkke } from "../../__data__/valuesets";
import { Items, TreeState } from "../../store/treeStore/treeStore";
import { getValueSetToTranslate } from "../validationUtils";

describe("validationUtils", () => {
  let state = {} as TreeState;

  beforeAll(() => {
    state = defaultState;
  });

  describe("getValueSetToTranslate", () => {
    it("Returns used valueset in questionnaire", () => {
      state.qItems = { item_JaNei } as Items;
      const valueSet = getValueSetToTranslate(defaultState);

      expect(valueSet?.[0].id).toBe(valuesetJaNei.id);
    });

    it("Returns used valuesets in questionnaire", () => {
      state.qItems = { item_JaNei, item_JaNeiVetIkke } as Items;
      const valueSets = getValueSetToTranslate(state);

      expect(valueSets?.[0].id).toBe(valuesetJaNei.id);
      expect(valueSets?.[1].id).toBe(valuesetJaNeiVetIkke.id);
    });
  });
});
