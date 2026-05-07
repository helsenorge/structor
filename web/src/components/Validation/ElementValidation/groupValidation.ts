import {
  doesItemHaveStepCoding,
  isItemChildOfType,
  itemIsRootItem,
} from "src/utils/itemSearchUtils";

import { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";
import type { ValidationError } from "../../../utils/validationUtils";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "i18next";
import type { Items, OrderItem } from "src/store/treeStore/treeStore";

import { createError } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";

export const validateGroup = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qItems: Items,
  qOrder: OrderItem[],
): ValidationError[] => {
  const groupParentValdiation = validateGroupParent(t, qItem, qItems, qOrder);
  const repeatableGroupValidation = validateRepeatableGroup(t, qItem);
  const hasGroupAsParent = validatehasGroupAsParent(t, qItem, qItems, qOrder);
  return repeatableGroupValidation
    .concat(groupParentValdiation)
    .concat(hasGroupAsParent);
};

export const validatehasGroupAsParent = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qItems: Items,
  qOrder: OrderItem[],
): ValidationError[] => {
  const isItemChildOfGroup = isItemChildOfType(
    qItem.linkId,
    IQuestionnaireItemType.group,
    qItems,
    qOrder,
  );
  if (
    itemIsRootItem(qItem, qOrder) &&
    qItem.type === IQuestionnaireItemType.group
  ) {
    return [];
  }
  return isItemChildOfGroup
    ? []
    : [
        createError(
          qItem.linkId,
          "Questionnaire Item",
          t("Item must have a parent group"),
          ErrorLevel.warning,
        ),
      ];
};

export const validateGroupParent = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qItems: Items,
  qOrder: OrderItem[],
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.type === IQuestionnaireItemType.group && qItem.repeats) {
    const isitemChildOfGroup = isItemChildOfType(
      qItem.linkId,
      IQuestionnaireItemType.group,
      qItems,
      qOrder,
    );

    if (!isitemChildOfGroup) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "group",
          t("Repeatable group must be child of a group"),
        ),
      );
    }
  }
  return returnErrors;
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
          "group",
          t("Repeatable group cannot be displayed as a step in stepview"),
        ),
      );
    }
  }
  return returnErrors;
};
