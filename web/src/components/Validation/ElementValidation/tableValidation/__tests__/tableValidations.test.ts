// src/components/Validation/ElementValidation/tableValidation/__tests__/tableValidations.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "react-i18next";

vi.mock("../utils", () => ({
  isTableType: vi.fn(),
  checkAllDecendantsForCorrectTypes: vi.fn(),
}));

vi.mock("src/helpers/itemControl", async () => {
  const actual = await vi.importActual<any>("src/helpers/itemControl");
  return {
    ...actual,
    existItemControlWithCode: vi.fn(),
    oneOrMoreItemControlsExistOnItem: vi.fn(),
    ItemControlType: actual.ItemControlType,
  };
});

vi.mock("src/helpers/codeHelper", () => ({
  getAllOrderItemChildrenOfItem: vi.fn(),
}));

vi.mock("src/helpers/valueSetHelper", () => ({
  doesAllItemsHaveSameAnswerValueSet: vi.fn(),
}));

vi.mock("@helsenorge/refero", () => ({
  isDataReceiver: vi.fn(),
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

// --- SUT ---------------------------------------------------------------------
import { validateTable } from "../tableValidation";

// --- Hent mocks med typer ----------------------------------------------------
import { isTableType, checkAllDecendantsForCorrectTypes } from "../utils";
import {
  existItemControlWithCode,
  oneOrMoreItemControlsExistOnItem,
} from "src/helpers/itemControl";
import { getAllOrderItemChildrenOfItem } from "src/helpers/codeHelper";
import { doesAllItemsHaveSameAnswerValueSet } from "src/helpers/valueSetHelper";
import { isDataReceiver } from "@helsenorge/refero";
import { createError } from "../../../validationHelper";

import { IQuestionnaireItemType } from "src/types/IQuestionnareItemType";
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
    linkId: partial?.linkId ?? "tbl-1",
    type: partial?.type ?? IQuestionnaireItemType.group,
    text: partial?.text,
    readOnly: partial?.readOnly,
    initial: partial?.initial,
    item: partial?.item,
    code: partial?.code,
    extension: partial?.extension,
  }) as QuestionnaireItem;

const makeState = (over?: Partial<any>) =>
  ({
    qOrder: over?.qOrder ?? [],
    qItems: over?.qItems ?? {},
  }) as any;

// -----------------------------------------------------------------------------
// Baseline for ALLE mocks før hver test
// -----------------------------------------------------------------------------
beforeEach(() => {
  // Viktig: reset implementasjoner, ikke bare kallhistorikk
  vi.resetAllMocks();

  // Konsekvent baseline: ingen kontroller aktiv, ingen feil, alt "grønt"
  vi.mocked(isTableType).mockReturnValue(false);
  vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(false);
  vi.mocked(existItemControlWithCode).mockReturnValue(false);
  vi.mocked(checkAllDecendantsForCorrectTypes).mockReturnValue([]);
  vi.mocked(isDataReceiver).mockReturnValue(true);
  vi.mocked(getAllOrderItemChildrenOfItem).mockReturnValue([]);
  vi.mocked(doesAllItemsHaveSameAnswerValueSet).mockReturnValue(true);
});

// -----------------------------------------------------------------------------
// TESTER
// -----------------------------------------------------------------------------
describe("validateTable", () => {
  it("returnerer [] når ingen av tre sjekker trigges (ikke tableType, ikke tableExtension, ikke existItemControl)", () => {
    const qItem = makeItem({
      type: IQuestionnaireItemType.group,
      item: [{ linkId: "c1" } as any],
    });
    const state = makeState();

    expect(validateTable(t, qItem, state)).toEqual([]);
    expect(isDataReceiver).not.toHaveBeenCalled(); // baseline is true, men funksjonen trigges ikke
    expect(checkAllDecendantsForCorrectTypes).not.toHaveBeenCalled();
    expect(doesAllItemsHaveSameAnswerValueSet).not.toHaveBeenCalled();
  });

  it("gir feil når tableType=true og barn mangler både initial og dataReceiver", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isDataReceiver).mockReturnValue(false);

    const qItem = makeItem({
      linkId: "tbl-a",
      item: [{ linkId: "row-1", type: IQuestionnaireItemType.string } as any],
    });

    const errors = validateTable(t, qItem, makeState());
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "tbl-a",
      errorProperty: ValidationType.table,
      errorReadableText:
        "Table options must have an initial value or be a data receiver",
      errorLevel: ErrorLevel.error,
    });
  });

  it("propagerer feil fra checkAllDecendantsForCorrectTypes for hvert barn", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isDataReceiver).mockReturnValue(true);
    vi.mocked(checkAllDecendantsForCorrectTypes).mockReturnValue([
      {
        linkId: "desc-1",
        errorProperty: ValidationType.table,
        errorReadableText: "bad-1",
        errorLevel: ErrorLevel.error,
      } as any,
      {
        linkId: "desc-2",
        errorProperty: ValidationType.table,
        errorReadableText: "bad-2",
        errorLevel: ErrorLevel.error,
      } as any,
    ]);

    const qItem = makeItem({
      linkId: "tbl-b",
      item: [
        { linkId: "row-1", type: IQuestionnaireItemType.string } as any,
        { linkId: "row-2", type: IQuestionnaireItemType.string } as any,
      ],
    });

    const errors = validateTable(t, qItem, makeState());
    expect(errors).toHaveLength(4);
    expect(checkAllDecendantsForCorrectTypes).toHaveBeenCalledTimes(2);
  });

  it("gir feil hvis isTableExtension=true og minst ett barn ikke er choice/openChoice", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "tbl-type",
      item: [
        { linkId: "ok-1", type: IQuestionnaireItemType.choice } as any,
        { linkId: "bad", type: IQuestionnaireItemType.string } as any,
      ],
    });

    const errors = validateTable(t, qItem, makeState());
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "tbl-type",
      errorReadableText: "Table must only contain choice or openChoice items",
    });
  });

  it("returnerer [] hvis isTableExtension=true og alle barn er choice/openChoice", () => {
    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);

    const qItem = makeItem({
      linkId: "tbl-type-ok",
      item: [
        { linkId: "ok-1", type: IQuestionnaireItemType.choice } as any,
        { linkId: "ok-2", type: IQuestionnaireItemType.openChoice } as any,
      ],
    });

    expect(validateTable(t, qItem, makeState())).toEqual([]);
  });

  it("gir feil når existItemControlWithCode(table)=true men tabellen har 0 barn", () => {
    vi.mocked(existItemControlWithCode).mockReturnValue(true);

    const qItem = makeItem({ linkId: "tbl-empty", item: [] });

    const errors = validateTable(t, qItem, makeState());
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "tbl-empty",
      errorReadableText: "Table with answer options has no children",
    });
  });

  it("gir feil når answerValueSet ikke er like for alle (existItemControlWithCode=true, har barn)", () => {
    vi.mocked(existItemControlWithCode).mockReturnValue(true);
    vi.mocked(doesAllItemsHaveSameAnswerValueSet).mockReturnValue(false);
    vi.mocked(getAllOrderItemChildrenOfItem).mockReturnValue([
      { id: "x" },
    ] as any);

    const qItem = makeItem({
      linkId: "tbl-ans",
      item: [{ linkId: "row-1", type: IQuestionnaireItemType.choice } as any],
    });

    const state = makeState({ qOrder: [{ id: "x" }], qItems: { "row-1": {} } });
    const errors = validateTable(t, qItem, state);

    expect(getAllOrderItemChildrenOfItem).toHaveBeenCalledWith(
      state.qOrder,
      qItem.linkId,
    );
    expect(doesAllItemsHaveSameAnswerValueSet).toHaveBeenCalled();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      linkId: "tbl-ans",
      errorReadableText:
        "All answerValueSet values within a group with coding 'table' must be equal",
    });
  });

  it("returnerer [] når answerValueSet er like for alle", () => {
    vi.mocked(existItemControlWithCode).mockReturnValue(true);
    vi.mocked(doesAllItemsHaveSameAnswerValueSet).mockReturnValue(true);
    vi.mocked(getAllOrderItemChildrenOfItem).mockReturnValue([
      { id: "x" },
    ] as any);

    const qItem = makeItem({
      linkId: "tbl-ans-ok",
      item: [{ linkId: "row-1", type: IQuestionnaireItemType.choice } as any],
    });

    const state = makeState({ qOrder: [{ id: "x" }], qItems: { "row-1": {} } });
    expect(validateTable(t, qItem, state)).toEqual([]);
  });

  it("aggregerer feil fra alle tre sjekker samtidig", () => {
    vi.mocked(isTableType).mockReturnValue(true);
    vi.mocked(isDataReceiver).mockReturnValue(false);
    vi.mocked(checkAllDecendantsForCorrectTypes).mockReturnValue([
      {
        linkId: "desc-err",
        errorProperty: ValidationType.table,
        errorReadableText: "desc",
        errorLevel: ErrorLevel.error,
      } as any,
    ]);

    vi.mocked(oneOrMoreItemControlsExistOnItem).mockReturnValue(true);

    vi.mocked(existItemControlWithCode).mockReturnValue(true);
    vi.mocked(doesAllItemsHaveSameAnswerValueSet).mockReturnValue(false);
    vi.mocked(getAllOrderItemChildrenOfItem).mockReturnValue([
      { id: "x" },
    ] as any);

    const qItem = makeItem({
      linkId: "tbl-agg",
      item: [{ linkId: "row-1", type: IQuestionnaireItemType.string } as any],
    });

    const errors = validateTable(t, qItem, makeState());
    expect(errors).toHaveLength(4);

    const messages = errors.map((e) => e.errorReadableText).join(" | ");
    expect(messages).toContain("initial value or be a data receiver");
    expect(messages).toContain(
      "Table must only contain choice or openChoice items",
    );
    expect(messages).toContain("must be equal");
    expect(messages).toContain("desc");
  });
});
