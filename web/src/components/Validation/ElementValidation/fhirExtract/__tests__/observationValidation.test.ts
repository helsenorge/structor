import { describe, it, expect } from "vitest";
import type {
  Questionnaire,
  QuestionnaireItem,
  Coding,
  Extension,
} from "fhir/r4";

import { observationValidation } from "../observationValidation";

import { ItemTypeConstants } from "@helsenorge/refero";
import {
  IExtensionType,
  ItemExtractionContext,
} from "src/types/IQuestionnareItemType";

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

const makeParentWithObservationExtractionContext = (
  children: QuestionnaireItem[] = [],
): QuestionnaireItem =>
  makeItem({
    linkId: "parent",
    extension: [
      {
        url: IExtensionType.itemExtractionContext,
        valueUri: ItemExtractionContext.observation,
      } as Extension,
    ],
    item: children,
  });

const wrapWithValidAncestor = (child: QuestionnaireItem): Questionnaire =>
  makeQuestionnaire([makeParentWithObservationExtractionContext([child])]);

const COMPONENT = "Observation#component";
const DERIVED_FROM = "Observation#derivedFrom";
const EFFECTIVE_DT = "Observation#effectiveDateTime";
const CODE_ANCHOR = "Observation#code";
const CATEGORY = "Observation#Category";

// ---------- tests ----------

describe("observationValidation – no-op", () => {
  it("returns [] when definition has no Observation anchors", () => {
    const q = makeQuestionnaire([makeItem({ linkId: "x1" })]);
    const qItem = makeItem({ linkId: "x1", definition: "Other#x.y" });
    expect(observationValidation(t as any, qItem, q)).toEqual([]);
  });
});

describe("component.value[x] (with resource)", () => {
  it("passes for allowed types when ancestor is valid", () => {
    const allowed = [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.OPENCHOICE,
      ItemTypeConstants.QUANTITY,
      ItemTypeConstants.STRING,
      ItemTypeConstants.BOOLEAN,
      ItemTypeConstants.INTEGER,
      ItemTypeConstants.DECIMAL,
      ItemTypeConstants.DATE,
      ItemTypeConstants.DATETIME,
      ItemTypeConstants.DATE, // duplisert i koden – skal uansett godkjennes
    ] as const;

    for (const a of allowed) {
      const child = makeItem({
        linkId: "vx-ok",
        type: a,
        definition: `${COMPONENT}.value[x]`,
      });
      const q = wrapWithValidAncestor(child);
      const res = observationValidation(t as any, child, q);
      expect(res).toEqual([]);
    }
  });

  it('fails for disallowed type and includes "on value[x]" and "or a code."', () => {
    const child = makeItem({
      linkId: "vx-bad",
      type: ItemTypeConstants.DISPLAY, // ikke på whitelist
      definition: `${COMPONENT}.value[x]`,
    });
    const q = wrapWithValidAncestor(child);
    const res = observationValidation(t as any, child, q);

    const err = res.find((r) => r.errorReadableText.includes("on value[x]"));
    expect(err).toBeTruthy();
    expect(err!.linkId).toBe("vx-bad");
    expect(err!.errorProperty).toBe("system");
    // orCodeSystem=true i koden -> meldingen skal inneholde 'or a code.'
    expect(err!.errorReadableText).toContain("or a code.");
  });
});

describe("component.code (with resource)", () => {
  it("passes for CHOICE and DISPLAY", () => {
    for (const a of [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.DISPLAY,
    ] as const) {
      const child = makeItem({
        linkId: "cc-ok",
        type: a,
        definition: `${COMPONENT}.code`,
      });
      const q = wrapWithValidAncestor(child);
      const res = observationValidation(t as any, child, q);
      expect(res).toEqual([]);
    }
  });

  it('fails for wrong type and includes "on code" + "or a code."', () => {
    const child = makeItem({
      linkId: "cc-bad",
      type: ItemTypeConstants.STRING,
      definition: `${COMPONENT}.code`,
    });
    const q = wrapWithValidAncestor(child);
    const res = observationValidation(t as any, child, q);
    const err = res.find((r) => r.errorReadableText.includes("on code"));
    expect(err).toBeTruthy();
    expect(err!.errorReadableText).toContain(
      "Expected one of [choice, display] or a code.",
    );
  });
});

describe("component (anchor only, no resource)", () => {
  it("passes for CHOICE and DISPLAY", () => {
    for (const a of [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.DISPLAY,
    ] as const) {
      const child = makeItem({
        linkId: "c-ok",
        type: a,
        definition: COMPONENT, // endsWith(anchor)
      });
      const q = wrapWithValidAncestor(child);
      expect(observationValidation(t as any, child, q)).toEqual([]);
    }
  });

  it('fails for wrong type and DOES NOT include "on ..."', () => {
    const child = makeItem({
      linkId: "c-bad",
      type: ItemTypeConstants.STRING,
      definition: COMPONENT,
    });
    const q = wrapWithValidAncestor(child);
    const res = observationValidation(t as any, child, q);
    const err = res.find((r) => r.linkId === "c-bad");
    expect(err).toBeTruthy();
    expect(err!.errorReadableText).toContain(
      "Expected one of [choice, display]",
    );
    expect(err!.errorReadableText).toContain("or a code."); // orCodeSystem=true
    // siden resource er undefined, skal teksten ikke ha "on ..."
    expect(err!.errorReadableText).not.toMatch(/ on /);
  });
});

