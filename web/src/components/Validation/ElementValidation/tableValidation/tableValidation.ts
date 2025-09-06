import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { getAllOrderItemChildrenOfItem } from "src/helpers/codeHelper";
import {
  existItemControlWithCode,
  ItemControlType,
  oneOrMoreItemControlsExistOnItem,
} from "src/helpers/itemControl";
import { doesAllItemsHaveSameAnswerValueSet } from "src/helpers/valueSetHelper";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireItemType } from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { isDataReceiver } from "@helsenorge/refero";

import { checkAllDecendantsForCorrectTypes, isTableType } from "./utils";
import { createError } from "../../validationHelper";
import { ErrorLevel, ValidationType } from "../../validationTypes";
export const validateTable = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  state: TreeState,
): ValidationError[] => {
  return [
    ...allOptionsMustBeDataRecieverOrHaveInitialValue({ t, qItem }),
    ...validateCorrectItemTypeForOptions({
      t,
      qItem,
    }),
    ...validateAnswerOptionsTable({
      t,
      qItem,
      qOrder: state.qOrder,
      qItems: state.qItems,
    }),
  ];
};

const isTableExtension = ({ qItem }: { qItem: QuestionnaireItem }): boolean => {
  return (
    qItem.type === IQuestionnaireItemType.group &&
    oneOrMoreItemControlsExistOnItem(qItem, [ItemControlType.table])
  );
};
const errorFn = (
  item: QuestionnaireItem,
  t: TFunction<"translation">,
): ValidationError =>
  createError(
    item.linkId,
    ValidationType.table,
    t(
      "Table options must have the correct item types: type.display, data-receiver, initial value, enriched text, be a calculator or scoring (SS/TS)",
    ),
    ErrorLevel.error,
  );

const allOptionsMustBeDataRecieverOrHaveInitialValue = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (isTableType({ qItem, tableType: ItemControlType.table })) {
    const qItemChildren = qItem?.item;
    qItemChildren?.forEach((child) => {
      if (!child.initial && !isDataReceiver(child)) {
        errors.push(
          createError(
            qItem.linkId,
            ValidationType.table,
            t("Table options must have an initial value or be a data receiver"),
            ErrorLevel.error,
          ),
        );
      }
      errors.push(
        ...checkAllDecendantsForCorrectTypes({
          item: child.item,
          errorFn: errorFn,
          t,
        }),
      );
    });
  }
  return errors;
};
const validateCorrectItemTypeForOptions = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  if (isTableExtension({ qItem })) {
    const isValidType = qItem?.item?.every(
      (item) =>
        item.type === IQuestionnaireItemType.choice ||
        item.type === IQuestionnaireItemType.openChoice,
    );
    return isValidType
      ? []
      : [
          createError(
            qItem.linkId,
            ValidationType.table,
            t("Table must only contain choice or openChoice items"),
            ErrorLevel.error,
          ),
        ];
  }
  return [];
};
const validateAnswerOptionsTable = ({
  t,
  qItem,
  qOrder,
  qItems,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
  qOrder: OrderItem[];
  qItems: Items;
}): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (
    qItem.type === IQuestionnaireItemType.group &&
    existItemControlWithCode(qItem, ItemControlType.table)
  ) {
    const orderItems = getAllOrderItemChildrenOfItem(qOrder, qItem.linkId);

    if (qItem.item?.length === 0) {
      returnErrors.push(
        createError(
          qItem.linkId,
          ValidationType.table,
          t("Table with answer options has no children"),
          ErrorLevel.error,
        ),
      );
    } else {
      const allAnswerValueSetHasSameValue = doesAllItemsHaveSameAnswerValueSet(
        orderItems,
        qItems,
      );
      if (!allAnswerValueSetHasSameValue) {
        returnErrors.push(
          createError(
            qItem.linkId,
            ValidationType.table,
            t(
              "All answerValueSet values within a group with coding 'table' must be equal",
            ),
            ErrorLevel.error,
          ),
        );
      }
    }
  }
  return returnErrors;
};
