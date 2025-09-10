import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { existAllCalculatedExpressionLinkIds } from "src/helpers/calculatedExpressionHelper";
import { findExtensionByUrl } from "src/helpers/extensionHelper";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { getDuplicateLinkIds } from "src/utils/traversionUtils";
import { ValidationError } from "src/utils/validationUtils";

import { createError } from "../validationHelper";
import { ErrorLevel, ValidationType } from "../validationTypes";

export const validateCalulatedExpressionElements = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  state.qOrder.forEach((item) =>
    validate(t, item, state.qItems, state.qOrder, errors),
  );

  return errors;
};

const validate = (
  t: TFunction<"translation">,
  currentItem: OrderItem,
  qItems: Items,
  qOrder: OrderItem[],
  errors: ValidationError[],
): void => {
  const qItem = qItems[currentItem.linkId];

  if (
    findExtensionByUrl(qItem.extension, IExtensionType.calculatedExpression)
  ) {
    errors.push(...validateMaxMin(t, qItem));
    errors.push(...validateLinkIds(t, qItem, qOrder));
    errors.push(...validateItemType(t, qItem));
    errors.push(...validateAllLinkIdsInQuestionnaireIsUnique(t, qOrder));
  }
  currentItem.items.forEach((item) =>
    validate(t, item, qItems, qOrder, errors),
  );
};

const validateMaxMin = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const hasMinValue = !!findExtensionByUrl(
    qItem.extension,
    IExtensionType.minValue,
  );
  const hasMaxValue = !!findExtensionByUrl(
    qItem.extension,
    IExtensionType.maxValue,
  );
  const errors: ValidationError[] = [];

  if (hasMaxValue || hasMinValue) {
    errors.push(
      createError(
        qItem.linkId,
        ValidationType.validationValue,
        t("MinValue and/or maxValue can not be set on calculated expressions"),
      ),
    );
  }
  return errors;
};

const validateLinkIds = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  const notExistLinkIds = existAllCalculatedExpressionLinkIds(qItem, qOrder);
  if (notExistLinkIds.length > 0) {
    notExistLinkIds.forEach((linkId) => {
      returnErrors.push(
        createError(
          qItem.linkId,
          ValidationType.calculation,
          t(
            "Item with LinkId '{0}' does not exist in the form and is used in the calculated expression.",
          ).replace("{0}", linkId),
        ),
      );
    });
  }

  return returnErrors;
};

const validateItemType = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    qItem.type !== IQuestionnaireItemType.quantity &&
    qItem.type !== IQuestionnaireItemType.decimal &&
    qItem.type !== IQuestionnaireItemType.integer
  ) {
    errors.push(
      createError(
        qItem.linkId,
        ValidationType.calculation,
        t("Calculated expression can only be in quantity or number items"),
      ),
    );
  }
  return errors;
};
const validateAllLinkIdsInQuestionnaireIsUnique = (
  t: TFunction<"translation">,
  qOrder: OrderItem[],
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const duplicates = getDuplicateLinkIds(qOrder);
  duplicates.forEach((duplicate) => {
    errors.push(
      createError(
        duplicate,
        ValidationType.linkId,
        t("LinkId '{0}' is not unique").replace("{0}", duplicate),
        ErrorLevel.error,
      ),
    );
  });

  return errors;
};
