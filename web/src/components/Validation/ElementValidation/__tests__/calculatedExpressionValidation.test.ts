import { Extension, QuestionnaireItem } from "fhir/r4";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { ErrorLevel, ValidationType } from "../../validationTypes";
import { validateCalulatedExpressionElements } from "../calculatedExpressionValidation";
import { ValidationError } from "src/utils/validationUtils";

const calulatedExtention = (valueString: string): Extension[] => {
  return [
    {
      url: IExtensionType.calculatedExpression,
      valueString: valueString,
    },
  ];
};

let item = {} as QuestionnaireItem;
let calculatedItem = {} as QuestionnaireItem;

const baseOrder: OrderItem[] = [
  { linkId: "1", items: [] },
  { linkId: "2", items: [] },
];

const makeTreeState = (
  qOrder: OrderItem[] = baseOrder,
  qItems: Items,
): TreeState =>
  ({
    qOrder,
    qItems,
  }) as TreeState;

describe("Calculated expression Validation", () => {
  const translationMock = vi.fn();

  beforeEach(() => {
    translationMock.mockClear();
    item = {
      linkId: "1",
      type: "decimal",
      text: "Hight",
    } as QuestionnaireItem;

    calculatedItem = {
      linkId: "2",
      type: "decimal",
      text: "Calculated",
      readOnly: true, // important due to readOnlyValidation
      extension: calulatedExtention(
        "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
      ),
    } as QuestionnaireItem;
  });

  it("does not duplicate errors when the same missing linkId is referenced multiple times", () => {
    translationMock.mockReturnValue(
      "Item with LinkId '{0}' does not exist in the form and is used in the calculated expression.",
    );

    calculatedItem.extension = calulatedExtention(
      "QuestionnaireResponse.descendants().where(linkId='A').answer.value.value + QuestionnaireResponse.descendants().where(linkId='A').answer.value.value + QuestionnaireResponse.descendants().where(linkId=\"B\").answer.value.value",
    );

    const treeState = makeTreeState(baseOrder, {
      "1": item,
      "2": calculatedItem,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(2); // A and B, not 3
    expect(
      validationErrors.some(
        (x: ValidationError) =>
          x.errorReadableText ===
          "Item with LinkId 'A' does not exist in the form and is used in the calculated expression.",
      ),
    ).toBe(true);
    expect(
      validationErrors.some(
        (x: ValidationError) =>
          x.errorReadableText ===
          "Item with LinkId 'B' does not exist in the form and is used in the calculated expression.",
      ),
    ).toBe(true);
  });

  test.each([
    IQuestionnaireItemType.decimal,
    IQuestionnaireItemType.integer,
    IQuestionnaireItemType.quantity,
  ])(`Calculated expression validation OK for %p`, (type) => {
    const calculated = {
      linkId: "2",
      type,
      readOnly: true, // avoid readonly error
      extension: calulatedExtention(
        "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
      ),
    } as QuestionnaireItem;

    const treeState = makeTreeState(baseOrder, {
      "1": item,
      "2": calculated,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(0);
  });

  it("reports missing linkIds in calculated expression (new message and count)", () => {
    translationMock.mockReturnValue(
      "Item with LinkId '{0}' does not exist in the form and is used in the calculated expression.",
    );

    calculatedItem.extension = calulatedExtention(
      'QuestionnaireResponse.descendants().where(linkId=\'Vekt\').answer.value.value / ((QuestionnaireResponse.descendants().where(linkId="Hoyde").answer.value.value/10000) * QuestionnaireResponse.descendants().where(linkId="Hoyde").answer.value.value)',
    );

    const treeState = makeTreeState(baseOrder, {
      "1": item,
      "2": calculatedItem,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(2);

    expect(validationErrors[0].errorProperty).toBe(ValidationType.calculation);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(validationErrors[0].errorReadableText).toEqual(
      "Item with LinkId 'Vekt' does not exist in the form and is used in the calculated expression.",
    );

    expect(validationErrors[1].errorProperty).toBe(ValidationType.calculation);
    expect(validationErrors[1].errorLevel).toBe(ErrorLevel.error);
    expect(validationErrors[1].errorReadableText).toEqual(
      "Item with LinkId 'Hoyde' does not exist in the form and is used in the calculated expression.",
    );
  });

  it("supports nested qOrder: no error when linkId exists in children", () => {
    translationMock.mockReturnValue(
      "Item with LinkId '{0}' does not exist in the form and is used in the calculated expression.",
    );

    const nestedOrder: OrderItem[] = [
      {
        linkId: "1",
        items: [{ linkId: "child-1", items: [] }],
      },
      { linkId: "2", items: [] },
    ];

    const calcWithNestedRef: QuestionnaireItem = {
      linkId: "2",
      type: "decimal",
      text: "Calculated from child",
      readOnly: true,
      extension: calulatedExtention(
        "QuestionnaireResponse.descendants().where(linkId='child-1').answer.value.value / 10",
      ),
    };

    const treeState = makeTreeState(nestedOrder, {
      "1": { ...item, linkId: "1" },
      "child-1": {
        linkId: "child-1",
        type: "integer",
        text: "Nested value",
      } as QuestionnaireItem,
      "2": calcWithNestedRef,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(0);
  });

  it("Calculation expression has validation with min value", () => {
    calculatedItem.extension?.push({
      url: IExtensionType.minValue,
      valueInteger: 2,
    } as Extension);

    const treeState = makeTreeState(baseOrder, {
      "1": item,
      "2": calculatedItem,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(
      ValidationType.validationValue,
    );
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translationMock.mock.calls[0]).toEqual([
      "MinValue and/or maxValue can not be set on calculated expressions",
    ]);
  });

  it("Calculation expression has validation with max value", () => {
    calculatedItem.extension?.push({
      url: IExtensionType.maxValue,
      valueInteger: 4,
    } as Extension);

    const treeState = makeTreeState(baseOrder, {
      "1": item,
      "2": calculatedItem,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(
      ValidationType.validationValue,
    );
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translationMock.mock.calls[0]).toEqual([
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
  ])(`Calculated expression must not be %p`, (type) => {
    const calculated = {
      linkId: "2",
      type,
      readOnly: true, // avoid readonly error so the test only targets type rule
      extension: calulatedExtention(
        "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
      ),
    } as QuestionnaireItem;

    const treeState = makeTreeState(baseOrder, {
      "1": item,
      "2": calculated,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(ValidationType.calculation);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translationMock.mock.calls[0]).toEqual([
      "Calculated expression can only be in quantity or number items",
    ]);
  });

  it("parses both single and double quotes in the same expression", () => {
    translationMock.mockReturnValue(
      "Item with LinkId '{0}' does not exist in the form and is used in the calculated expression.",
    );

    calculatedItem.extension = calulatedExtention(
      "QuestionnaireResponse.descendants().where(linkId='X').answer.value.value + QuestionnaireResponse.descendants().where(linkId=\"Y\").answer.value.value",
    );

    const treeState = makeTreeState(baseOrder, {
      "1": item,
      "2": calculatedItem,
    });

    const validationErrors = validateCalulatedExpressionElements(
      translationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(2);
    expect(validationErrors[0].errorReadableText).toBe(
      "Item with LinkId 'X' does not exist in the form and is used in the calculated expression.",
    );
    expect(validationErrors[1].errorReadableText).toBe(
      "Item with LinkId 'Y' does not exist in the form and is used in the calculated expression.",
    );
  });
});
