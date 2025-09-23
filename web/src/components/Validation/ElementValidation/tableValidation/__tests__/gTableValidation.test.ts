import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "react-i18next";

vi.mock("../utils", () => ({
  isTableType: vi.fn(),
}));
vi.mock("../../fhirExtract/utils", () => ({
  findQuestionnaireItemsInQuestionnaire: vi.fn(),
}));
vi.mock("@helsenorge/refero", () => ({
  isDataReceiver: vi.fn(),
}));
vi.mock("src/helpers/dataReceiverHelper", () => ({
  getLinkIdFromValueString: vi.fn(),
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
import { findQuestionnaireItemsInQuestionnaire } from "../../fhirExtract/utils";
import { getLinkIdFromValueString } from "src/helpers/dataReceiverHelper";

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

    const errors = validateGTable({
      t,
      qItem,
      questionnaire: { item: [] } as any,
    });
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
        { linkId: "row-1", text: "OK", required: true } as any,
        { linkId: "row-2", text: "", required: true } as any,
      ],
    });

    const errors = validateGTable({
      t,
      qItem,
      questionnaire: { item: [] } as any,
    });
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
        { linkId: "row-1", text: "OK", required: true } as any,
        { linkId: "row-2", text: "OK", required: true } as any,
      ],
    });

    const errors = validateGTable({
      t,
      qItem,
      questionnaire: { item: [] } as any,
    });
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

  it("returns [] when gTable and all children have non-empty text AND dataReceiver AND required", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isDataReceiver).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "gt-3",
      item: [
        { required: true, linkId: "row-1", text: "Row 1" } as any,
        { required: true, linkId: "row-2", text: "Row 2" } as any,
      ],
    });

    const errors = validateGTable({
      t,
      qItem,
      questionnaire: { item: [] } as any,
    });
    expect(errors).toEqual([]);
  });

  it("short-circuits: if NOT gTable, none of the checks are executed", () => {
    vi.mocked(isTableType).mockReturnValue(false);

    const qItem = makeItem({
      linkId: "gt-non",
      item: [{ linkId: "row-1" } as any],
    });

    const errors = validateGTable({
      t,
      qItem,
      questionnaire: { item: [] } as any,
    });
    expect(errors).toEqual([]);
    expect(isDataReceiver).not.toHaveBeenCalled();
  });
  it("returns [] when gTable and all children are required", () => {
    vi.mocked(isTableType).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "gt-3",
      item: [
        { linkId: "row-1", type: "string", text: "Row 1", required: true },
        { linkId: "row-2", type: "string", text: "Row 2", required: true },
      ],
    });

    const errors = validateGTable({
      t,
      qItem,
      questionnaire: { item: [] } as any,
    });
    expect(errors).toEqual([]);
  });
  it("errors when gTable but at least one child is NOT required", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    const qItem = makeItem({
      linkId: "gt-4",
      item: [
        { linkId: "row-1", type: "string", text: "Row 1", required: false },
        {
          linkId: "row-2",
          type: "string",
          text: "Row 2",
          required: false,
        },
      ],
    });
    vi.mocked(findQuestionnaireItemsInQuestionnaire).mockReturnValue([qItem]);
    vi.mocked(getLinkIdFromValueString).mockImplementation(
      (item) => item.linkId,
    );
    const errors = validateGTable({
      t,
      qItem,
      questionnaire: { item: [qItem] } as any,
    });
    expect(errors).toHaveLength(2);
    expect(errors[0]).toMatchObject({
      linkId: "row-1",
      errorProperty: ValidationType.table,
      errorReadableText: "Item with linkId {0} are not required".replace(
        "{0}",
        "row-1",
      ),
      errorLevel: ErrorLevel.error,
    });
    expect(createError).toHaveBeenCalledTimes(2);
  });
});
