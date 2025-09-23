import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import {
  isItemControlDataReceiver,
  itemControlExistsInExtensionList,
  ItemControlType,
} from "src/helpers/itemControl";
import {
  ICodeSystem,
  IExtensionType,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { getCodes, getExtension } from "@helsenorge/refero";

export const itemHasCodeWithSystem = (
  qItem: QuestionnaireItem,
  system: string,
): boolean => {
  return qItem.code?.some((coding) => coding.system === system) ?? false;
};
export const itemHasCodeWithOneOrMoreSystems = (
  qItem: QuestionnaireItem,
  systems: string[],
): boolean => {
  return systems.some((system) => itemHasCodeWithSystem(qItem, system));
};

export const itemHasInitialValue = (qItem: QuestionnaireItem): boolean => {
  return !!qItem?.initial && qItem?.initial?.length > 0;
};
export const itemIsEnrichedText = (qItem: QuestionnaireItem): boolean => {
  return !!getExtension(IExtensionType.fhirPath, qItem);
};
export const isCalculatedExpression = (qItem: QuestionnaireItem): boolean => {
  const calculatedExpression = getExtension(
    IExtensionType.calculatedExpression,
    qItem,
  );
  return !!calculatedExpression;
};
export const itemIsScoringItem = (qItem: QuestionnaireItem): boolean => {
  const codes = getCodes(qItem, ICodeSystem.score);
  return !!(codes && codes.length > 0);
};
export const hasTableColumnCode = (qItem: QuestionnaireItem): boolean => {
  return itemHasCodeWithSystem(qItem, ICodeSystem.tableColumn);
};
export const hasTableColumnCodeWithCodeAndDisplay = (
  qItem: QuestionnaireItem,
): boolean => {
  const codes = qItem.code?.filter(
    (coding) => coding.system === ICodeSystem.tableColumn,
  );
  if (!codes || codes.length === 0) return false;
  return codes.some((code) => code.code && code.display);
};
export const hasTableColumnNameCode = (qItem: QuestionnaireItem): boolean => {
  return itemHasCodeWithSystem(qItem, ICodeSystem.tableColumnName);
};
export const hasTableColumnNameWithCodeAndDisplay = (
  qItem: QuestionnaireItem,
): boolean => {
  const codes = qItem.code?.filter(
    (coding) => coding.system === ICodeSystem.tableColumnName,
  );
  if (!codes || codes.length === 0) return false;
  return codes.some((code) => code.code && code.display);
};
export const isAllowedTableItem = ({
  qItem,
}: {
  qItem: QuestionnaireItem;
}): boolean => {
  const isInformationText = qItem.type === IQuestionnaireItemType.display;
  const isDataReceiver = isItemControlDataReceiver(qItem);
  const hasInitialValue = itemHasInitialValue(qItem);
  const isEnrichedText = itemIsEnrichedText(qItem);
  const isCalculatorItem = isCalculatedExpression(qItem);
  const isScoringItem = itemIsScoringItem(qItem);
  return (
    isInformationText ||
    isDataReceiver ||
    hasInitialValue ||
    isEnrichedText ||
    isCalculatorItem ||
    isScoringItem
  );
};

export type TableType =
  | ItemControlType.table
  | ItemControlType.tableHN1
  | ItemControlType.tableHN2
  | ItemControlType.gTable;

export const isTableType = ({
  qItem,
  tableType,
}: {
  qItem: QuestionnaireItem;
  tableType: TableType;
}): boolean => {
  return (
    qItem.type === IQuestionnaireItemType.group &&
    itemControlExistsInExtensionList(qItem.extension, tableType)
  );
};

const checkChildItemsForCorrectTypes = ({
  errorFn,
  item,
  t,
}: {
  errorFn: (
    item: QuestionnaireItem,
    t: TFunction<"translation">,
  ) => ValidationError;
  item: QuestionnaireItem;
  t: TFunction<"translation">;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isAllowedTableItem({ qItem: item })) {
    errors.push(errorFn(item, t));
  }
  return errors;
};
export const checkAllDecendantsForCorrectTypes = ({
  errorFn,
  item,
  t,
}: {
  errorFn: (
    item: QuestionnaireItem,
    t: TFunction<"translation">,
  ) => ValidationError;
  item?: QuestionnaireItem[];
  t: TFunction<"translation">;
}): ValidationError[] => {
  if (!item) return [];
  const errors: ValidationError[] = [];
  item.forEach((child) => {
    errors.push(...checkChildItemsForCorrectTypes({ item: child, errorFn, t }));
  });
  return errors;
};
export const isItemsWithReadOnlyProperty = (
  qItem: QuestionnaireItem,
): boolean => {
  return !(
    qItem.type === IQuestionnaireItemType.display ||
    qItem.type === IQuestionnaireItemType.group
  );
};
