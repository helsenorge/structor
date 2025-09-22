import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { ItemControlType } from "src/helpers/itemControl";
import { ValidationError } from "src/utils/validationUtils";

import { isDataReceiver } from "@helsenorge/refero";

import { isTableType } from "./utils";
import { createError } from "../../validationHelper";
import { ErrorLevel, ValidationType } from "../../validationTypes";

export const validateGTable = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  return [
    ...allItemsMustHaveTextValue({ t, qItem }),
    ...allItemsMustHaveDataReceiverExtension({ t, qItem }),
    ...allItemsMustBeRequired({ t, qItem }),
  ];
};

const allItemsMustHaveDataReceiverExtension = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const itemIsGTableGroup = isTableType({
    qItem,
    tableType: ItemControlType.gTable,
  });
  if (!itemIsGTableGroup) {
    return [];
  }
  const allHasDataReceiver = qItem.item?.every((item) => isDataReceiver(item));
  if (!allHasDataReceiver) {
    return [
      createError(
        qItem.linkId,
        ValidationType.table,
        t("All items in a gTable must have a dataReceiver extension"),
        ErrorLevel.error,
      ),
    ];
  }
  return [];
};

const allItemsMustHaveTextValue = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const itemIsGTableGroup = isTableType({
    qItem,
    tableType: ItemControlType.gTable,
  });
  if (!itemIsGTableGroup) {
    return [];
  }
  const allHasText = qItem.item?.every((item) => item.text && item.text !== "");
  if (!allHasText) {
    return [
      createError(
        qItem.linkId,
        ValidationType.table,
        t("All items in a gTable must have a text value"),
        ErrorLevel.error,
      ),
    ];
  }
  return [];
};
const allItemsMustBeRequired = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const itemIsGTableGroup = isTableType({
    qItem,
    tableType: ItemControlType.gTable,
  });
  if (!itemIsGTableGroup) {
    return [];
  }
  const allAreRequired = qItem.item?.every((item) => item.required);
  if (!allAreRequired) {
    return [
      createError(
        qItem.linkId,
        ValidationType.table,
        t("All items in a gTable must be required"),
        ErrorLevel.error,
      ),
    ];
  }
  return [];
};
