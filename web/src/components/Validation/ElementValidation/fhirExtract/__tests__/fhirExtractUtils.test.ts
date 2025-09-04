import { describe, it, expect, beforeEach, vi } from "vitest";
import type {
  Questionnaire,
  QuestionnaireItem,
  Coding,
  Extension,
} from "fhir/r4";

import {
  makeExpectedTypesText,
  findQuestionnaireItemInQuestionnaire,
  hasExtensionWithUrlAndValueUri,
  ancestorHasConditionExtractionContext,
  resourceMustBeCorrectType,
  OBS_COMPONENT_ANCHOR,
  OBS_DERIVED_FROM_ANCHOR,
  OBS_EFFECTIVE_DATE_TIME_ANCHOR,
  OBS_CODE_ANCHOR,
  OBS_CATEGORY_ANCHOR,
  OBSERVATION_ANCHORS,
  COND_EVIDENCE_ANCHOR,
  COND_RECORDED_DATE_ANCHOR,
  COND_CODE_ANCHOR,
  CONDITION_ANCHORS,
  SR_REASON_REFERENCE_ANCHOR,
  SR_SUPPORTING_INFO_ANCHOR,
  SERVICE_REQUEST_ANCHORS,
} from "../utils";

import { IExtensionType } from "src/types/IQuestionnareItemType";

// helpers
const t: any = (s: string) => s;

const makeItem = (
  overrides: Partial<QuestionnaireItem> = {},
): QuestionnaireItem => ({
  linkId: overrides.linkId ?? "q1",
  type: (overrides.type as any) ?? "string",
  definition: overrides.definition,
  item: overrides.item,
  extension: overrides.extension,
  code: overrides.code as Coding[] | undefined,
  text: overrides.text,
});

const makeQuestionnaire = (items: QuestionnaireItem[]): Questionnaire => ({
  resourceType: "Questionnaire",
  status: "active",
  item: items,
});

beforeEach(() => vi.clearAllMocks());

describe("makeExpectedTypesText", () => {
  it("returnerer 'Expected one of [x, y].' når orCodeSystem er falsy", () => {
    const msg = makeExpectedTypesText(t, ["string", "display"]);
    expect(msg).toBe("Expected one of [string, display].");
  });

  it("inkluderer 'or a code.' når orCodeSystem === true", () => {
    const msg = makeExpectedTypesText(t, ["choice", "open-choice"], true);
    expect(msg).toBe("Expected one of [choice, open-choice] or a code.");
  });

  it("inkluderer 'or a code.' når orCodeSystem er en streng (system)", () => {
    const msg = makeExpectedTypesText(t, ["choice"], "sys-x");
    expect(msg).toBe("Expected one of [choice] or a code.");
  });

  it("de-duperer typer i meldingen", () => {
    const msg = makeExpectedTypesText(t, ["string", "display", "string"]);
    expect(msg).toBe("Expected one of [string, display].");
  });
});

describe("findQuestionnaireItemInQuestionnaire", () => {
  it("finner første toppnivå-match", () => {
    const a = makeItem({ linkId: "a" });
    const b = makeItem({ linkId: "b" });
    const q = makeQuestionnaire([a, b]);
    const found = findQuestionnaireItemInQuestionnaire(
      q.item,
      (itm) => itm.linkId === "b",
    );
    expect(found?.linkId).toBe("b");
  });

  it("søker rekursivt og finner child som har itemExtractionContext-extension (via hasExtension)", () => {
    const child = makeItem({
      linkId: "child",
      extension: [
        { url: IExtensionType.itemExtractionContext, valueBoolean: true },
      ],
    });
    const parent = makeItem({ linkId: "parent", item: [child] });
    const q = makeQuestionnaire([parent]);

    const found = findQuestionnaireItemInQuestionnaire(
      q.item,
      (itm) => itm.linkId === "nope",
    );
    expect(found?.linkId).toBe("child");
  });

  it("returnerer undefined når ingen matcher", () => {
    const q = makeQuestionnaire([makeItem({ linkId: "x" })]);
    const found = findQuestionnaireItemInQuestionnaire(
      q.item,
      (itm) => itm.linkId === "zzz",
    );
    expect(found).toBeUndefined();
  });
});

