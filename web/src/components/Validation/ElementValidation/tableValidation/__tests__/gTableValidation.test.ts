import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "react-i18next";

vi.mock("../utils", () => ({
  isTableType: vi.fn(),
}));

vi.mock("@helsenorge/refero", () => ({
  isDataReceiver: vi.fn(),
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

import { validateGTable } from "../gTableValidation";
import { ItemControlType } from "src/helpers/itemControl";

import { isTableType } from "../utils";
import { isDataReceiver } from "@helsenorge/refero";
import {
  ErrorLevel,
  ValidationType,
} from "src/components/Validation/validationTypes";
import { createError } from "src/components/Validation/validationHelper";

// -----------------------------------------------------------------------------
// Test helpers
// -----------------------------------------------------------------------------
const t: TFunction<"translation"> = ((s: string) => s) as any;

const makeItem = (partial?: Partial<QuestionnaireItem>): QuestionnaireItem =>
  ({
    linkId: partial?.linkId ?? "tbl-1",
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
describe("validateGTable", () => {
  it("returns [] when item is NOT a gTable group", () => {
    vi.mocked(isTableType).mockReturnValue(false);

    const qItem = makeItem({
      item: [
        { linkId: "c1", text: "Row 1" } as any,
        { linkId: "c2", text: "Row 2" } as any,
      ],
    });

    const errors = validateGTable({ t, qItem });
    expect(errors).toEqual([]);
    expect(isTableType).toHaveBeenCalledWith({
      qItem,
      tableType: ItemControlType.gTable,
    });
  });

  it("errors when gTable but at least one child is missing text", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isDataReceiver).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "gt-1",
      item: [
        { linkId: "row-1", text: "OK" } as any,
        { linkId: "row-2", text: "" } as any,
      ],
    });

    const errors = validateGTable({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "gt-1",
      errorProperty: ValidationType.table,
      errorReadableText: "All items in a gTable must have a text value",
      errorLevel: ErrorLevel.error,
    });
    expect(createError).toHaveBeenCalledTimes(1);
  });

  it("errors when gTable but at least one child is missing dataReceiver extension", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isDataReceiver)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const qItem = makeItem({
      linkId: "gt-2",
      item: [
        { linkId: "row-1", text: "OK" } as any,
        { linkId: "row-2", text: "OK" } as any,
      ],
    });

    const errors = validateGTable({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "gt-2",
      errorProperty: ValidationType.table,
      errorReadableText:
        "All items in a gTable must have a dataReceiver extension",
      errorLevel: ErrorLevel.error,
    });
    expect(createError).toHaveBeenCalledTimes(1);
  });

  it("returns [] when gTable and all children have non-empty text AND dataReceiver", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isDataReceiver).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "gt-3",
      item: [
        { linkId: "row-1", text: "Row 1" } as any,
        { linkId: "row-2", text: "Row 2" } as any,
      ],
    });

    const errors = validateGTable({ t, qItem });
    expect(errors).toEqual([]);
  });

  it("short-circuits: if NOT gTable, none of the checks are executed", () => {
    vi.mocked(isTableType).mockReturnValue(false);

    const qItem = makeItem({
      linkId: "gt-non",
      item: [{ linkId: "row-1" } as any],
    });

    const errors = validateGTable({ t, qItem });
    expect(errors).toEqual([]);
    expect(isDataReceiver).not.toHaveBeenCalled();
  });
});
