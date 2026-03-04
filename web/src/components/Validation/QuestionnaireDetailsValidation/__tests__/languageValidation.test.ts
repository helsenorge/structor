import type { TFunction } from "i18next";

import {
  validateLanguageCodeIsSupported,
  validateLanguageCodeIsValid,
} from "../languageValidation";
import { q2, q3, q4, q6 } from "./data";

describe("Language validation", () => {
  describe("validateLanguageCodeIsValid", () => {
    const translatationMock = vi.fn();
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should return an error if the language code does not excist - bundle", () => {
      const errors = validateLanguageCodeIsValid(
        translatationMock as unknown as TFunction<"translation">,
        q3,
      );
      expect(errors.length).toBe(1);
      expect(translatationMock.mock.calls[1]).toEqual([
        "All questionnaires does not have a language code",
      ]);
    });
    it("should return an error if the language code does not excist - questionnaire", () => {
      const errors = validateLanguageCodeIsValid(
        translatationMock as unknown as TFunction<"translation">,
        q4,
      );
      expect(errors.length).toBe(1);
      expect(translatationMock.mock.calls[1]).toEqual([
        "Questionnaire does not have a language code",
      ]);
    });
  });
  describe("validateLanguageCodeIsSupported", () => {
    const translatationMock = vi.fn();
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should return a warning if the language codes is not supported", () => {
      const errors = validateLanguageCodeIsSupported(
        translatationMock as unknown as TFunction<"translation">,
        q6,
      );
      expect(errors.length).toBe(1);
      expect(translatationMock.mock.calls[1]).toEqual([
        "Unsupported language in definition",
      ]);
    });
    it("should return no warning if the language codes is supported", () => {
      const errors = validateLanguageCodeIsSupported(
        translatationMock as unknown as TFunction<"translation">,
        q2,
      );
      expect(errors.length).toBe(0);
    });
  });
});
