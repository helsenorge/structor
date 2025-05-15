import {
  Extension,
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
} from "fhir/r4";
import { ItemControlType } from "src/helpers/itemControl";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { validateDataReceiverElements } from "../data-receiverValidation";
import { ErrorLevel, ValidationType } from "../../validationTypes";

const mainItem = {
  linkId: "1",
  type: "string",
  text: "Text",
} as QuestionnaireItem;
let copyItem = {} as QuestionnaireItem;

const qOrder = [
  { linkId: "1", items: [] },
  { linkId: "2", items: [] },
] as OrderItem[];

describe("data-receiver Validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
    copyItem = {
      linkId: "2",
      type: "string",
      text: "Copy",
      enableWhen: [
        { answerBoolean: true, operator: "exists", question: "1" },
      ] as QuestionnaireItemEnableWhen[],
      extension: [
        {
          url: IExtensionType.itemControl,
          valueCodeableConcept: {
            coding: [
              {
                code: ItemControlType.dataReceiver,
                system: IValueSetSystem.itemControlValueSet,
              },
            ],
          },
        },
        {
          url: IExtensionType.copyExpression,
          valueString:
            "QuestionnaireResponse.descendants().where(linkId='1').answer.value",
        },
      ] as Extension[],
    } as QuestionnaireItem;
  });

  it("data-receiver item validates ok", () => {
    const treeState = {
      qOrder: qOrder,
      qItems: { "1": mainItem, "2": copyItem } as Items,
    } as TreeState;

    const validationErrors = validateDataReceiverElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(0);
  });

  it("data-receiver item does not have extension", () => {
    const extensionWithoutExpression = copyItem.extension?.filter(
      (f) => f.url !== IExtensionType.copyExpression,
    );
    copyItem.extension = extensionWithoutExpression;
    const treeState = {
      qOrder: qOrder,
      qItems: { "1": mainItem, "2": copyItem } as Items,
    } as TreeState;

    const validationErrors = validateDataReceiverElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(ValidationType.dataReceiver);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "data receiver does not have an earlier question",
    ]);
  });

  it("data-receiver item does not point to an existing item", () => {
    const copyExpression = copyItem.extension?.filter(
      (f: Extension) => f.url === IExtensionType.copyExpression,
    );
    if (copyExpression && copyItem.extension) {
      copyExpression[0].valueString =
        "QuestionnaireResponse.descendants().where(linkId='101').answer.value";
      const extensions = [copyExpression[0], copyItem.extension[0]];
      copyItem.extension = extensions;
    }
    const treeState = {
      qOrder: qOrder,
      qItems: { "1": mainItem, "2": copyItem } as Items,
    } as TreeState;

    const validationErrors = validateDataReceiverElements(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(ValidationType.dataReceiver);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "data receiver does not have an earlier question",
    ]);
  });
});
