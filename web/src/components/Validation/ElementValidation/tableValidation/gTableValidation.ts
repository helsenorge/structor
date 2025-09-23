import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { getLinkIdFromValueString } from "src/helpers/dataReceiverHelper";
import { ItemControlType } from "src/helpers/itemControl";
import { ValidationError } from "src/utils/validationUtils";

import { isDataReceiver } from "@helsenorge/refero";

import { isTableType } from "./utils";
import { createError } from "../../validationHelper";
import { ErrorLevel, ValidationType } from "../../validationTypes";
import { findQuestionnaireItemsInQuestionnaire } from "../fhirExtract/utils";

export const validateGTable = ({
  t,
  qItem,
  questionnaire,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
  questionnaire: Questionnaire;
}): ValidationError[] => {
  return [
    ...allItemsMustHaveTextValue({ t, qItem }),
    ...allItemsMustHaveDataReceiverExtension({ t, qItem }),
    ...allItemsMustBeRequired({ t, qItem, questionnaire }),
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
  questionnaire,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
  questionnaire: Questionnaire;
}): ValidationError[] => {
  const itemIsGTableGroup = isTableType({
    qItem,
    tableType: ItemControlType.gTable,
  });
  if (!itemIsGTableGroup) {
    return [];
  }
  const errors: ValidationError[] = [];

  for (const item of qItem.item || []) {
    const linkId = getLinkIdFromValueString(item);
    const groupChildren = findQuestionnaireItemsInQuestionnaire(
      questionnaire.item,
      (item) => item.linkId === linkId,
    );

    if (
      groupChildren &&
      groupChildren.length > 0 &&
      !groupChildren[0].required
    ) {
      errors.push(
        createError(
          linkId,
          ValidationType.table,
          t(`Items used in a repeatable table (gTable) must be required`),
          ErrorLevel.error,
        ),
      );
    }
  }
  return errors;
};
