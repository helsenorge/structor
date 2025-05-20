import { QuestionnaireItem, ValueSet } from "fhir/r4";
import { TFunction } from "react-i18next";
import { isUriValid } from "src/helpers/uriHelper";

import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import { ValidationError } from "../../../utils/validationUtils";
import { createError } from "../validationHelper";

export const validateQuantityInitialValue = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.type === IQuestionnaireItemType.quantity) {
    if (qItem.initial) {
      const initialValueQuantity = qItem.initial[0].valueQuantity;
      if (!initialValueQuantity) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "system",
            t("quantity initial value is not valueQuantity"),
          ),
        );
      }
    }
  }
  return returnErrors;
};

export const validateQuantitySystemAndCode = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.type === IQuestionnaireItemType.quantity) {
    const unitExtension = (qItem.extension ?? []).find(
      (x) => x.url === IExtensionType.questionnaireUnit,
    );
    if (unitExtension && !unitExtension.valueCoding?.system) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "system",
          t("quantity extension does not have a system"),
        ),
      );
    }
    if (
      unitExtension &&
      unitExtension.valueCoding?.system &&
      !isUriValid(unitExtension.valueCoding?.system)
    ) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "system",
          t("quantity extension does not have a valid system"),
        ),
      );
    }
    if (unitExtension && !unitExtension.valueCoding?.code) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "code",
          t("quantity extension does not have code"),
        ),
      );
    }
  }
  return returnErrors;
};
