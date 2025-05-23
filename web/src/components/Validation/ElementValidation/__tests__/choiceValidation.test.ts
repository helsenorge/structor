import { QuestionnaireItem } from "fhir/r4";

import { ErrorLevel } from "../../validationTypes";
import { validateChoice } from "../orphanValidation";

describe("choice validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("choice answerOption display and code", () => {
    it("Should get errors if answerOption has no display and no code", () => {
      const validationErrors = validateChoice(
        translatationMock,
        noDisplayAndCode,
      );

      expect(validationErrors.length).toBe(2);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(validationErrors[1].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Answer option has no code",
      ]);
      expect(translatationMock.mock.calls[1]).toEqual([
        "Answer option has no display value",
      ]);
    });
    it("Should NOT get errors if answerOption has a display value and a code", () => {
      const validationErrors = validateChoice(
        translatationMock,
        withDisplayAndCode,
      );

      expect(validationErrors.length).toBe(0);
    });
  });
});

const noDisplayAndCode: QuestionnaireItem = {
  linkId: "dab2891c-9443-4995-8bde-13479baeb371",
  type: "choice",
  text: "Alternativer",
  required: false,
  answerOption: [
    {
      valueCoding: {
        id: "f6b90864-5127-42bc-9a58-b02ed40ec3ee",
        system: "urn:uuid:eaf13f07-7636-4ffa-9eab-d18b3b7f3060",
      },
    },
  ],
};

const withDisplayAndCode: QuestionnaireItem = {
  linkId: "dab2891c-9443-4995-8bde-13479baeb371",
  type: "choice",
  text: "Alternativer",
  required: false,
  answerOption: [
    {
      valueCoding: {
        id: "f6b90864-5127-42bc-9a58-b02ed40ec3ee",
        system: "urn:uuid:eaf13f07-7636-4ffa-9eab-d18b3b7f3060",
        code: "valg-1",
        display: "Valg 1",
      },
    },
  ],
};
