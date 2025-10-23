import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { hasExtension } from "src/helpers/extensionHelper";

import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import { ValidationError } from "../../../utils/validationUtils";
import { createError } from "../validationHelper";

export const validateChoice = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const answerOptionsValidation = validateAnswerOptions(t, qItem);
  const answerOptionsSystemValdiation = validateAnswerOptionsSystem(t, qItem);

  return answerOptionsValidation.concat(answerOptionsSystemValdiation);
};

export const validateAnswerOptions = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];

  if (
    qItem.type === IQuestionnaireItemType.choice ||
    qItem.type === IQuestionnaireItemType.openChoice
  ) {
    const extension = hasExtension(qItem, IExtensionType.copyExpression);
    if (extension) {
      return returnErrors;
    }
    qItem.answerOption?.forEach((answerOption) => {
      if (!answerOption.valueCoding?.code) {
        returnErrors.push(
          createError(qItem.linkId, "code", t("Answer option has no code")),
        );
      }
      if (!answerOption.valueCoding?.display) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "display",
            t("Answer option has no display value"),
          ),
        );
      }
    });
  }
  return returnErrors;
};

export const validateAnswerOptionsSystem = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (
    qItem.type === IQuestionnaireItemType.choice ||
    qItem.type === IQuestionnaireItemType.openChoice
  ) {
    const systems = qItem.answerOption?.map(
      (answerOption) => answerOption.valueCoding?.system,
    );

    if (systems?.length) {
      const firstSystem = systems[0];

      for (let i = 1; i < systems.length; i++) {
        if (systems[i] !== firstSystem) {
          returnErrors.push(
            createError(
              qItem.linkId,
              "system",
              t("System must have the same value in all answer options"),
            ),
          );
          return returnErrors;
        }
      }
    }
  }
  return returnErrors;
};
