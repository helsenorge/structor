import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { doesItemHaveStepCoding } from "src/utils/itemSearchUtils";

import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import { ValidationError } from "../../../utils/validationUtils";
import { createError } from "../validationHelper";

export const validateGroup = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const repeatableGroupValidation = validateRepeatableGroup(t, qItem);

  return repeatableGroupValidation;
};

export const validateRepeatableGroup = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.type === IQuestionnaireItemType.group && qItem.repeats) {
    const hasStepCoding = doesItemHaveStepCoding(qItem);

    if (hasStepCoding) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "system",
          t("Repeatable group cannot be displayed as a step in stepview"),
        ),
      );
    }
  }
  return returnErrors;
};
