import { QuestionnaireItem } from "fhir/r4";
import { ErrorLevel } from "../../validationTypes";
import { validateRepeatableGroup } from "../groupValidation";

describe("group validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("repeatable group", () => {
    it("Should get error if repeatable group has step coding", () => {
      const validationErrors = validateRepeatableGroup(
        translatationMock,
        repeatableItemWithStepCoding,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Repeatable group cannot be displayed as a step in stepview",
      ]);
    });
  });
});

const repeatableItemWithStepCoding: QuestionnaireItem = {
  linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
  type: "group",
  text: "Repeterende gruppe med step coding",
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
