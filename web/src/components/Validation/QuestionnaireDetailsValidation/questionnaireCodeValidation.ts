import { TFunction } from "react-i18next";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import { ValidationError } from "src/utils/validationUtils";

import { createError } from "../validationHelper";
import { ErrorLevel, ValidationType } from "../validationTypes";

export const validateQuestionnaireCode = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  if (qMetadata?.code && qMetadata.code.length > 0) {
    const errors = qMetadata.code
      .map((code, index) => {
        if (!code.code || !code.display || !code.system) {
          return createError(
            "",
            ValidationType.questionnaireCode,
            t("Invalid code on questionnaire"),
            ErrorLevel.error,
            index,
          );
        }
      })
      .filter((x) => x !== undefined);
    return errors.length > 0 ? errors : [];
  }
  return [];
};
