// __tests__/table-utils.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { QuestionnaireItem, Extension, Coding } from "fhir/r4";
import type { TFunction } from "react-i18next";

// 🔧 ADJUST THIS to your actual module path:
import {
  itemHasCodeWithSystem,
  itemHasCodeWithOneOrMoreSystems,
  itemHasInitialValue,
  isCalculatedExpression,
  itemIsScoringItem,
  hasTableColumnCode,
  hasTableColumnNameCode,
  isAllowedTableItem,
  isTableType,
  checkAllDecendantsForCorrectTypes,
  isItemsWithReadOnlyProperty,
  type TableType,
  itemIsEnrichedText,
} from "../utils"; // <-- CHANGE THIS
// Keep the real enums/types from your codebase:
import {
  IQuestionnaireItemType,
  IExtensionType,
  ICodeSystem,
} from "src/types/IQuestionnareItemType";

// We want to partially mock itemControl helpers to control behavior in tests,
// but still keep real enums (ItemControlType).
vi.mock("src/helpers/itemControl", async () => {
  const actual = await vi.importActual<any>("src/helpers/itemControl");
  return {
    ...actual,
    isItemControlDataReceiver: vi.fn(),
    itemControlExistsInExtensionList: vi.fn(),
  };
});

// Mock refero fns we rely on
vi.mock("@helsenorge/refero", () => ({
  getCodes: vi.fn(),
  getExtension: vi.fn(),
}));

import { ItemControlType } from "src/helpers/itemControl";
import { getCodes, getExtension } from "@helsenorge/refero";

const mockedIsItemControlDataReceiver = vi.mocked(
  (await import("src/helpers/itemControl")).isItemControlDataReceiver,
);
const mockedItemControlExistsInExtensionList = vi.mocked(
  (await import("src/helpers/itemControl")).itemControlExistsInExtensionList,
);
const mockedGetCodes = vi.mocked(getCodes);
const mockedGetExtension = vi.mocked(getExtension);

// --- helpers ---------------------------------------------------------------

const t: TFunction<"translation"> = ((s: string) => s) as any;

function makeItem(partial?: Partial<QuestionnaireItem>): QuestionnaireItem {
  return {
    linkId: partial?.linkId ?? "link-1",
    type: partial?.type ?? IQuestionnaireItemType.string,
    text: partial?.text,
    code: partial?.code,
    initial: partial?.initial,
    extension: partial?.extension as Extension[] | undefined,
    item: partial?.item as QuestionnaireItem[] | undefined,
  } as QuestionnaireItem;
}

function extItemControl(codes: string[]): Extension {
  return {
    url: IExtensionType.itemControl,
    valueCodeableConcept: {
      coding: codes.map((code) => ({
        system: "http://hl7.org/fhir/ValueSet/questionnaire-item-control",
        code,
      })),
    },
  };
}

