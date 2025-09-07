import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "react-i18next";

import {
  IQuestionnaireItemType,
  ICodeSystem,
} from "src/types/IQuestionnareItemType";

vi.mock("src/helpers/itemControl", async () => {
  const actual = await vi.importActual<any>("src/helpers/itemControl");
  return {
    ...actual,
    oneOrMoreItemControlsExistOnItem: vi.fn(),
    ItemControlType: actual.ItemControlType,
  };
});

vi.mock("../utils", () => ({
  isItemsWithReadOnlyProperty: vi.fn(),
  itemHasCodeWithOneOrMoreSystems: vi.fn(),
  itemHasCodeWithSystem: vi.fn(),
}));

vi.mock("../../../validationHelper", () => ({
  createError: vi.fn(
    (linkId: string, errorProperty: any, text: string, level: any) => ({
      linkId,
      errorProperty,
      errorReadableText: text,
      errorLevel: level,
    }),
  ),
}));

import { oneOrMoreItemControlsExistOnItem } from "src/helpers/itemControl";
import {
  allTableItemsMustBeReadOnly,
  validateTableCodes,
  validateTableCommonFunction,
  validateTableOrderingColumn,
} from "../commonTableValidation";
import {
  isItemsWithReadOnlyProperty,
  itemHasCodeWithOneOrMoreSystems,
  itemHasCodeWithSystem,
} from "../utils";
import { createError } from "src/components/Validation/validationHelper";

// -----------------------------------------------------------------------------
// Test helpers
// -----------------------------------------------------------------------------
const t: TFunction<"translation"> = ((s: string) => s) as any;

const makeItem = (partial?: Partial<QuestionnaireItem>): QuestionnaireItem =>
  ({
    linkId: partial?.linkId ?? "link-1",
    type: partial?.type ?? IQuestionnaireItemType.group,
    item: partial?.item,
    readOnly: partial?.readOnly,
    code: partial?.code,
  }) as QuestionnaireItem;

beforeEach(() => {
  vi.clearAllMocks();
});

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
describe("validateTableCodes", () => {
  it("returnerer error når item har en av table-kodene men IKKE er table group", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(false);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(true);

    const qItem = makeItem({
      type: IQuestionnaireItemType.string,
      linkId: "x1",
    });
    const errors = validateTableCodes({ t, qItem });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "x1",
      errorProperty: expect.anything(),
      errorReadableText: "item with table codes must be a table group",
    });
    expect(createError).toHaveBeenCalledTimes(1);
  });

  it("returnerer [] når item er table group", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(true);
    const qItem = makeItem({ linkId: "x2" });
    expect(validateTableCodes({ t, qItem })).toEqual([]);
  });

  it("returnerer [] når item ikke har noen av table-kodene", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(false);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(false);
    const qItem = makeItem({
      type: IQuestionnaireItemType.string,
      linkId: "x3",
    });
    expect(validateTableCodes({ t, qItem })).toEqual([]);
  });
});

describe("validateTableOrderingColumn", () => {
  it("[] når ikke table group (uansett koder)", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(false);
    vi.mocked(itemHasCodeWithSystem).mockReturnValue(false);
    const qItem = makeItem({
      type: IQuestionnaireItemType.group,
      linkId: "t0",
    });
    expect(validateTableOrderingColumn({ t, qItem })).toEqual([]);
  });

  it("error hvis table group har ordering column men mangler ordering functions", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    vi.mocked(itemHasCodeWithSystem).mockImplementation((item, system) =>
      system === ICodeSystem.tableOrderingColumn ? true : false,
    );

    const qItem = makeItem({ linkId: "t1" });
    const errors = validateTableOrderingColumn({ t, qItem });

    expect(errors).toHaveLength(1);
    expect(errors[0].errorReadableText).toContain(
      "Table with table ordering column must also have the table ordering functions code",
    );
  });

  it("error hvis table group har ordering functions men mangler ordering column", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    vi.mocked(itemHasCodeWithSystem).mockImplementation((item, system) =>
      system === ICodeSystem.tableOrderingFunctions ? true : false,
    );

    const qItem = makeItem({ linkId: "t2" });
    const errors = validateTableOrderingColumn({ t, qItem });

    expect(errors).toHaveLength(1);
    expect(errors[0].errorReadableText).toContain(
      "Table with table ordering functions must also have the table ordering column code",
    );
  });

  it("[] når begge (column + functions) finnes på table group", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    vi.mocked(itemHasCodeWithSystem).mockImplementation(
      (item, system) =>
        system === ICodeSystem.tableOrderingFunctions ||
        system === ICodeSystem.tableOrderingColumn,
    );

    const qItem = makeItem({ linkId: "t3" });
    expect(validateTableOrderingColumn({ t, qItem })).toEqual([]);
  });
});

