import { describe, it, expect } from "vitest";
import type {
  Questionnaire,
  QuestionnaireItem,
  Coding,
  Extension,
} from "fhir/r4";

import { ItemTypeConstants } from "@helsenorge/refero";
import {
  IExtensionType,
  ItemExtractionContext,
} from "src/types/IQuestionnareItemType";
import { conditionValidation } from "../ConditionValidation";

// ---------- helpers ----------
const t = (s: string) => s;

const makeItem = (
  overrides: Partial<QuestionnaireItem> = {},
): QuestionnaireItem => ({
  linkId: overrides.linkId ?? "q1",
  type: overrides.type ?? ItemTypeConstants.STRING,
  text: overrides.text,
  code: overrides.code as Coding[] | undefined,
  definition: overrides.definition,
  item: overrides.item,
  extension: overrides.extension,
});

const makeQuestionnaire = (items: QuestionnaireItem[]): Questionnaire => ({
  resourceType: "Questionnaire",
  status: "active",
  item: items,
});

const makeParentWithConditionExtractionContext = (
  children: QuestionnaireItem[] = [],
): QuestionnaireItem =>
  makeItem({
    linkId: "parent",
    extension: [
      {
        url: IExtensionType.itemExtractionContext,
        valueUri: ItemExtractionContext.condition,
      } as Extension,
    ],
    item: children,
  });

const wrapWithValidAncestor = (child: QuestionnaireItem): Questionnaire =>
  makeQuestionnaire([makeParentWithConditionExtractionContext([child])]);

const EVIDENCE = "Condition#Evidence";
const RECORDED_DATE = "Condition#RecordedDate";
const CODE_ANCHOR = "Condition#Code";

// ---------- tests ----------

describe("conditionValidation – no-op", () => {
  it("returns [] when definition has no Condition anchors", () => {
    const q = makeQuestionnaire([makeItem({ linkId: "x1" })]);
    const qItem = makeItem({ linkId: "x1", definition: "Other#x.y" });
    expect(conditionValidation(t as any, qItem, q)).toEqual([]);
  });
});

describe("evidence.detail.type", () => {
  it("passes for CHOICE and OPENCHOICE when ancestor is valid", () => {
    for (const allowed of [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.OPENCHOICE,
    ] as const) {
      const child = makeItem({
        linkId: "et",
        type: allowed,
        definition: `${EVIDENCE}.detail.type`,
      });
      const q = wrapWithValidAncestor(child);
      const res = conditionValidation(t as any, child, q);
      expect(res).toEqual([]);
    }
  });

  it('fails for wrong type (STRING) and includes "Expected one of [...] or a code."', () => {
    const child = makeItem({
      linkId: "et2",
      type: ItemTypeConstants.STRING,
      definition: `${EVIDENCE}.detail.type`,
    });
    const q = wrapWithValidAncestor(child);
    const res = conditionValidation(t as any, child, q);

    const err = res.find((r) => r.errorReadableText.includes("on detail.type"));
    expect(err).toBeTruthy();
    expect(err!.linkId).toBe("et2");
    expect(err!.errorProperty).toBe("system");
    // orCodeSystem=true -> meldingen skal inneholde "or a code."
    expect(err!.errorReadableText).toContain(
      "Expected one of [choice, open-choice] or a code.",
    );
  });
});

describe("evidence.detail.identifier", () => {
  it("passes for CHOICE and OPENCHOICE when ancestor is valid", () => {
    for (const allowed of [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.OPENCHOICE,
    ] as const) {
      const child = makeItem({
        linkId: "ei",
        type: allowed,
        definition: `${EVIDENCE}.detail.identifier`,
      });
      const q = wrapWithValidAncestor(child);
      const res = conditionValidation(t as any, child, q);
      expect(res).toEqual([]);
    }
  });

  it('fails for wrong type and includes "or a code."', () => {
    const child = makeItem({
      linkId: "ei2",
      type: ItemTypeConstants.STRING,
      definition: `${EVIDENCE}.detail.identifier`,
    });
    const q = wrapWithValidAncestor(child);
    const res = conditionValidation(t as any, child, q);

    const err = res.find((r) =>
      r.errorReadableText.includes("on detail.identifier"),
    );
    expect(err).toBeTruthy();
    expect(err!.errorReadableText).toContain(
      "Expected one of [choice, open-choice] or a code.",
    );
  });
});

