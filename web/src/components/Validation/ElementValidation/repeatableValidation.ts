import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { hasExtension } from "src/helpers/extensionHelper";
import { OrderItem } from "src/store/treeStore/treeStore";
import { doesItemHaveChildren } from "src/utils/itemSearchUtils";

import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import { ValidationError } from "../../../utils/validationUtils";
import { createError } from "../validationHelper";

export const validateRepeatableItems = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): ValidationError[] => {
  const repeatableItemChildrenValidation = validateRepeatableItemChildren(
    t,
    qItem,
    qOrder,
  );
  const repeatableItemMaxOccursValidation = validateRepeatableItemMaxOccurs(
    t,
    qItem,
  );

  return repeatableItemChildrenValidation.concat(
    repeatableItemMaxOccursValidation,
  );
};

export const validateRepeatableItemChildren = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.type !== IQuestionnaireItemType.group && qItem.repeats) {
    const hasChildren = doesItemHaveChildren(qItem.linkId, qOrder);
    if (hasChildren) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "item",
          t("Repeatable items that are not of type group cannot have children"),
        ),
      );
    }
  }
  return returnErrors;
};

export const validateRepeatableItemMaxOccurs = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.repeats) {
    const hasMaxOccursExtension = hasExtension(qItem, IExtensionType.maxOccurs);
    if (!hasMaxOccursExtension) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "item",
          t("Repeatable items must have a maxOccurs extension"),
        ),
      );
    }
  }
  return returnErrors;
};
