import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Questionnaire, QuestionnaireItem, Coding } from "fhir/r4";

import { serviceRequestValidation } from "../fhirExtract/serviceRequestValidation";

vi.mock("src/helpers/extensionHelper", () => {
  return {
    hasExtension: (item: any, type: string) =>
      Array.isArray(item?.extension) &&
      item.extension.some((e: any) => e?.url === type),
  };
});

const t = (s: string) => s;

const makeItem = (
  overrides: Partial<QuestionnaireItem> = {},
): QuestionnaireItem => ({
  linkId: overrides.linkId ?? "q1",
  type: overrides.type ?? "string",
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

const SDC_EXT =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemExtractionContext";

const makeParentWithExtractionContext = (
  children: QuestionnaireItem[] = [],
): QuestionnaireItem =>
  makeItem({
    linkId: "parent",
    extension: [{ url: SDC_EXT, valueBoolean: true }],
    item: children,
  });

const withAncestor = (child: QuestionnaireItem): Questionnaire =>
  makeQuestionnaire([makeParentWithExtractionContext([child])]);

const RR = "ServiceRequest#reasonReference";
const SI = "ServiceRequest#supportingInfo";
const FHIR_RES_TYPES = "http://hl7.org/fhir/resource-types";

describe("base", () => {
  beforeEach(() => vi.clearAllMocks());

  it("no-op når definition ikke treffer RR/SI", () => {
    const q = makeQuestionnaire([makeItem({ linkId: "x" })]);
    const qItem = makeItem({ linkId: "x", definition: "Other#x.y" });
    expect(serviceRequestValidation(t as any, qItem, q)).toEqual([]);
  });
});

describe("reasonReference.type – (allowed type) ELLER (code.system === fhir resource types)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("PASS: allowed type (choice) uten code", () => {
    const child = makeItem({
      linkId: "rrt1",
      definition: `${RR}.type`,
      type: "choice",
    });
    const q = withAncestor(child);
    expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
  });

  it("PASS: allowed type (open-choice) uten code", () => {
    const child = makeItem({
      linkId: "rrt2",
      definition: `${RR}.type`,
      type: "open-choice",
    });
    const q = withAncestor(child);
    expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
  });

  it("PASS: ikke-allowed type (string) MEN code.system === FHIR_RES_TYPES", () => {
    const child = makeItem({
      linkId: "rrt3",
      definition: `${RR}.type`,
      type: "string",
      code: [{ system: FHIR_RES_TYPES, code: "ServiceRequest" }],
    });
    const q = withAncestor(child);
    expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
  });

  it("FAIL: ikke-allowed type (string) og code.system != FHIR_RES_TYPES", () => {
    const child = makeItem({
      linkId: "rrt4",
      definition: `${RR}.type`,
      type: "string",
      code: [{ system: "http://example.org/other", code: "X" }],
    });
    const q = withAncestor(child);
    const res = serviceRequestValidation(t as any, child, q);
    expect(res.some((r) => r.errorReadableText.includes("Invalid type"))).toBe(
      true,
    );
    expect(res.some((r) => r.errorReadableText.includes("on type"))).toBe(true);
  });

  it("FAIL: ikke-allowed type (string) og ingen code", () => {
    const child = makeItem({
      linkId: "rrt5",
      definition: `${RR}.type`,
      type: "string",
    });
    const q = withAncestor(child);
    const res = serviceRequestValidation(t as any, child, q);
    expect(res.some((r) => r.errorReadableText.includes("Invalid type"))).toBe(
      true,
    );
    expect(res.some((r) => r.errorReadableText.includes("on type"))).toBe(true);
  });
});

