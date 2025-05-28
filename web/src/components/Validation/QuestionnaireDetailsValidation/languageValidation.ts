import { Bundle, Questionnaire } from "fhir/r4";
import { TFunction } from "react-i18next";
import { ValidationError } from "src/utils/validationUtils";

import Languages from "@helsenorge/core-utils/constants/languages";

import { createError } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";

type LanguageCode = Languages | (string & {});

const isBundle = (
  questionnaire: Questionnaire | Bundle,
): questionnaire is Bundle => questionnaire.resourceType === "Bundle";

export const validateLanguageCodeIsSupported = (
  t: TFunction<"translation">,
  questionnaire: Questionnaire | Bundle,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const supportedLanguageCodes: LanguageCode[] = [
    Languages.ENGLISH,
    Languages.NORWEGIAN,
    Languages.SAMI_NORTHERN,
    Languages.NORWEGIAN_NYNORSK,
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
