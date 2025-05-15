import { Extension, QuestionnaireItem } from "fhir/r4";
import { ItemControlType } from "src/helpers/itemControl";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { ErrorLevel, ValidationType } from "../../validationTypes";
import { validateSidebar } from "../sidebarValidation";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";

const qOrder = [{ linkId: "1", items: [] }] as OrderItem[];
const metadata = {
  id: "1",
  name: "Test",
  title: "Test",
  url: "Questionnaire/1",
} as IQuestionnaireMetadata;

describe("Sidebar Validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  it("Sidebar validates ok", () => {
    const sotItem = {
      linkId: "1",
      type: "string",
      _text: {
        extension: [
          { url: IExtensionType.markdown, valueMarkdown: "Hello World" },
        ],
      },
      extension: [
        {
          url: IExtensionType.itemControl,
          valueCodeableConcept: {
            coding: [
              {
                code: ItemControlType.sidebar,
                system: IValueSetSystem.itemControlValueSet,
              },
            ],
          },
        },
      ] as Extension[],
      code: [{ code: "SOT-1", system: IValueSetSystem.sotHeader }],
    } as QuestionnaireItem;

    const treeState = {
      qMetadata: metadata,
      qOrder: qOrder,
      qItems: { "1": sotItem } as Items,
    } as TreeState;

    const validationErrors = validateSidebar(translatationMock, treeState);

    expect(validationErrors.length).toBe(0);
  });

  it("SOT does not have text", () => {
    const sotItem = {
      linkId: "1",
      type: "string",
      extension: [
        {
          url: IExtensionType.itemControl,
          valueCodeableConcept: {
            coding: [
              {
                code: ItemControlType.sidebar,
                system: IValueSetSystem.itemControlValueSet,
              },
            ],
          },
        },
      ] as Extension[],
      code: [{ code: "SOT-1", system: IValueSetSystem.sotHeader }],
    } as QuestionnaireItem;

    const treeState = {
      qMetadata: metadata,
      qOrder: qOrder,
      qItems: { "1": sotItem } as Items,
    } as TreeState;

    const validationErrors = validateSidebar(translatationMock, treeState);

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorProperty).toBe(ValidationType.sidebar);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "SOT does not have a text",
    ]);
  });
});