describe("code (anchor only, no resource)", () => {
  it("passes for CHOICE and DISPLAY", () => {
    for (const a of [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.DISPLAY,
    ] as const) {
      const child = makeItem({
        linkId: "co-ok",
        type: a,
        definition: CODE_ANCHOR,
      });
      const q = wrapWithValidAncestor(child);
      expect(observationValidation(t as any, child, q)).toEqual([]);
    }
  });

  it("fails for wrong type (STRING) with anchor-only message (no 'on ...')", () => {
    const child = makeItem({
      linkId: "co-bad",
      type: ItemTypeConstants.STRING,
      definition: CODE_ANCHOR,
    });
    const q = wrapWithValidAncestor(child);
    const res = observationValidation(t as any, child, q);
    const err = res.find((r) => r.linkId === "co-bad");
    expect(err).toBeTruthy();
    expect(err!.errorReadableText).toContain(
      "Expected one of [choice, display] or a code.",
    );
    expect(err!.errorReadableText).not.toMatch(/ on /);
  });
});

describe("category (anchor only, no resource)", () => {
  it("passes for CHOICE and DISPLAY", () => {
    for (const a of [
      ItemTypeConstants.CHOICE,
      ItemTypeConstants.DISPLAY,
    ] as const) {
      const child = makeItem({
        linkId: "cat-ok",
        type: a,
        definition: CATEGORY,
      });
      const q = wrapWithValidAncestor(child);
      expect(observationValidation(t as any, child, q)).toEqual([]);
    }
  });

  it("fails for wrong type (STRING), anchor-only err", () => {
    const child = makeItem({
      linkId: "cat-bad",
      type: ItemTypeConstants.STRING,
      definition: CATEGORY,
    });
    const q = wrapWithValidAncestor(child);
    const res = observationValidation(t as any, child, q);
    const err = res.find((r) => r.linkId === "cat-bad");
    expect(err).toBeTruthy();
    expect(err!.errorReadableText).toContain(
      "Expected one of [choice, display] or a code.",
    );
    expect(err!.errorReadableText).not.toMatch(/ on /);
  });
});

describe("effectiveDateTime (anchor only, no resource)", () => {
  it("passes for DATE and DATETIME", () => {
    for (const a of [
      ItemTypeConstants.DATE,
      ItemTypeConstants.DATETIME,
    ] as const) {
      const child = makeItem({
        linkId: "edt-ok",
        type: a,
        definition: EFFECTIVE_DT,
      });
      const q = wrapWithValidAncestor(child);
      expect(observationValidation(t as any, child, q)).toEqual([]);
    }
  });

  it('fails for wrong type and shows expected list "[date, dateTime]" (no "on ...")', () => {
    const child = makeItem({
      linkId: "edt-bad",
      type: ItemTypeConstants.CHOICE,
      definition: EFFECTIVE_DT,
    });
    const q = wrapWithValidAncestor(child);
    const res = observationValidation(t as any, child, q);
    const err = res.find((r) => r.linkId === "edt-bad");
    expect(err).toBeTruthy();
    expect(err!.errorReadableText).toContain(
      "Expected one of [date, dateTime]",
    );
    expect(err!.errorReadableText).not.toMatch(/ on /);
  });
});

describe("ancestorHasConditionExtractionContext (Observation)", () => {
  it("errors when no parent with observation extraction-context exists", () => {
    const q = makeQuestionnaire([
      makeItem({ linkId: "root", item: [makeItem({ linkId: "child" })] }),
    ]);
    const qItem = makeItem({
      linkId: "child",
      definition: `${COMPONENT}.value[x]`,
    });
    const res = observationValidation(t as any, qItem, q);

    const expectedMsg = `no item with extension ${IExtensionType.itemExtractionContext} found`;
    expect(res.some((r) => r.errorReadableText.includes(expectedMsg))).toBe(
      true,
    );
  });

  it("errors when parent with extraction-context exists, but qItem is not a descendant of that parent", () => {
    // Parent med korrekt extension, men inneholder IKKE vår qItem
    const parentWithExt = makeParentWithObservationExtractionContext([
      makeItem({ linkId: "other", definition: "Other#thing" }),
    ]);

    // qItem ligger et annet sted i treet
    const unrelatedBranch = makeItem({
      linkId: "unrelated",
      item: [
        makeItem({ linkId: "child", definition: `${COMPONENT}.value[x]` }),
      ],
    });

    const q = makeQuestionnaire([parentWithExt, unrelatedBranch]);

    const qItem = makeItem({
      linkId: "child",
      definition: `${COMPONENT}.value[x]`,
    });

    const res = observationValidation(t as any, qItem, q);

    const expectedMsg = `no item with extension ${IExtensionType.itemExtractionContext} found as parent to child`;
    expect(res.some((r) => r.errorReadableText.includes(expectedMsg))).toBe(
      true,
    );
  });

  it("passes ancestor check when parent has extension and child matches an anchor", () => {
    const child = makeItem({
      linkId: "ok",
      definition: `${COMPONENT}.value[x]`,
      type: ItemTypeConstants.STRING, // tillatt for value[x]
    });
    const q = wrapWithValidAncestor(child);
    const res = observationValidation(t as any, child, q);
    expect(res).toEqual([]);
  });
});
