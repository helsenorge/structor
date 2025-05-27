import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { OrderItem } from "src/store/treeStore/treeStore";
import { doesItemHaveChildren } from "src/utils/itemSearchUtils";

import { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";

import { ValidationError } from "../../../utils/validationUtils";
import { createError } from "../validationHelper";

export const validateRepeatableItems = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): ValidationError[] => {
  const repeatableChildrenValidation = validateRepeatableChildren(
    t,
    qItem,
    qOrder,
  );

  return repeatableChildrenValidation;
};

export const validateRepeatableChildren = (
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
