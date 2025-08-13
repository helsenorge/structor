import { QuestionnaireItem } from "fhir/r4";
import { ErrorLevel } from "../../validationTypes";
import {
  validateGroupParent,
  validateRepeatableGroup,
} from "../groupValidation";
import { Items, OrderItem } from "src/store/treeStore/treeStore";

describe("group validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("repeatable group", () => {
    it("Should get error if repeatable group is child of a group", () => {
      const validationErrors = validateGroupParent(
        translatationMock,
        repeatableGroup,
        qItems,
        qOrder,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Repeatable group must be child of a group",
      ]);
    });
    it("Should get error if repeatable group has step coding", () => {
      const validationErrors = validateRepeatableGroup(
        translatationMock,
        repeatableGroupWithStepCoding,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Repeatable group cannot be displayed as a step in stepview",
      ]);
    });
  });
});

//Constants for repeatable group without a parent group
const repeatableGroup: QuestionnaireItem = {
  linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
  type: "group",
  text: "Repeatable group",
  code: [],
  item: [],
  required: false,
  repeats: true,
};
const qItems: Items = {
  "4d86e6d0-51c8-477e-a74e-8e0a4d253fce": {
    linkId: "4d86e6d0-51c8-477e-a74e-8e0a4d253fce",
    type: "group",
    text: "group",
    extension: [],
    code: [],
    item: [],
    required: false,
  },
  "a8e762a7-5754-4056-900b-6c1196d73175": repeatableGroup,
};
const qOrder: OrderItem[] = [
  {
    linkId: "4d86e6d0-51c8-477e-a74e-8e0a4d253fce",
    items: [],
  },
  {
    linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
    items: [],
  },
];

//Constants for repeatale group with step coding
const repeatableGroupWithStepCoding: QuestionnaireItem = {
  linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
  type: "group",
  text: "Repeatable group with step coding",
  extension: [
    {
      url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
      valueCodeableConcept: {
        coding: [
          {
            system: "http://hl7.org/fhir/ValueSet/questionnaire-item-control",
            code: "step",
          },
        ],
      },
    },
  ],
  required: false,
  repeats: true,
};