describe("reasonReference.identifier – samme regler som for type", () => {
  beforeEach(() => vi.clearAllMocks());

  it("PASS: allowed type (choice)", () => {
    const child = makeItem({
      linkId: "rri1",
      definition: `${RR}.identifier`,
      type: "choice",
    });
    const q = withAncestor(child);
    expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
  });

  it("PASS: fallback via code.system === FHIR_RES_TYPES", () => {
    const child = makeItem({
      linkId: "rri2",
      definition: `${RR}.identifier`,
      type: "string",
      code: [{ system: FHIR_RES_TYPES, code: "ServiceRequest" }],
    });
    const q = withAncestor(child);
    expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
  });

  it("FAIL: feil type + code.system != FHIR_RES_TYPES", () => {
    const child = makeItem({
      linkId: "rri3",
      definition: `${RR}.identifier`,
      type: "string",
      code: [{ system: "http://example.org/other", code: "X" }],
    });
    const q = withAncestor(child);
    const res = serviceRequestValidation(t as any, child, q);
    expect(res.some((r) => r.errorReadableText.includes("on identifier"))).toBe(
      true,
    );
  });

  it("FAIL: feil type + ingen code", () => {
    const child = makeItem({
      linkId: "rri4",
      definition: `${RR}.identifier`,
      type: "string",
    });
    const q = withAncestor(child);
    const res = serviceRequestValidation(t as any, child, q);
    expect(res.some((r) => r.errorReadableText.includes("on identifier"))).toBe(
      true,
    );
  });
});

describe("reasonReference.display/reference – kun string|display, ingen code-fallback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("PASS: display = string|display", () => {
    (["string", "display"] as const).forEach((allowed) => {
      const child = makeItem({
        linkId: `rrd-${allowed}`,
        definition: `${RR}.display`,
        type: allowed,
      });
      const q = withAncestor(child);
      expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
    });
  });

  it("FAIL: display feil type selv om code.system matcher", () => {
    const child = makeItem({
      linkId: "rrd-x",
      definition: `${RR}.display`,
      type: "choice",
      code: [{ system: FHIR_RES_TYPES, code: "ServiceRequest" }],
    });
    const q = withAncestor(child);
    const res = serviceRequestValidation(t as any, child, q);
    expect(res.some((r) => r.errorReadableText.includes("on display"))).toBe(
      true,
    );
  });

  it("PASS: reference = string|display", () => {
    (["string", "display"] as const).forEach((allowed) => {
      const child = makeItem({
        linkId: `rrref-${allowed}`,
        definition: `${RR}.reference`,
        type: allowed,
      });
      const q = withAncestor(child);
      expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
    });
  });

  it("FAIL: reference feil type (ingen fallback)", () => {
    const child = makeItem({
      linkId: "rrref-x",
      definition: `${RR}.reference`,
      type: "choice",
    });
    const q = withAncestor(child);
    const res = serviceRequestValidation(t as any, child, q);
    expect(res.some((r) => r.errorReadableText.includes("on reference"))).toBe(
      true,
    );
  });
});

describe("supportingInfo.type/identifier – (allowed type) ELLER (code.system === FHIR_RES_TYPES)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("PASS: allowed type (choice) uten code", () => {
    const item = makeItem({
      linkId: "sit1",
      definition: `${SI}.type`,
      type: "choice",
    });
    // ✅ Ancestor kreves også for SI fordi ancestor-funksjonen sjekker begge definisjoner
    const q = withAncestor(item);
    expect(serviceRequestValidation(t as any, item, q)).toEqual([]);
  });

  it("PASS: fallback via code.system === FHIR_RES_TYPES", () => {
    const item = makeItem({
      linkId: "sit2",
      definition: `${SI}.type`,
      type: "string",
      code: [{ system: FHIR_RES_TYPES, code: "ServiceRequest" }],
    });
    const q = withAncestor(item);
    expect(serviceRequestValidation(t as any, item, q)).toEqual([]);
  });

  it("FAIL: feil type og code.system != FHIR_RES_TYPES", () => {
    const item = makeItem({
      linkId: "sit3",
      definition: `${SI}.type`,
      type: "string",
      code: [{ system: "http://example.org/other", code: "X" }],
    });
    const q = withAncestor(item);
    const res = serviceRequestValidation(t as any, item, q);
    expect(res.some((r) => r.errorReadableText.includes("on type"))).toBe(true);
  });

  it("PASS: identifier allowed type (open-choice) uten code", () => {
    const item = makeItem({
      linkId: "sii1",
      definition: `${SI}.identifier`,
      type: "open-choice",
    });
    const q = withAncestor(item);
    expect(serviceRequestValidation(t as any, item, q)).toEqual([]);
  });

  it("PASS: identifier fallback via code.system", () => {
    const item = makeItem({
      linkId: "sii2",
      definition: `${SI}.identifier`,
      type: "string",
      code: [{ system: FHIR_RES_TYPES, code: "ServiceRequest" }],
    });
    const q = withAncestor(item);
    expect(serviceRequestValidation(t as any, item, q)).toEqual([]);
  });

  it("FAIL: identifier feil type uten korrekt code.system", () => {
    const item = makeItem({
      linkId: "sii3",
      definition: `${SI}.identifier`,
      type: "string",
      code: [{ system: "http://example.org/other", code: "X" }],
    });
    const q = withAncestor(item);
    const res = serviceRequestValidation(t as any, item, q);
    expect(res.some((r) => r.errorReadableText.includes("on identifier"))).toBe(
      true,
    );
  });
});

