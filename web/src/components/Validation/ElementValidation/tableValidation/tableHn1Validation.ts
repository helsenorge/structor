import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { ItemControlType } from "src/helpers/itemControl";
import { ICodeSystem } from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import {
  isAllowedTableItem,
  isTableType,
  itemHasCodeWithOneOrMoreSystems,
} from "./utils";
import { createError } from "../../validationHelper";
import { ErrorLevel, ValidationType } from "../../validationTypes";

export const validateTableHn1 = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  return [
    ...tableCantHaveSorting({ t, qItem }),
    ...allChildrenMustHaveTheCorrectProperties({ t, qItem }),
  ];
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
    tableType: ItemControlType.tableHN1,
  });
  if (itemIsGTableGroup) {
    for (const child of qItem.item || []) {
      if (!isAllowedTableItem({ qItem: child })) {
        return [
          createError(
            qItem.linkId,
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

const tableCantHaveSorting = ({
  t,
  qItem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
}): ValidationError[] => {
  const itemIsGTableGroup = isTableType({
    qItem,
    tableType: ItemControlType.tableHN1,
  });
  if (itemIsGTableGroup) {
    if (
      itemHasCodeWithOneOrMoreSystems(qItem, [
        ICodeSystem.tableOrderingColumn,
        ICodeSystem.tableOrderingFunctions,
      ])
    ) {
      return [
        createError(
          qItem.linkId,
          ValidationType.table,
          t("tableHN1 cannot have sorting"),
          ErrorLevel.error,
        ),
      ];
    }
  }
  return [];
};
