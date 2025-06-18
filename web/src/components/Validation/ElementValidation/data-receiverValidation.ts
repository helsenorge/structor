import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { getLinkIdFromValueString } from "src/helpers/dataReceiverHelper";
import {
  getExtensionStringValue,
  hasExtension,
} from "src/helpers/extensionHelper";
import {
  existItemWithSystem,
  isItemControlDataReceiver,
} from "src/helpers/itemControl";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import { ICodeSystem, IExtensionType } from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { createError, existDataReceiverLinkId } from "../validationHelper";
import { ValidationType } from "../validationTypes";

export const validateDataReceiverElements = (
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

  if (isItemControlDataReceiver(qItem)) {
    errors.push(...validateDataReceiverExtension(t, qItem, qOrder));
    errors.push(...validateDataReceiverReadonly(t, qItem));
    errors.push(...validateDataReceiverMandatory(t, qItem));
    errors.push(...validateDataReceiverScoring(t, qItem));
    errors.push(...validateDataReceiverCalculatedExpression(t, qItem, qItems));
  }
  currentItem.items.forEach((item) =>
    validate(t, item, qItems, qOrder, errors),
  );
};

const validateDataReceiverExtension = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];

  if (
    !hasExtension(qItem, IExtensionType.copyExpression) ||
    !existDataReceiverLinkId(qItem, qOrder)
  ) {
    returnErrors.push(
      createError(
        qItem.linkId,
        ValidationType.dataReceiver,
        t("data receiver does not have an earlier question"),
      ),
    );
  }

  return returnErrors;
};

const validateDataReceiverReadonly = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];

  if (!qItem.readOnly) {
    returnErrors.push(
      createError(
        qItem.linkId,
        ValidationType.readonly,
        t("data receiver must be readonly"),
      ),
    );
  }

  return returnErrors;
};

const validateDataReceiverMandatory = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];

  if (qItem.required) {
    returnErrors.push(
      createError(
        qItem.linkId,
        ValidationType.mandatory,
        t("data receiver cannot be mandatory"),
      ),
    );
  }

  return returnErrors;
};

const validateDataReceiverScoring = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];

  if (
    existItemWithSystem(qItem, ICodeSystem.score) ||
    existItemWithSystem(qItem, ICodeSystem.scoringFormulas)
  ) {
    returnErrors.push(
      createError(
        qItem.linkId,
        ValidationType.scoring,
        t("data receiver cannot be a summation field"),
      ),
    );
  }

  return returnErrors;
};

const validateDataReceiverCalculatedExpression = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qItems: Items,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];

  const linkId = getLinkIdFromValueString(qItem);
  const mainItem = qItems[linkId];

  const mainExpression = getExtensionStringValue(
    mainItem,
    IExtensionType.calculatedExpression,
  );
  const copyExpression = getExtensionStringValue(
    qItem,
    IExtensionType.calculatedExpression,
  );

  if (mainExpression !== copyExpression) {
    returnErrors.push(
      createError(
        qItem.linkId,
        ValidationType.calculation,
        t("data receiver does not have a correct calculated expression"),
      ),
    );
  }

  return returnErrors;
};