describe("hasExtensionWithUrlAndValueUri", () => {
  it("true hvis ext med url finnes og valueUri matcher", () => {
    const ok = hasExtensionWithUrlAndValueUri("my-url", "wanted", [
      { url: "my-url", valueUri: "wanted" },
    ]);
    expect(ok).toBe(true);
  });

  it("false hvis mangler ext eller valueUri mismatch", () => {
    expect(hasExtensionWithUrlAndValueUri("u", "v", undefined)).toBe(false);
    expect(
      hasExtensionWithUrlAndValueUri("u", "v", [{ url: "u", valueUri: "x" }]),
    ).toBe(false);
  });
});

describe("ancestorHasConditionExtractionContext", () => {
  const ANCHORS = ["A#one", "B#two"] as const;

  const findParentConditionFunction = (itm: QuestionnaireItem) =>
    !!itm.extension?.some(
      (e: any) => e.url === IExtensionType.itemExtractionContext,
    );

  it("no-op når questionnaire ikke har items", () => {
    const res = ancestorHasConditionExtractionContext(
      t,
      makeItem({ definition: "A#one" }),
      makeQuestionnaire([]),
      ANCHORS,
      findParentConditionFunction,
    );
    expect(res).toEqual([]);
  });

  it("no-op når definition ikke inneholder noen anchors", () => {
    const q = makeQuestionnaire([makeItem({ linkId: "x" })]);
    const res = ancestorHasConditionExtractionContext(
      t,
      makeItem({ definition: "Other#x" }),
      q,
      ANCHORS,
      findParentConditionFunction,
    );
    expect(res).toEqual([]);
  });

  it("feiler når parent ikke finnes", () => {
    const parent = makeItem({ linkId: "p", item: [makeItem({ linkId: "c" })] });
    const q = makeQuestionnaire([parent]);

    const res = ancestorHasConditionExtractionContext(
      t,
      makeItem({ linkId: "c", definition: "A#one" }),
      q,
      ANCHORS,
      findParentConditionFunction,
    );

    const expected = `no item with extension ${IExtensionType.itemExtractionContext} found as parent to c`;
    expect(res.some((r) => r.errorReadableText.includes(expected))).toBe(true);
  });

  it("feiler når parent finnes, men ingen child under parent matcher noen anchors", () => {
    const child = makeItem({ linkId: "wrongChild", definition: "Other#bla" });
    const parent = makeItem({
      linkId: "p",
      extension: [{ url: IExtensionType.itemExtractionContext }],
      item: [child],
    });
    const q = makeQuestionnaire([parent]);

    const res = ancestorHasConditionExtractionContext(
      t,
      makeItem({ linkId: "wrongChild", definition: "A#one" }),
      q,
      ANCHORS,
      findParentConditionFunction,
    );

    const expected = `no item with definition ${ANCHORS.join(" or ")} found as child to wrongChild`;
    expect(res.some((r) => r.errorReadableText.includes(expected))).toBe(true);
  });

  it("passerer når parent finnes og minst ett child har en anchor", () => {
    const child = makeItem({ linkId: "ok", definition: "B#two" });
    const parent = makeItem({
      linkId: "p",
      extension: [{ url: IExtensionType.itemExtractionContext }],
      item: [child],
    });
    const q = makeQuestionnaire([parent]);

    const res = ancestorHasConditionExtractionContext(
      t,
      child,
      q,
      ANCHORS,
      findParentConditionFunction,
    );
    expect(res).toEqual([]);
  });
});

