import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { hasExtension } from "src/helpers/extensionHelper";
import { isItemControlDataReceiver } from "src/helpers/itemControl";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import { IExtensionType } from "src/types/IQuestionnareItemType";
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

    currentItem.items.forEach((item) =>
      validate(t, item, qItems, qOrder, errors),
    );
  }
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