describe("evidence.detail.display / evidence.detail.reference", () => {
  it("passes for STRING and DISPLAY", () => {
    for (const allowed of [
      ItemTypeConstants.STRING,
      ItemTypeConstants.DISPLAY,
    ] as const) {
      // display
      {
        const child = makeItem({
          linkId: "ed",
          type: allowed,
          definition: `${EVIDENCE}.detail.display`,
        });
        const q = wrapWithValidAncestor(child);
        expect(conditionValidation(t as any, child, q)).toEqual([]);
      }
      // reference
      {
        const child = makeItem({
          linkId: "er",
          type: allowed,
          definition: `${EVIDENCE}.detail.reference`,
        });
        const q = wrapWithValidAncestor(child);
        expect(conditionValidation(t as any, child, q)).toEqual([]);
      }
    }
  });

  it('fails for wrong type and DOES NOT include "or a code."', () => {
    // display wrong type
    {
      const child = makeItem({
        linkId: "ed2",
        type: ItemTypeConstants.CHOICE,
        definition: `${EVIDENCE}.detail.display`,
      });
      const q = wrapWithValidAncestor(child);
      const res = conditionValidation(t as any, child, q);
      const err = res.find((r) =>
        r.errorReadableText.includes("on detail.display"),
      );
      expect(err).toBeTruthy();
      expect(err!.errorReadableText).toContain(
        "Expected one of [string, display]",
      );
      expect(err!.errorReadableText).not.toContain("or a code.");
    }

    // reference wrong type
    {
      const child = makeItem({
        linkId: "er2",
        type: ItemTypeConstants.CHOICE,
        definition: `${EVIDENCE}.detail.reference`,
      });
      const q = wrapWithValidAncestor(child);
      const res = conditionValidation(t as any, child, q);
      const err = res.find((r) =>
        r.errorReadableText.includes("on detail.reference"),
      );
      expect(err).toBeTruthy();
      expect(err!.errorReadableText).toContain(
        "Expected one of [string, display]",
      );
      expect(err!.errorReadableText).not.toContain("or a code.");
    }
  });
});

describe("evidence.code", () => {
  it("passes for CHOICE and OPENCHOICE", () => {
    for (const allowed of [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.OPENCHOICE,
    ] as const) {
      const child = makeItem({
        linkId: "ec",
        type: allowed,
        definition: `${EVIDENCE}.code`,
      });
      const q = wrapWithValidAncestor(child);
      expect(conditionValidation(t as any, child, q)).toEqual([]);
    }
  });

  it('fails for wrong type and includes "or a code."', () => {
    const child = makeItem({
      linkId: "ec2",
      type: ItemTypeConstants.STRING,
      definition: `${EVIDENCE}.code`,
    });
    const q = wrapWithValidAncestor(child);
    const res = conditionValidation(t as any, child, q);

    const err = res.find((r) => r.errorReadableText.includes("on code"));
    expect(err).toBeTruthy();
    expect(err!.errorReadableText).toContain(
      "Expected one of [choice, open-choice] or a code.",
    );
  });
});

describe("ancestorHasConditionExtractionContext", () => {
  it("errors when no parent with extraction-context extension exists", () => {
    const q = makeQuestionnaire([
      makeItem({ linkId: "root", item: [makeItem({ linkId: "child" })] }),
    ]);
    const qItem = makeItem({
      linkId: "child",
      definition: `${EVIDENCE}.detail.type`,
    });

    const res = conditionValidation(t as any, qItem, q);

    expect(
      res.some(
        (r) =>
          r.errorReadableText.includes("no item with extension") &&
          r.errorReadableText.includes(
            String(IExtensionType.itemExtractionContext),
          ) &&
          r.errorReadableText.includes("found as parent to child"),
      ),
    ).toBe(true);
  });

  it("errors when parent exists but no child with any of the anchors under that parent", () => {
    const parent = makeParentWithConditionExtractionContext([
      makeItem({ linkId: "wrongChild", definition: "Other#thing" }),
    ]);
    const q = makeQuestionnaire([parent]);

    const qItem = makeItem({
      linkId: "wrongChild",
      definition: `${EVIDENCE}.detail.type`,
    });
    const res = conditionValidation(t as any, qItem, q);

    const expected = `no item with definition ${EVIDENCE} or ${RECORDED_DATE} or ${CODE_ANCHOR} found as child to wrongChild`;
    expect(res.some((r) => r.errorReadableText.includes(expected))).toBe(true);
  });

  it("passes ancestor check when parent has extension and child has a matching anchor", () => {
    const child = makeItem({
      linkId: "ok",
      definition: `${EVIDENCE}.detail.type`,
      type: ItemTypeConstants.CHOICE,
    });
    const q = wrapWithValidAncestor(child);
    const res = conditionValidation(t as any, child, q);
    expect(res).toEqual([]);
  });
});
