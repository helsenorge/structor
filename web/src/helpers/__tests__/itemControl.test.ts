import { describe, it, expect } from "vitest";

import {
  ItemControlType,
  itemControlExistsInExtensionList,
} from "../itemControl";

describe("ItemControl", () => {
  describe("itemControlExistsInExtensionList", () => {
    it("should return false if extension is undefined", () => {
      const result = itemControlExistsInExtensionList(undefined, undefined);
      expect(result).toBe(false);
    });
    it("should return false if itemControlType is undefined", () => {
      const result = itemControlExistsInExtensionList([], undefined);
      expect(result).toBe(false);
    });
    it("should return false if extension does not contain itemControlType", () => {
      const result = itemControlExistsInExtensionList(
        [{ url: "http://example.com" }],
        ItemControlType.slider
      );
      expect(result).toBe(false);
    });
    it("should return true if extension contains itemControlType", () => {
      const result = itemControlExistsInExtensionList(
        [
          {
            url: "http://example.com",
            valueCodeableConcept: {
              coding: [{ code: ItemControlType.slider }],
            },
          },
        ],
        ItemControlType.slider
      );
      expect(result).toBe(true);
    });
    it("should return false if extension is empty", () => {
      const result = itemControlExistsInExtensionList(
        [],
        ItemControlType.slider
      );
      expect(result).toBe(false);
    });

    it("should return false if extension does not contain itemControlType", () => {
      const result = itemControlExistsInExtensionList(
        [
          {
            url: "http://example.com",
            valueCodeableConcept: {
              coding: [{ code: ItemControlType.checkbox }],
            },
          },
        ],
        ItemControlType.slider
      );
      expect(result).toBe(false);
    });
    it("should return true if extension contains multiple itemControlTypes", () => {
      const result = itemControlExistsInExtensionList(
        [
          {
            url: "http://example.com",
            valueCodeableConcept: {
              coding: [
                { code: ItemControlType.slider },
                { code: ItemControlType.checkbox },
              ],
            },
          },
        ],
        ItemControlType.slider
      );
      expect(result).toBe(true);
    });
  });
});
