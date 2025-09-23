import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { ItemControlType } from "src/helpers/itemControl";
import { ValidationError } from "src/utils/validationUtils";

import {
  hasTableColumnCodeWithCodeAndDisplay,
  hasTableColumnNameWithCodeAndDisplay,
  isAllowedTableItem,
  isTableType,
} from "./utils";
import { createError } from "../../validationHelper";
import { ErrorLevel, ValidationType } from "../../validationTypes";

export const validateTableHn2 = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  return [
    ...allChildrenMustHaveTheCorrectProperties({ t, qItem }),
    ...allTableChildrenMustHaveTableColumnCode({ t, qItem }),
    ...tableGroupMustHaveAtLeastOneTableColumnNameCode({ t, qItem }),
  ];
};
const allDecendentsHasTableColumnCode = ({
  item,
  t,
}: {
  item: QuestionnaireItem;
  t: TFunction<"translation">;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!hasTableColumnCodeWithCodeAndDisplay(item)) {
    errors.push(
      createError(
        item.linkId,
        ValidationType.table,
        t("All decendents of a tableHN2 must have a table-column code"),
        ErrorLevel.error,
      ),
    );
  }

  for (const child of item.item || []) {
    errors.push(...allDecendentsHasTableColumnCode({ item: child, t }));
  }

  return errors;
};

const allTableChildrenMustHaveTableColumnCode = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const itemIsGTableGroup = isTableType({
    qItem,
    tableType: ItemControlType.tableHN2,
  });

  if (!itemIsGTableGroup) return [];

  const errors: ValidationError[] = [];
  for (const child of qItem.item || []) {
    errors.push(...allDecendentsHasTableColumnCode({ item: child, t }));
  }
  return errors;
};
const allChildrenMustHaveTheCorrectProperties = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const itemIsGTableGroup = isTableType({
    qItem,
    tableType: ItemControlType.tableHN2,
  });
  if (itemIsGTableGroup) {
    for (const child of qItem.item || []) {
      if (!isAllowedTableItem({ qItem: child })) {
        return [
          createError(
            child.linkId,
            ValidationType.table,
            t(
              "Table options must have the correct item types: type.display, data-receiver, initial value, enriched text, be a calculator or scoring (SS/TS)",
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
const tableGroupMustHaveAtLeastOneTableColumnNameCode = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  if (isTableType({ qItem, tableType: ItemControlType.tableHN2 })) {
    if (!hasTableColumnNameWithCodeAndDisplay(qItem)) {
      return [
        createError(
          qItem.linkId,
          ValidationType.table,
          t("Table must have at least one table-column-name code"),
          ErrorLevel.error,
        ),
      ];
    }
  }
  return [];
};
