import {
  MetadataTranslations,
  Translation,
} from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";
import { ErrorLevel } from "../../validationTypes";
import { TranslatableMetadataProperty } from "src/types/LanguageTypes";
import { validateMetadataTranslation } from "../translateMetadataValidation";

describe("metadataValidation", () => {
  const translatationMock = vi.fn();
  let validationErrors: ValidationError[] = [];

  beforeEach(() => {
    translatationMock.mockClear();
    validationErrors = [];
  });

  describe("Title Validation", () => {
    it("when does not given", () => {
      const metadata = {
        id: "1",
        name: "Test",
        url: "Questionnaire/1",
      } as MetadataTranslations;
      const translation = { metaData: metadata } as Translation;

      validateMetadataTranslation(
        translatationMock,
        "en-GB",
        translation,
        validationErrors,
      );
      const titleError = validationErrors.filter(
        (f: ValidationError) =>
          f.errorProperty === TranslatableMetadataProperty.title,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls).toEqual([
        ["Translation not found for title"],
      ]);
    });

    it("when used forbidden characters", () => {
      const metadata = {
        id: "1",
        name: "Test",
        url: "Questionnaire/1",
        title: "<Test>",
      } as MetadataTranslations;
      const translation = { metaData: metadata } as Translation;

      validateMetadataTranslation(
        translatationMock,
        "en-GB",
        translation,
        validationErrors,
      );
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === TranslatableMetadataProperty.title,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls).toEqual([
        ["Title cannot have any special characters []{}/\\<>`´;:|\"'$£#@%*¤"],
      ]);
    });
  });

  describe("Url Validation", () => {
    it("when does not given", () => {
      const metadata = {
        id: "1",
        title: "Test",
        name: "Test",
      } as MetadataTranslations;
      const translation = { metaData: metadata } as Translation;

      validateMetadataTranslation(
        translatationMock,
        "en-GB",
        translation,
        validationErrors,
      );
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === TranslatableMetadataProperty.url,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.warning);
      expect(translatationMock.mock.calls).toEqual([
        [
          "Form does not have an Url, In case of Helsenorge this field must be 'Questionnaire/<Id>'",
        ],
      ]);
    });

    it("when url given but not starting with Questionnaire/", () => {
      const metadata = {
        id: "1",
        title: "Test",
        name: "Test",
        url: "Test",
      } as MetadataTranslations;
      const translation = { metaData: metadata } as Translation;

      validateMetadataTranslation(
        translatationMock,
        "en-GB",
        translation,
        validationErrors,
      );
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === TranslatableMetadataProperty.url,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.warning);
      expect(translatationMock.mock.calls).toEqual([
        ["In case of Helsenorge this field must be 'Questionnaire/<Id>'"],
      ]);
    });

    it("when url given but not starting with Questionnaire/", () => {
      const metadata = {
        id: "1",
        title: "Test",
        name: "Test",
        url: "Questionnaire/104",
      } as MetadataTranslations;
      const translation = { metaData: metadata } as Translation;

      validateMetadataTranslation(
        translatationMock,
        "en-GB",
        translation,
        validationErrors,
      );
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === TranslatableMetadataProperty.url,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls).toEqual([
        ["Url must be 'Questionnaire/<Id>'"],
      ]);
    });
  });
});