describe("supportingInfo.display/reference – kun string|display", () => {
  beforeEach(() => vi.clearAllMocks());

  it("PASS: display = string|display", () => {
    (["string", "display"] as const).forEach((allowed) => {
      const item = makeItem({
        linkId: `sid-${allowed}`,
        definition: `${SI}.display`,
        type: allowed,
      });
      const q = withAncestor(item);
      expect(serviceRequestValidation(t as any, item, q)).toEqual([]);
    });
  });

  it("FAIL: display feil type (ingen fallback)", () => {
    const item = makeItem({
      linkId: "sid-x",
      definition: `${SI}.display`,
      type: "choice",
      code: [{ system: FHIR_RES_TYPES, code: "ServiceRequest" }],
    });
    const q = withAncestor(item);
    const res = serviceRequestValidation(t as any, item, q);
    expect(res.some((r) => r.errorReadableText.includes("on display"))).toBe(
      true,
    );
  });

  it("PASS: reference = string|display", () => {
    (["string", "display"] as const).forEach((allowed) => {
      const item = makeItem({
        linkId: `sir-${allowed}`,
        definition: `${SI}.reference`,
        type: allowed,
      });
      const q = withAncestor(item);
      expect(serviceRequestValidation(t as any, item, q)).toEqual([]);
    });
  });

  it("FAIL: reference feil type (ingen fallback)", () => {
    const item = makeItem({
      linkId: "sir-x",
      definition: `${SI}.reference`,
      type: "choice",
    });
    const q = withAncestor(item);
    const res = serviceRequestValidation(t as any, item, q);
    expect(res.some((r) => r.errorReadableText.includes("on reference"))).toBe(
      true,
    );
  });
});

describe("ancestorHasServiceRequestExtension – feilscenarier for RR", () => {
  beforeEach(() => vi.clearAllMocks());

  it("FAIL: ingen parent med SDC extension", () => {
    const lone = makeItem({
      linkId: "child",
      definition: `${RR}.type`,
      type: "choice",
    });
    // Ingen SDC extension på parent
    const q = makeQuestionnaire([makeItem({ linkId: "root", item: [lone] })]);
    const res = serviceRequestValidation(t as any, lone, q);
    expect(
      res.some((r) =>
        r.errorReadableText.includes(
          `no item with extension ${SDC_EXT} found as parent to child`,
        ),
      ),
    ).toBe(true);
  });

  it("FAIL: parent har SDC extension, men ingen child med RR/SI-definition", () => {
    const wrongChild = makeItem({
      linkId: "wrongChild",
      definition: "Other#thing",
    });
    const parent = makeParentWithExtractionContext([wrongChild]);
    const q = makeQuestionnaire([parent]);

    const qItem = makeItem({ linkId: "wrongChild", definition: `${RR}.type` });
    const res = serviceRequestValidation(t as any, qItem, q);
    expect(
      res.some((r) =>
        r.errorReadableText.includes(
          `no item with definition ${RR} or ${SI} found as child to wrongChild`,
        ),
      ),
    ).toBe(true);
  });

  it("PASS: gyldig ancestor (SDC extension + child med RR-definition)", () => {
    const child = makeItem({
      linkId: "ok",
      definition: `${RR}.type`,
      type: "choice",
    });
    const q = withAncestor(child);
    expect(serviceRequestValidation(t as any, child, q)).toEqual([]);
  });
});