describe("allTableItemsMustBeReadOnly", () => {
  it("[] når ikke table group", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(false);
    const qItem = makeItem({
      type: IQuestionnaireItemType.group,
      item: [{ linkId: "c1", readOnly: false } as any],
    });
    expect(allTableItemsMustBeReadOnly({ t, qItem })).toEqual([]);
  });

  it("error når minst ett barn (og/eller etterkommere) ikke er readOnly og elementet har readonly-egenskap (isItemsWithReadOnlyProperty = true)", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    const qItem = makeItem({
      linkId: "tbl1",
      item: [
        {
          linkId: "c1",
          readOnly: false,
          type: IQuestionnaireItemType.string,
        } as any,
      ],
    });

    vi.mocked(isItemsWithReadOnlyProperty).mockReturnValue(true);

    const errors = allTableItemsMustBeReadOnly({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "tbl1",
      errorReadableText: "All items in a table must be readOnly",
    });
  });

  it("[] når alle barn/etterkommere er readOnly (uavhengig av isItemsWithReadOnlyProperty)", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    const qItem = makeItem({
      linkId: "tbl2",
      item: [
        {
          linkId: "c1",
          readOnly: true,
          type: IQuestionnaireItemType.string,
          item: [
            {
              linkId: "gc1",
              readOnly: true,
              type: IQuestionnaireItemType.string,
            } as any,
          ],
        } as any,
      ],
    });

    vi.mocked(isItemsWithReadOnlyProperty).mockReturnValue(true);

    expect(allTableItemsMustBeReadOnly({ t, qItem })).toEqual([]);
  });

  it("[] når et barn ikke er readOnly, men isItemsWithReadOnlyProperty(child) er false (f.eks. display)", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    const qItem = makeItem({
      linkId: "tbl3",
      item: [
        {
          linkId: "c1",
          readOnly: false,
          type: IQuestionnaireItemType.display,
        } as any,
      ],
    });

    vi.mocked(isItemsWithReadOnlyProperty).mockReturnValue(false);

    expect(allTableItemsMustBeReadOnly({ t, qItem })).toEqual([]);
  });

  it("[] når table group ikke har barn (readonly-sjekk har ingenting å validere)", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    const qItem = makeItem({ linkId: "tbl4", item: [] });
    expect(allTableItemsMustBeReadOnly({ t, qItem })).toEqual([]);
  });
});

describe("validateTableCommonFunction", () => {
  it("kombinerer feil fra delvalideringer (ordering + codes + readonly + children)", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);

    vi.mocked(itemHasCodeWithSystem).mockImplementation((_, system) =>
      system === ICodeSystem.tableOrderingColumn ? true : false,
    );

    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(true);

    vi.mocked(isItemsWithReadOnlyProperty).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "tbl-common",
      item: [
        {
          linkId: "c1",
          readOnly: false,
          type: IQuestionnaireItemType.string,
        } as any,
      ],
    });

    const errors = validateTableCommonFunction({ t, qItem });

    expect(errors.length).toBe(2);
    expect(errors.some((e) => e.errorReadableText.includes("ordering"))).toBe(
      true,
    );
    expect(errors.some((e) => e.errorReadableText.includes("readOnly"))).toBe(
      true,
    );
  });

  it("inkluderer 'Table groups must contain at least one child item' når table group er tom", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);

    vi.mocked(itemHasCodeWithSystem).mockReturnValue(false);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(false);
    vi.mocked(isItemsWithReadOnlyProperty).mockReturnValue(true);

    const qItem = makeItem({ linkId: "tbl-empty", item: [] });
    const errors = validateTableCommonFunction({ t, qItem });

    expect(errors).toHaveLength(1);
    expect(errors[0].errorReadableText).toBe(
      "Table groups must contain at least one child item",
    );
  });

  it("[] når alt er gyldig (table group, begge ordering-koder, alle barn readOnly, har barn)", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);
    vi.mocked(itemHasCodeWithSystem).mockImplementation(
      (_, system) =>
        system === ICodeSystem.tableOrderingColumn ||
        system === ICodeSystem.tableOrderingFunctions,
    );
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(false);
    vi.mocked(isItemsWithReadOnlyProperty).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "tbl-ok",
      item: [
        {
          linkId: "c1",
          readOnly: true,
          type: IQuestionnaireItemType.string,
        } as any,
        {
          linkId: "c2",
          readOnly: true,
          type: IQuestionnaireItemType.integer,
        } as any,
      ],
    });

    expect(validateTableCommonFunction({ t, qItem })).toEqual([]);
  });

  it("fanger 'item with table codes must be a table group' når item ikke er table group men har table-koder", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(false);
    vi.mocked(itemHasCodeWithOneOrMoreSystems).mockReturnValue(true);

    const qItem = makeItem({
      type: IQuestionnaireItemType.string,
      linkId: "not-table",
    });

    const errors = validateTableCommonFunction({ t, qItem });
    expect(errors).toHaveLength(1);
    expect(errors[0].errorReadableText).toBe(
      "item with table codes must be a table group",
    );
  });
});
