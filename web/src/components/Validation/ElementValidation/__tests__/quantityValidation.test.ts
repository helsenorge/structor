import { QuestionnaireItem } from "fhir/r4";
import { ErrorLevel } from "../../validationTypes";
import { validateQuantityInitialValue } from "../quantityValidation";

const quantityInitialValueQuantity: QuestionnaireItem = {
  linkId: "dab2891c-9443-4995-8bde-13479baeb371",
  type: "quantity",
  text: "kvantitet",
  required: false,
  initial: [
    {
      valueQuantity: {
        unit: "centimeter",
        code: "cm",
        system: "http://unitsofmeasure.org",
        value: 47,
      },
    },
  ],
  extension: [
    {
      url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
      valueCoding: {
        code: "cm",
        display: "centimeter",
        system: "http://unitsofmeasure.org",
      },
    },
  ],
};

const quantityInitialValueNotQuantity: QuestionnaireItem = {
  linkId: "dab2891c-9443-4995-8bde-13479baeb371",
  type: "quantity",
  text: "kvantitet",
  required: false,
  initial: [
    {
      valueDecimal: 47,
    },
  ],
  extension: [
    {
      url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
      valueCoding: {
        code: "cm",
        display: "centimeter",
        system: "http://unitsofmeasure.org",
      },
    },
  ],
};

describe("quantity validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("quantity initial value", () => {
    it("Should get error if initial value is not valueQuantity", () => {
      const validationErrors = validateQuantityInitialValue(
        translatationMock,
        quantityInitialValueNotQuantity,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "quantity initial value is not valueQuantity",
      ]);
    });
    it("Should NOT get error if initial value is valueQuantity", () => {
      const validationErrors = validateQuantityInitialValue(
        translatationMock,
        quantityInitialValueQuantity,
      );

      expect(validationErrors.length).toBe(0);
    });
  });
});
