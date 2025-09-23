import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "react-i18next";

vi.mock("../utils", () => ({
  isTableType: vi.fn(),
  isAllowedTableItem: vi.fn(),
  hasTableColumnCode: vi.fn(),
  hasTableColumnNameCode: vi.fn(),
  hasTableColumnCodeWithCodeAndDisplay: vi.fn(),
  hasTableColumnNameWithCodeAndDisplay: vi.fn(),
}));

vi.mock("../../validationHelper", () => ({
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
  hasTableColumnCode,
  hasTableColumnNameCode,
  hasTableColumnCodeWithCodeAndDisplay,
  hasTableColumnNameWithCodeAndDisplay,
} from "../utils";
import { validateTableHn2 } from "../tableHn2Validation";
import {
  ErrorLevel,
  ValidationType,
} from "src/components/Validation/validationTypes";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
const t: TFunction<"translation"> = ((s: string) => s) as any;

const makeItem = (partial?: Partial<QuestionnaireItem>): QuestionnaireItem =>
  ({
    linkId: partial?.linkId ?? "hn2-1",
    type: partial?.type ?? "group",
    text: partial?.text,
    readOnly: partial?.readOnly,
    item: partial?.item,
    code: partial?.code,
    extension: partial?.extension,
  }) as QuestionnaireItem;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
describe("validateTableHn2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns [] when NOT a tableHN2 group", () => {
    vi.mocked(isTableType).mockReturnValue(false);

    const qItem = makeItem({
      item: [{ linkId: "c1" } as any],
    });

    const errors = validateTableHn2({ t, qItem });
    expect(errors).toEqual([]);
    expect(isTableType).toHaveBeenCalled();
  });

  it("errors when tableHN2 has a child that is NOT an allowed table item", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isAllowedTableItem).mockReturnValueOnce(false);

    vi.mocked(hasTableColumnNameWithCodeAndDisplay).mockReturnValue(true);
    vi.mocked(hasTableColumnCodeWithCodeAndDisplay).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "hn2-bad-child",
      item: [{ linkId: "row-1" } as any],
    });

    const errors = validateTableHn2({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "row-1",
      errorProperty: ValidationType.table,
      errorLevel: ErrorLevel.error,
    });
    expect(errors[0].errorReadableText).toContain(
      "Table options must have the correct item types",
    );
  });

  it("errors when tableHN2 is missing table-column-name code on the group", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(hasTableColumnNameWithCodeAndDisplay).mockReturnValue(false);

    vi.mocked(isAllowedTableItem).mockReturnValue(true);
    vi.mocked(hasTableColumnCodeWithCodeAndDisplay).mockReturnValue(true);

    const qItem = makeItem({ linkId: "hn2-missing-name", item: [] });
    const errors = validateTableHn2({ t, qItem });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "hn2-missing-name",
      errorReadableText: "Table must have at least one table-column-name code",
    });
  });

  it("errors when a descendant is missing table-column code", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(hasTableColumnNameWithCodeAndDisplay).mockReturnValue(true);
    vi.mocked(isAllowedTableItem).mockReturnValue(true);

    vi.mocked(hasTableColumnCodeWithCodeAndDisplay).mockReturnValue(false);

    const qItem = makeItem({
      linkId: "hn2-missing-col",
      item: [{ linkId: "row-1" } as any],
    });

    const errors = validateTableHn2({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "row-1",
      errorReadableText:
        "All decendents of a tableHN2 must have a table-column code",
    });
  });

  it("aggregates errors from all three checks", () => {
    vi.mocked(isTableType).mockReturnValue(true);

    vi.mocked(isAllowedTableItem).mockReturnValue(false);
    vi.mocked(hasTableColumnNameWithCodeAndDisplay).mockReturnValue(false);
    vi.mocked(hasTableColumnCodeWithCodeAndDisplay).mockReturnValue(false);

    const qItem = makeItem({
      linkId: "hn2-agg",
      item: [{ linkId: "row-1" } as any],
    });

    const errors = validateTableHn2({ t, qItem });
    expect(errors).toHaveLength(3);
    const texts = errors.map((e) => e.errorReadableText);
    expect(texts.some((m) => m.includes("correct item types"))).toBe(true);
    expect(texts.some((m) => m.includes("table-column-name code"))).toBe(true);
    expect(texts.some((m) => m.includes("table-column code"))).toBe(true);
  });

  it("returns [] when tableHN2 is valid: name code present, all children allowed, all descendants have table-column code", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(hasTableColumnNameCode).mockReturnValue(true);
    vi.mocked(isAllowedTableItem).mockReturnValue(true);
    vi.mocked(hasTableColumnCode).mockReturnValue(true);
    vi.mocked(hasTableColumnNameWithCodeAndDisplay).mockReturnValue(true);
    vi.mocked(hasTableColumnCodeWithCodeAndDisplay).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "hn2-ok",
      item: [{ linkId: "row-1" } as any, { linkId: "row-2" } as any],
    });

    expect(validateTableHn2({ t, qItem })).toEqual([]);
  });

  it("should report when SECOND child is missing table-column code ", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(hasTableColumnNameCode).mockReturnValue(true);
    vi.mocked(isAllowedTableItem).mockReturnValue(true);

    vi.mocked(hasTableColumnCodeWithCodeAndDisplay).mockImplementation(
      (q) => q.linkId !== "row-2",
    );

    const qItem = makeItem({
      linkId: "hn2-bug",
      item: [{ linkId: "row-1" } as any, { linkId: "row-2" } as any],
    });

    const errors = validateTableHn2({ t, qItem });

    expect(errors.some((e) => e.linkId === "row-2")).toBe(true);
  });
});
