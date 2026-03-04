import { ExtendedLanguageLocales } from "src/types/LanguageTypes";

import type { Bundle, Questionnaire } from "fhir/r4";
import type { TFunction } from "i18next";
import type { ValidationError } from "src/utils/validationUtils";

import { createError } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";

type LanguageCode = ExtendedLanguageLocales | (string & {});

const isBundle = (
  questionnaire: Questionnaire | Bundle,
): questionnaire is Bundle => questionnaire.resourceType === "Bundle";

export const validateLanguageCodeIsSupported = (
  t: TFunction<"translation">,
  questionnaire: Questionnaire | Bundle,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const supportedLanguageCodes: LanguageCode[] = [
    ExtendedLanguageLocales.ENGLISH,
    ExtendedLanguageLocales.NORWEGIAN,
    ExtendedLanguageLocales.SAMI_NORTHERN,
    ExtendedLanguageLocales.NORWEGIAN_NYNORSK,
    ExtendedLanguageLocales.ROMANIAN,
    ExtendedLanguageLocales.LITHUANIAN,
    ExtendedLanguageLocales.RUSSIAN,
    ExtendedLanguageLocales.FRENCH,
    ExtendedLanguageLocales.POLISH,
  ];
  const languageCodes: LanguageCode[] =
    (isBundle(questionnaire)
      ? questionnaire.entry?.map((entry) => entry.resource?.language)
      : [questionnaire.language]
    )?.filter((x) => x !== undefined) || [];

  if (!languageCodes?.every((code) => supportedLanguageCodes.includes(code))) {
    errors.push(
      createError(
        "No link-id",
        t("Language"),
        t("Unsupported language in definition"),
        ErrorLevel.warning,
      ),
    );
  }
  return errors;
};

export const validateLanguageCodeIsValid = (
  t: TFunction<"translation">,
  questionnaire: Questionnaire | Bundle,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (isBundle(questionnaire)) {
    questionnaire?.entry?.forEach((element) => {
      if (!element.resource?.language) {
        errors.push(
          createError(
            "",
            t("Language"),
            t("All questionnaires does not have a language code"),
            ErrorLevel.error,
          ),
        );
      }
    });
  } else {
    if (!questionnaire.language) {
      errors.push(
        createError(
          "",
          t("Language"),
          t("Questionnaire does not have a language code"),
          ErrorLevel.error,
        ),
      );
    }
  }
  return errors;
};

export const validateLanguage = (
  t: TFunction<"translation">,
  questionnaire: Questionnaire | Bundle,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  errors.push(...validateLanguageCodeIsValid(t, questionnaire));
  errors.push(...validateLanguageCodeIsSupported(t, questionnaire));
  return errors;
};
