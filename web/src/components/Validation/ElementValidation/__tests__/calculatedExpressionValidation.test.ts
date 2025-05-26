import { Extension, QuestionnaireItem } from "fhir/r4";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { ErrorLevel, ValidationType } from "../../validationTypes";
import { validateCalulatedExpressionElements } from "../calculatedExpressionValidation";

const calulatedExtention = (valueString: string): Extension[] => {
  return [
    {
      url: IExtensionType.calculatedExpression,
      valueString: valueString,
    },
  ] as Extension[];
};
let item = {} as QuestionnaireItem;
let calculatedItem = {} as QuestionnaireItem;

const qOrder = [
  { linkId: "1", items: [] },
  { linkId: "2", items: [] },
] as OrderItem[];

describe("Calculated expression Validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
    item = {
      linkId: "1",
      type: "decimal",
      text: "Hight",
    } as QuestionnaireItem;
    calculatedItem = {
      linkId: "2",
      type: "decimal",
      text: "Calculated",
      readOnly: true,
      extension: calulatedExtention(
        "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
      ),
    } as QuestionnaireItem;
  });

  test.each([
    IQuestionnaireItemType.decimal,
    IQuestionnaireItemType.integer,
    IQuestionnaireItemType.quantity,
  ])(`Calculated expression validaiton ok %p`, (type) => {
    const calculated = {
      linkId: "2",
      type: type,
      extension: calulatedExtention(
        "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
      ),
    } as QuestionnaireItem;

    const treeState = {
      qOrder: qOrder,
      qItems: { "1": item, "2": calculated } as Items,
    } as TreeState;

    const validationErrors = validateCalulatedExpressionElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(0);
  });

  it("linkIds in calculated expression does not exist", () => {
    translatationMock.mockReturnValue(
      "Calculation expression does not have an earlier question with LinkId '{0}'",
    );
    calculatedItem.extension = calulatedExtention(
      "QuestionnaireResponse.descendants().where(linkId='Vekt').answer.value.value / ((QuestionnaireResponse.descendants().where(linkId='Hoyde').answer.value.value/10000) * QuestionnaireResponse.descendants().where(linkId='Hoyde').answer.value.value)",
    );
    const treeState = {
      qOrder: qOrder,
      qItems: { "1": item, "2": calculatedItem } as Items,
    } as TreeState;

    const validationErrors = validateCalulatedExpressionElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(2);

    expect(validationErrors[0].errorProperty).toBe(ValidationType.calculation);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(validationErrors[0].errorReadableText).toEqual(
      "Calculation expression does not have an earlier question with LinkId 'Vekt'",
    );

    expect(validationErrors[1].errorProperty).toBe(ValidationType.calculation);
    expect(validationErrors[1].errorLevel).toBe(ErrorLevel.error);
    expect(validationErrors[1].errorReadableText).toEqual(
      "Calculation expression does not have an earlier question with LinkId 'Hoyde'",
    );
  });

  it("Calculation expression has validation with min value", () => {
    calculatedItem.extension?.push({
      url: IExtensionType.minValue,
      valueInteger: 2,
    } as Extension);

    const treeState = {
      qOrder: qOrder,
      qItems: { "1": item, "2": calculatedItem } as Items,
    } as TreeState;

    const validationErrors = validateCalulatedExpressionElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(
      ValidationType.validationValue,
    );
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "MinValue and/or maxValue can not be set on calculated expressions",
    ]);
  });

  it("Calculation expression has validation with max value", () => {
    calculatedItem.extension?.push({
      url: IExtensionType.maxValue,
      valueInteger: 4,
    } as Extension);

    const treeState = {
      qOrder: qOrder,
      qItems: { "1": item, "2": calculatedItem } as Items,
    } as TreeState;

    const validationErrors = validateCalulatedExpressionElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(
      ValidationType.validationValue,
    );
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "MinValue and/or maxValue can not be set on calculated expressions",
    ]);
  });

  test.each([
    IQuestionnaireItemType.string,
    IQuestionnaireItemType.text,
    IQuestionnaireItemType.choice,
    IQuestionnaireItemType.openChoice,
    IQuestionnaireItemType.dateTime,
    IQuestionnaireItemType.date,
    IQuestionnaireItemType.boolean,
    IQuestionnaireItemType.group,
  ])(`Calculated expression must cannot be %p`, (type) => {
    const calculated = {
      linkId: "2",
      type: type,
      extension: calulatedExtention(
        "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
      ),
    } as QuestionnaireItem;

    const treeState = {
      qOrder: qOrder,
      qItems: { "1": item, "2": calculated } as Items,
    } as TreeState;

    const validationErrors = validateCalulatedExpressionElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(ValidationType.calculation);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "Calculated expression can only be in quantity or number items",
    ]);
  });
});