function coding(system: string, code?: string, display?: string): Coding {
  return { system, code, display };
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("itemHasCodeWithSystem", () => {
  it("returns true when item has code with given system", () => {
    const item = makeItem({
      code: [coding(ICodeSystem.score, "score")],
    });
    expect(itemHasCodeWithSystem(item, ICodeSystem.score)).toBe(true);
  });

  it("returns false when code exists but with different system", () => {
    const item = makeItem({
      code: [coding(ICodeSystem.tableColumn, "col")],
    });
    expect(itemHasCodeWithSystem(item, ICodeSystem.score)).toBe(false);
  });

  it("returns false when item has no codes", () => {
    const item = makeItem();
    expect(itemHasCodeWithSystem(item, ICodeSystem.score)).toBe(false);
  });
});

describe("itemHasCodeWithOneOrMoreSystems", () => {
  it("true if any system matches", () => {
    const item = makeItem({
      code: [
        coding(ICodeSystem.tableColumn, "x"),
        coding(ICodeSystem.score, "score"),
      ],
    });
    expect(
      itemHasCodeWithOneOrMoreSystems(item, [
        ICodeSystem.validationOptions,
        ICodeSystem.score,
      ]),
    ).toBe(true);
  });

  it("false if none match", () => {
    const item = makeItem({
      code: [coding(ICodeSystem.tableColumnName, "x")],
    });
    expect(
      itemHasCodeWithOneOrMoreSystems(item, [
        ICodeSystem.validationOptions,
        ICodeSystem.score,
      ]),
    ).toBe(false);
  });
});

describe("itemHasInitialValue", () => {
  it("true when initial exists with length>0", () => {
    const item = makeItem({
      initial: [{ valueString: "foo" }],
    });
    expect(itemHasInitialValue(item)).toBe(true);
  });

  it("false when initial missing or empty", () => {
    expect(itemHasInitialValue(makeItem())).toBe(false);
    expect(itemHasInitialValue(makeItem({ initial: [] }))).toBe(false);
  });
});

describe("itemIsEnrichedText (IExtensionType.fhirPath)", () => {
  it("true when fhirPath extension exists", () => {
    mockedGetExtension.mockReturnValueOnce({} as any);
    expect(itemIsEnrichedText(makeItem())).toBe(true);
    expect(mockedGetExtension).toHaveBeenCalledWith(
      IExtensionType.fhirPath,
      expect.any(Object),
    );
  });

  it("false when missing", () => {
    mockedGetExtension.mockReturnValueOnce(undefined as any);
    expect(itemIsEnrichedText(makeItem())).toBe(false);
  });
});

describe("isCalculatedExpression (IExtensionType.calculatedExpression)", () => {
  it("true when extension exists", () => {
    mockedGetExtension.mockReturnValueOnce({} as any);
    expect(isCalculatedExpression(makeItem())).toBe(true);
    expect(mockedGetExtension).toHaveBeenCalledWith(
      IExtensionType.calculatedExpression,
      expect.any(Object),
    );
  });

  it("false when missing", () => {
    mockedGetExtension.mockReturnValueOnce(undefined as any);
    expect(isCalculatedExpression(makeItem())).toBe(false);
  });
});

describe("itemIsScoringItem (getCodes with ICodeSystem.score)", () => {
  it("true when getCodes returns non-empty", () => {
    mockedGetCodes.mockReturnValueOnce([{ system: ICodeSystem.score }] as any);
    expect(itemIsScoringItem(makeItem())).toBe(true);
    expect(mockedGetCodes).toHaveBeenCalledWith(
      expect.any(Object),
      ICodeSystem.score,
    );
  });

  it("false when getCodes empty/undefined", () => {
    mockedGetCodes.mockReturnValueOnce([]);
    expect(itemIsScoringItem(makeItem())).toBe(false);

    mockedGetCodes.mockReturnValueOnce(undefined as any);
    expect(itemIsScoringItem(makeItem())).toBe(false);
  });
});

describe("hasTableColumnCode / hasTableColumnNameCode", () => {
  it("table column true when system matches", () => {
    const item = makeItem({
      code: [coding(ICodeSystem.tableColumn, "col")],
    });
    expect(hasTableColumnCode(item)).toBe(true);
  });

  it("table column name true when system matches", () => {
    const item = makeItem({
      code: [coding(ICodeSystem.tableColumnName, "name")],
    });
    expect(hasTableColumnNameCode(item)).toBe(true);
  });

  it("false when system does not match", () => {
    const item = makeItem({
      code: [coding(ICodeSystem.score, "score")],
    });
    expect(hasTableColumnCode(item)).toBe(false);
    expect(hasTableColumnNameCode(item)).toBe(false);
  });
});

describe("isAllowedTableItem", () => {
  it("true for display items", () => {
    const item = makeItem({ type: IQuestionnaireItemType.display });
    mockedIsItemControlDataReceiver.mockReturnValue(false);
    mockedGetExtension.mockReturnValue(undefined as any);
    mockedGetCodes.mockReturnValue([]);
    expect(isAllowedTableItem({ qItem: item })).toBe(true);
  });

  it("true for data receiver", () => {
    const item = makeItem();
    mockedIsItemControlDataReceiver.mockReturnValue(true);
    mockedGetExtension.mockReturnValue(undefined as any);
    mockedGetCodes.mockReturnValue([]);
    expect(isAllowedTableItem({ qItem: item })).toBe(true);
  });

  it("true for items with initial value", () => {
    const item = makeItem({ initial: [{ valueInteger: 1 }] });
    mockedIsItemControlDataReceiver.mockReturnValue(false);
    mockedGetExtension.mockReturnValue(undefined as any);
    mockedGetCodes.mockReturnValue([]);
    expect(isAllowedTableItem({ qItem: item })).toBe(true);
  });

  it("true for enriched text (fhirPath extension)", () => {
    const item = makeItem();
    mockedIsItemControlDataReceiver.mockReturnValue(false);
    mockedGetExtension.mockImplementation((url) =>
      url === IExtensionType.fhirPath ? ({} as any) : undefined,
    );
    mockedGetCodes.mockReturnValue([]);
    expect(isAllowedTableItem({ qItem: item })).toBe(true);
  });

  it("true for calculatedExpression", () => {
    const item = makeItem();
    mockedIsItemControlDataReceiver.mockReturnValue(false);
    mockedGetExtension.mockImplementation((url) =>
      url === IExtensionType.calculatedExpression ? ({} as any) : undefined,
    );
    mockedGetCodes.mockReturnValue([]);
    expect(isAllowedTableItem({ qItem: item })).toBe(true);
  });

  it("true for scoring item", () => {
    const item = makeItem();
    mockedIsItemControlDataReceiver.mockReturnValue(false);
    mockedGetExtension.mockReturnValue(undefined as any);
    mockedGetCodes.mockReturnValue([{ system: ICodeSystem.score }] as any);
    expect(isAllowedTableItem({ qItem: item })).toBe(true);
  });

  it("false when none of the allowed conditions hold", () => {
    const item = makeItem({
      type: IQuestionnaireItemType.string,
      initial: [],
    });
    mockedIsItemControlDataReceiver.mockReturnValue(false);
    mockedGetExtension.mockReturnValue(undefined as any);
    mockedGetCodes.mockReturnValue([]);
    expect(isAllowedTableItem({ qItem: item })).toBe(false);
  });
});

describe("isTableType", () => {
  it("true when item is a group and extension list contains the table control", () => {
    const item = makeItem({
      type: IQuestionnaireItemType.group,
      extension: [extItemControl([ItemControlType.table])],
    });
    mockedItemControlExistsInExtensionList.mockReturnValue(true);
    expect(
      isTableType({
        qItem: item,
        tableType: ItemControlType.table as TableType,
      }),
    ).toBe(true);
    expect(mockedItemControlExistsInExtensionList).toHaveBeenCalledWith(
      item.extension,
      ItemControlType.table,
    );
  });

  it("false if not group", () => {
    const item = makeItem({
      type: IQuestionnaireItemType.string,
      extension: [extItemControl([ItemControlType.table])],
    });
    mockedItemControlExistsInExtensionList.mockReturnValue(true);
    expect(
      isTableType({
        qItem: item,
        tableType: ItemControlType.table as TableType,
      }),
    ).toBe(false);
  });

  it("false if extension list does not contain table control", () => {
    const item = makeItem({
      type: IQuestionnaireItemType.group,
    });
    mockedItemControlExistsInExtensionList.mockReturnValue(false);
    expect(
      isTableType({
        qItem: item,
        tableType: ItemControlType.table as TableType,
      }),
    ).toBe(false);
  });
});

describe("checkAllDecendantsForCorrectTypes", () => {
  const makeError = (it: QuestionnaireItem, tFn: TFunction<"translation">) => ({
    linkId: it.linkId ?? "",
    errorProperty: "type",
    errorLevel: "error" as any,
    errorReadableText: tFn("Invalid item type"),
  });

  it("returns empty when no items", () => {
    const errors = checkAllDecendantsForCorrectTypes({
      errorFn: makeError,
      item: undefined,
      t,
    });
    expect(errors).toEqual([]);
  });

  it("collects errors only for items that are NOT allowed", () => {
    // One allowed (display), one disallowed (plain string without any flags)
    const children: QuestionnaireItem[] = [
      makeItem({ linkId: "ok", type: IQuestionnaireItemType.display }),
      makeItem({ linkId: "bad", type: IQuestionnaireItemType.string }),
    ];

    mockedIsItemControlDataReceiver.mockReturnValue(false);
    mockedGetExtension.mockReturnValue(undefined as any);
    mockedGetCodes.mockReturnValue([]);

    const errors = checkAllDecendantsForCorrectTypes({
      errorFn: makeError,
      item: children,
      t,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "bad",
      errorProperty: "type",
      errorReadableText: "Invalid item type",
    });
  });
});

describe("isItemsWithReadOnlyProperty", () => {
  it("false for display items", () => {
    const item = makeItem({ type: IQuestionnaireItemType.display });
    expect(isItemsWithReadOnlyProperty(item)).toBe(false);
  });

  it("true for all non-display items", () => {
    const item = makeItem({ type: IQuestionnaireItemType.string });
    expect(isItemsWithReadOnlyProperty(item)).toBe(true);
  });
});
