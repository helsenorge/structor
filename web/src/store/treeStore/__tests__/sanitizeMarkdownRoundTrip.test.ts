import { IExtensionType } from "src/types/IQuestionnareItemType";
import { describe, it, expect } from "vitest";

import type { Bundle } from "fhir/r4";

import hso_pakjenning from "../../../tests/__data__/HSO_pakjenning-v2.0.7.json";
import {
  roundTripQuestionnaire,
  getQuestionnaires,
  collectAllItems,
} from "../../../tests/loadQuestionnaire";

describe("rendering-markdown sanitization - round-trip with real HSO_pakjenning Bundle", () => {
  const output = roundTripQuestionnaire(
    JSON.parse(JSON.stringify(hso_pakjenning)) as Bundle,
  );
  const questionnaires = getQuestionnaires(output);
  const allItems = questionnaires.flatMap((q) => collectAllItems(q.item));

  it("output contains questionnaire items", () => {
    expect(allItems.length).toBeGreaterThan(10);
  });

  it("no rendering-markdown extension without valueMarkdown in any language", () => {
    const badItems = allItems.filter((item) =>
      item._text?.extension?.some(
        (ext) =>
          ext.url === IExtensionType.markdown &&
          (ext.valueMarkdown === undefined || ext.valueMarkdown === ""),
      ),
    );

    expect(badItems).toHaveLength(0);
  });

  it("valid rendering-markdown extensions are preserved", () => {
    const itemsWithValidMarkdown = allItems.filter((item) =>
      item._text?.extension?.some(
        (ext) =>
          ext.url === IExtensionType.markdown &&
          ext.valueMarkdown &&
          ext.valueMarkdown.trim().length > 0,
      ),
    );

    expect(itemsWithValidMarkdown.length).toBeGreaterThan(0);
  });
});
