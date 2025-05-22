import { QuestionnaireItem } from "fhir/r4";
import { ErrorLevel } from "../../validationTypes";
import {
  validateQuantityInitialValue,
  validateQuantitySystemAndCode,
  validateQuantityDisplay,
} from "../quantityValidation";

describe("quantity validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("quantity initial value", () => {
    it("Should get error if initial value is not valueQuantity", () => {
      const validationErrors = validateQuantityInitialValue(
        translatationMock,
        initialValueNotQuantity,
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
        initialValueQuantity,
      );

      expect(validationErrors.length).toBe(0);
    });
  });

  describe("quantity system and code", () => {
    it("Should get errors if item extension has no system and no code", () => {
      const validationErrors = validateQuantitySystemAndCode(
        translatationMock,
        extensionWithNoSystemAndCode,
      );

      expect(validationErrors.length).toBe(2);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(validationErrors[1].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "quantity extension does not have a system",
      ]);
      expect(translatationMock.mock.calls[1]).toEqual([
        "quantity extension does not have code",
      ]);
    });
    it("Should NOT get error if item extension has a system and a code", () => {
      const validationErrors = validateQuantitySystemAndCode(
        translatationMock,
        extensionWithSystemAndCode,
      );

      expect(validationErrors.length).toBe(0);
    });
  });

  describe("quantity display", () => {
    it("Should get error if unit in initial value does not match display in unit extension", () => {
      const validationErrors = validateQuantityDisplay(
        translatationMock,
        unitDismatch,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Unit in initial value does not match display in unit extension",
      ]);
    });
    it("Should NOT get error if unit in initial value matches display in unit extension", () => {
      const validationErrors = validateQuantityDisplay(
        translatationMock,
        unitMatch,
      );

      expect(validationErrors.length).toBe(0);
    });
    it("Should get error if unit extension has no display value", () => {
      const validationErrors = validateQuantityDisplay(
        translatationMock,
        extensionWithNoDisplay,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "quantity unit extension has no display value",
      ]);
    });
  });
});

const initialValueQuantity: QuestionnaireItem = {
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

const initialValueNotQuantity: QuestionnaireItem = {
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

const unitMatch: QuestionnaireItem = {
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

const unitDismatch: QuestionnaireItem = {
  linkId: "dab2891c-9443-4995-8bde-13479baeb371",
  type: "quantity",
  text: "kvantitet",
  required: false,
  initial: [
    {
      valueQuantity: {
        unit: "centimeter XXX",
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
        display: "centimeter YYY",
        system: "http://unitsofmeasure.org",
      },
    },
  ],
};

const extensionWithSystemAndCode: QuestionnaireItem = {
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

const extensionWithNoSystemAndCode: QuestionnaireItem = {
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
        code: "",
        display: "centimeter",
        system: "",
      },
    },
  ],
};

const extensionWithNoDisplay: QuestionnaireItem = {
  linkId: "dab2891c-9443-4995-8bde-13479baeb371",
  type: "quantity",
  text: "kvantitet",
  required: false,
  extension: [
    {
      url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
      valueCoding: {
        code: "cm",
        display: "",
        system: "http://unitsofmeasure.org",
      },
    },
  ],
};
