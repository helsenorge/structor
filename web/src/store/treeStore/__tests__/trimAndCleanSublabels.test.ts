import { describe, it, expect } from "vitest";

import { IExtensionType } from "../../../types/IQuestionnareItemType";
import type { Questionnaire, QuestionnaireItem } from "fhir/r4";

import hdir_mental_abc from "../../../tests/__data__/Hdir_mental_abc-nb-NO-v0.08.json";
import { roundTripQuestionnaire } from "../../../tests/loadQuestionnaire";

const SUBLABEL_URL = IExtensionType.sublabel;

const findSublabelExtension = (item: QuestionnaireItem | undefined) =>
  item?.extension?.find((ext) => ext.url === SUBLABEL_URL);

/** Recursively find an item by linkId in nested questionnaire items */
function findItemByLinkId(
  items: QuestionnaireItem[] | undefined,
  linkId: string,
): QuestionnaireItem | undefined {
  if (!items) return undefined;
  for (const item of items) {
    if (item.linkId === linkId) return item;
    const found = findItemByLinkId(item.item, linkId);
    if (found) return found;
  }
  return undefined;
}

describe("sublabel cleanup - round-trip with real Hdir questionnaire JSON", () => {
  const output = roundTripQuestionnaire(
    hdir_mental_abc as Questionnaire,
  ) as Questionnaire;

  it("removes whitespace-only sublabel (item a1e06daa)", () => {
    // This item has valueMarkdown: " " in the source JSON — the real bug
    const item = findItemByLinkId(
      output.item,
      "a1e06daa-075f-4896-a8d2-7bc977904b6b",
    );
    expect(item).toBeDefined();
    expect(findSublabelExtension(item)).toBeUndefined();
  });

  it("preserves valid sublabel on item 3bc3a7df", () => {
    // This item has valueMarkdown: "For eksempel ." — should remain
    const item = findItemByLinkId(
      output.item,
      "3bc3a7df-d16f-47f1-90e4-4964baa32c83",
    );
    expect(item).toBeDefined();
    const sublabel = findSublabelExtension(item);
    expect(sublabel).toBeDefined();
    expect(sublabel?.valueMarkdown).toBe("For eksempel .");
  });

  it("keeps other extensions intact when sublabel is removed", () => {
    const item = findItemByLinkId(
      output.item,
      "a1e06daa-075f-4896-a8d2-7bc977904b6b",
    );
    expect(
      item?.extension?.find((ext) => ext.url === IExtensionType.itemControl),
    ).toBeDefined();
  });

  it("does not add sublabel to items that never had one", () => {
    const item = findItemByLinkId(
      output.item,
      "d8f96add-4299-4689-bc93-e4c3ab9d7c83",
    );
    expect(item).toBeDefined();
    expect(findSublabelExtension(item)).toBeUndefined();
  });
});
