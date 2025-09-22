import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import {
  ItemControlType,
  oneOrMoreItemControlsExistOnItem,
} from "src/helpers/itemControl";
import {
  ICodeSystem,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import {
  isItemsWithReadOnlyProperty,
  itemHasCodeWithOneOrMoreSystems,
  itemHasCodeWithSystem,
} from "./utils";
import { createError } from "../../validationHelper";
import { ErrorLevel, ValidationType } from "../../validationTypes";

const isTableGroup = (qItem: QuestionnaireItem): boolean => {
  return (
    qItem.type === IQuestionnaireItemType.group &&
    oneOrMoreItemControlsExistOnItem(qItem, [
      ItemControlType.table,
      ItemControlType.tableHN1,
      ItemControlType.tableHN2,
      ItemControlType.gTable,
    ])
  );
};

const allTableGroupsMustContainChildren = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (isTableGroup(qItem)) {
    if (!qItem.item || qItem.item.length === 0) {
      errors.push(
        createError(
          qItem.linkId,
          ValidationType.table,
          t("Table groups must contain at least one child item"),
          ErrorLevel.error,
        ),
      );
    }
  }
  return errors;
};

const findChildItemWithCodeSystem = (
  qItem: QuestionnaireItem,
  system: ICodeSystem,
): QuestionnaireItem | undefined => {
  if (qItem.item && qItem.item.length > 0) {
    for (const child of qItem.item) {
      const found = findChildItemWithCodeSystem(child, system);
      if (found) {
        return found;
      }
    }
  }
  return qItem.item?.find((child) => itemHasCodeWithSystem(child, system));
};
export const validateTableCodes = ({
  t,
  qItem,
}: {
  qItem: QuestionnaireItem;
  t: TFunction<"translation">;
}): ValidationError[] => {
  if (
    itemHasCodeWithOneOrMoreSystems(qItem, [
      ICodeSystem.tableColumnName,
      ICodeSystem.tableOrderingColumn,
      ICodeSystem.tableOrderingFunctions,
    ])
  ) {
    if (!isTableGroup(qItem)) {
      return [
        createError(
          qItem.linkId,
          ValidationType.table,
          t("item with table codes must be a table group"),
          ErrorLevel.error,
        ),
      ];
    }
  }
  return [];
};

export const validateTableOrderingColumn = ({
  t,
  qItem,
}: {
  qItem: QuestionnaireItem;
  t: TFunction<"translation">;
}): ValidationError[] => {
  if (isTableGroup(qItem)) {
    if (itemHasCodeWithSystem(qItem, ICodeSystem.tableOrderingColumn)) {
      if (!itemHasCodeWithSystem(qItem, ICodeSystem.tableOrderingFunctions)) {
        return [
          createError(
            qItem.linkId,
            ValidationType.table,
            t(
              "Table with table ordering column must also have the table ordering functions code",
            ),
            ErrorLevel.error,
          ),
        ];
      }
    }
    if (itemHasCodeWithSystem(qItem, ICodeSystem.tableOrderingFunctions)) {
      if (!itemHasCodeWithSystem(qItem, ICodeSystem.tableOrderingColumn)) {
        return [
          createError(
            qItem.linkId,
            ValidationType.table,
            t(
              "Table with table ordering functions must also have the table ordering column code",
            ),
            ErrorLevel.error,
          ),
        ];
      }
    }
    return [];
  }
  return [];
};

const itemAndAllChildrenAreReadOnly = (qItem: QuestionnaireItem): boolean => {
  if (!qItem.readOnly) {
    return false;
  }
  if (qItem.item && qItem.item.length > 0) {
    return qItem.item.every((child) => itemAndAllChildrenAreReadOnly(child));
  }
  return true;
};

export const allTableItemsMustBeReadOnly = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  if (isTableGroup(qItem)) {
    for (const child of qItem.item || []) {
      if (!itemAndAllChildrenAreReadOnly(child)) {
        return [
          createError(
            qItem.linkId,
            ValidationType.readonly,
            t("All items in a table must be readOnly"),
            ErrorLevel.error,
          ),
        ];
      }
    }
    return [];
  }
  return [];
};

export const validateTableCommonFunction = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  return [
    ...validateTableOrderingColumn({ t, qItem }),
    ...validateTableCodes({ t, qItem }),
    ...allTableItemsMustBeReadOnly({ t, qItem }),
    ...allTableGroupsMustContainChildren({ t, qItem }),
  ];
};