describe("resourceMustBeCorrectType – NY LOGIKK for orCodeSystem", () => {
  it("with resource: passerer når type er tillatt", () => {
    const res = resourceMustBeCorrectType({
      t,
      qItem: makeItem({
        linkId: "r1",
        type: "string",
        definition: "Anchor.res",
      }),
      anchor: "Anchor",
      resource: "res",
      allowedTypes: ["string", "display"],
      orCodeSystem: undefined,
    });
    expect(res).toEqual([]);
  });

  it("with resource: feiler for feil type og uten code – orCodeSystem=true krever at code finnes", () => {
    const res = resourceMustBeCorrectType({
      t,
      qItem: makeItem({
        linkId: "r2",
        type: "choice",
        definition: "Anchor.res",
      }),
      anchor: "Anchor",
      resource: "res",
      allowedTypes: ["string", "display"],
      orCodeSystem: true, // nå: krever at qItem.code.length > 0
    });
    const err = res[0];
    expect(err.linkId).toBe("r2");
    expect(err.errorReadableText).toContain(
      "Expected one of [string, display] or a code.",
    );
    expect(err.errorReadableText).toContain("on res");
  });

  it("with resource: passerer når orCodeSystem=true og qItem.code finnes (uansett system)", () => {
    const res = resourceMustBeCorrectType({
      t,
      qItem: makeItem({
        linkId: "r3",
        type: "choice",
        definition: "Anchor.res",
        code: [{ system: "anything", code: "X" }],
      }),
      anchor: "Anchor",
      resource: "res",
      allowedTypes: ["string", "display"],
      orCodeSystem: true,
    });
    expect(res).toEqual([]);
  });

  it("with resource: passerer når orCodeSystem er streng og noen code.system matcher", () => {
    const res = resourceMustBeCorrectType({
      t,
      qItem: makeItem({
        linkId: "r4",
        type: "choice",
        definition: "Anchor.res",
        code: [{ system: "sys-1", code: "X" }],
      }),
      anchor: "Anchor",
      resource: "res",
      allowedTypes: ["string"],
      orCodeSystem: "sys-1",
    });
    expect(res).toEqual([]);
  });

  it("with resource: feiler når orCodeSystem er streng men ingen code.system matcher", () => {
    const res = resourceMustBeCorrectType({
      t,
      qItem: makeItem({
        linkId: "r5",
        type: "choice",
        definition: "Anchor.res",
        code: [{ system: "other", code: "X" }],
      }),
      anchor: "Anchor",
      resource: "res",
      allowedTypes: ["string"],
      orCodeSystem: "sys-expected",
    });
    const err = res[0];
    expect(err.errorReadableText).toContain(
      "Expected one of [string] or a code.",
    );
    expect(err.errorReadableText).toContain("on res");
  });

  it("anchor-only: feiler for feil type; melding skal IKKE inneholde ' on '", () => {
    const res = resourceMustBeCorrectType({
      t,
      qItem: makeItem({ linkId: "a1", type: "choice", definition: "MyAnchor" }),
      anchor: "MyAnchor",
      allowedTypes: ["string", "display"],
    });
    const err = res[0];
    expect(err.errorReadableText).toContain(
      "Expected one of [string, display]",
    );
    expect(err.errorReadableText).not.toMatch(/ on /);
  });

  it("anchor-only: passerer når orCodeSystem=true og code finnes", () => {
    const res = resourceMustBeCorrectType({
      t: t as any,
      qItem: makeItem({
        linkId: "a2",
        type: "choice",
        definition: "MyAnchor",
        code: [{ system: "whatever", code: "X" }],
      }),
      anchor: "MyAnchor",
      allowedTypes: ["string", "display"],
      orCodeSystem: true,
    });
    expect(res).toEqual([]);
  });
});

describe("Anchor-konstanter", () => {
  it("Observation-ankere er definert korrekt", () => {
    expect(OBS_COMPONENT_ANCHOR).toBe("Observation#component");
    expect(OBS_DERIVED_FROM_ANCHOR).toBe("Observation#derivedFrom");
    expect(OBS_EFFECTIVE_DATE_TIME_ANCHOR).toBe(
      "Observation#effectiveDateTime",
    );
    expect(OBS_CODE_ANCHOR).toBe("Observation#code");
    expect(OBS_CATEGORY_ANCHOR).toBe("Observation#Category");
    expect(OBSERVATION_ANCHORS).toContain(OBS_COMPONENT_ANCHOR);
  });

  it("Condition-ankere er definert korrekt", () => {
    expect(COND_EVIDENCE_ANCHOR).toBe("Condition#Evidence");
    expect(COND_RECORDED_DATE_ANCHOR).toBe("Condition#RecordedDate");
    expect(COND_CODE_ANCHOR).toBe("Condition#Code");
    expect(CONDITION_ANCHORS).toContain(COND_CODE_ANCHOR);
  });

  it("ServiceRequest-ankere er definert korrekt", () => {
    expect(SR_REASON_REFERENCE_ANCHOR).toBe("ServiceRequest#reasonReference");
    expect(SR_SUPPORTING_INFO_ANCHOR).toBe("ServiceRequest#supportingInfo");
    expect(SERVICE_REQUEST_ANCHORS).toContain(SR_SUPPORTING_INFO_ANCHOR);
  });
});
