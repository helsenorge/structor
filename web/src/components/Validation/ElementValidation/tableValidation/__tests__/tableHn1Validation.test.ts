import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "react-i18next";

vi.mock("../utils", () => ({
  isTableType: vi.fn(),
  isAllowedTableItem: vi.fn(),
  itemHasCodeWithOneOrMoreSystems: vi.fn(),
}));

vi.mock("src/components/Validation/validationHelper", () => ({
  createError: vi.fn(
    (
      linkId: string,
      errorProperty: any,
      errorReadableText: string,
      errorLevel: any,
    ) => ({
      linkId,
      errorProperty,
      errorReadableText,
      errorLevel,
    }),
  ),
}));

import {
  isTableType,
  isAllowedTableItem,
  itemHasCodeWithOneOrMoreSystems,
} from "../utils";
import { validateTableHn1 } from "../tableHn1Validation";
import {
  ErrorLevel,
  ValidationType,
} from "src/components/Validation/validationTypes";
import { createError } from "src/components/Validation/validationHelper";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
const t: TFunction<"translation"> = ((s: string) => s) as any;

const makeItem = (partial?: Partial<QuestionnaireItem>): QuestionnaireItem =>
  ({
    linkId: partial?.linkId ?? "hn1-1",
    type: partial?.type ?? "group",
    text: partial?.text,
    readOnly: partial?.readOnly,
    item: partial?.item,
    code: partial?.code,
    extension: partial?.extension,
  }) as QuestionnaireItem;

beforeEach(() => {
  vi.clearAllMocks();
});

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
describe("validateTableHn1", () => {
  it("returns [] when item is NOT a tableHN1 group", () => {
    vi.mocked(isTableType).mockReturnValue(false);

    const qItem = makeItem({
      item: [{ linkId: "c1", text: "x" } as any],
    });

    const errors = validateTableHn1({ t, qItem });
    expect(errors).toEqual([]);
    expect(isTableType).toHaveBeenCalledTimes(2);
  });

  it("returns error when tableHN1 has sorting codes (ordering column/functions present)", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(true);

    vi.mocked(isAllowedTableItem).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "hn1-sort",
      item: [{ linkId: "row-1" } as any],
    });

    const errors = validateTableHn1({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "hn1-sort",
      errorProperty: ValidationType.table,
      errorReadableText: "tableHN1 cannot have sorting",
      errorLevel: ErrorLevel.error,
    });
    expect(createError).toHaveBeenCalledTimes(1);
  });

  it("returns error when tableHN1 has a child that is NOT an allowed table item", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(false);

    vi.mocked(isAllowedTableItem)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const qItem = makeItem({
      linkId: "hn1-child",
      item: [{ linkId: "row-1" } as any, { linkId: "row-2" } as any],
    });

    const errors = validateTableHn1({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "hn1-child",
      errorProperty: ValidationType.table,
    });
    expect(errors[0].errorReadableText).toContain(
      "Table options must have the correct item types",
    );
  });

  it("returns [] when tableHN1 has NO sorting and ALL children are allowed", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(false);
    vi.mocked(isAllowedTableItem).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "hn1-ok",
      item: [{ linkId: "row-1" } as any, { linkId: "row-2" } as any],
    });

    const errors = validateTableHn1({ t, qItem });
    expect(errors).toEqual([]);
  });

  it("aggregates both errors when sorting is present AND there is an invalid child", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(true);
    vi.mocked(isAllowedTableItem).mockReturnValue(false);

    const qItem = makeItem({
      linkId: "hn1-both",
      item: [{ linkId: "row-1" } as any],
    });

    const errors = validateTableHn1({ t, qItem });
    expect(errors).toHaveLength(2);

    const msgs = errors.map((e) => e.errorReadableText);
    expect(msgs.some((m) => m.includes("cannot have sorting"))).toBe(true);
    expect(
      msgs.some((m) =>
        m.includes("Table options must have the correct item types"),
      ),
    ).toBe(true);
  });

  it("[] when tableHN1 has no children (no invalid child to flag and no sorting)", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(false);
    const qItem = makeItem({ linkId: "hn1-empty", item: [] });

    const errors = validateTableHn1({ t, qItem });
    expect(errors).toEqual([]);
    expect(isAllowedTableItem).not.toHaveBeenCalled();
  });
});
