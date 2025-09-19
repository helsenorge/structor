import React, { useContext } from "react";

import { Extension, QuestionnaireItem, ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { getSeverityClass } from "src/components/Validation/validationHelper";
import { ValidationType } from "src/components/Validation/validationTypes";
import { removeItemCodes } from "src/helpers/codeHelper";
import { ValidationError } from "src/utils/validationUtils";

import {
  ICodeSystem,
  IExtensionType,
  IQuestionnaireItemType,
} from "../../../../types/IQuestionnareItemType";
import { TableOptionsEnum } from "../../../../types/tableOptions";

import { ColumnNameOption } from "./columnName-option";
import { ColumnOrderingFunctionOption } from "./columnOrderingFunction-option";
import { ColumnToOrderByOption } from "./columnToOrderBy-option";
import {
  removeItemExtension,
  setItemExtension,
} from "../../../../helpers/extensionHelper";
import {
  ItemControlType,
  createItemControlExtension,
  existItemControlWithCode,
} from "../../../../helpers/itemControl";
import {
  Items,
  OrderItem,
  TreeContext,
} from "../../../../store/treeStore/treeStore";
import { getAllItemTypes } from "../../../../utils/itemSearchUtils";
import { getTableCode } from "../../../../utils/tableutils";
import FormField from "../../../FormField/FormField";
import RadioBtn from "../../../RadioBtn/RadioBtn";

type TableOptionProps = {
  item: QuestionnaireItem;
  qItems: Items;
  qOrder: OrderItem[];
  qContained: ValueSet[] | undefined;
  errors: ValidationError[];
};

export const TableOption = ({
  item,
  qItems,
  qOrder,
  qContained,
  errors,
}: TableOptionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const getCheckedTableOption = (): string => {
    const tableCode =
      getTableCode(itemControlExtension) || TableOptionsEnum.None;
    return tableCode;
  };

  const onChangeTableOption = (newValue: string): void => {
    removeItemCodes(
      item,
      [ICodeSystem.tableOrderingFunctions, ICodeSystem.tableOrderingColumn],
      dispatch,
    );

    let newExtension: Extension;
    switch (newValue) {
      case TableOptionsEnum.GTable:
        newExtension = createItemControlExtension(ItemControlType.gTable);
        setItemExtension(item, newExtension, dispatch);
        break;
      case TableOptionsEnum.Table:
        newExtension = createItemControlExtension(ItemControlType.table);
        setItemExtension(item, newExtension, dispatch);
        break;
      case TableOptionsEnum.TableHN1:
        newExtension = createItemControlExtension(ItemControlType.tableHN1);
        setItemExtension(item, newExtension, dispatch);
        break;
      case TableOptionsEnum.TableHN2:
        newExtension = createItemControlExtension(ItemControlType.tableHN2);
        setItemExtension(item, newExtension, dispatch);
        break;
      default:
        removeItemExtension(item, IExtensionType.itemControl, dispatch);
    }
  };

  const itemControlExtension = item.extension?.find(
    (extension) => extension.url === IExtensionType.itemControl,
  );

  const hasTableCode = existItemControlWithCode(
    item,
    getTableCode(itemControlExtension) || "",
  );

  const tableOptions = [
    { code: TableOptionsEnum.None, display: t(`Don't display as a table`) },
    {
      code: TableOptionsEnum.GTable,
      display: t("Table with repeating groups displayed"),
    },
    {
      code: TableOptionsEnum.Table,
      display: t("Table with answer options as columns"),
    },
    {
      code: TableOptionsEnum.TableHN1,
      display: t("Table with question and answer in two columns"),
    },
    {
      code: TableOptionsEnum.TableHN2,
      display: t("Table with custom columns and column headers"),
    },
  ];
  const checkedTableOption = getCheckedTableOption();
  const showColumnOptions: boolean =
    hasTableCode && checkedTableOption !== TableOptionsEnum.TableHN1;

  const allChoiceItems: OrderItem[] = getAllItemTypes(
    qOrder,
    qItems,
    IQuestionnaireItemType.choice,
  );
  const errorClass = getSeverityClass(
    "box",
    errors.filter(
      (error) =>
        error.errorProperty === ValidationType.table &&
        item.linkId === error.linkId,
    ),
  );
  return (
    <>
      <div className={errorClass}>
        <FormField
          label={t("Table")}
          sublabel={t(
            "Choose whether the group should be displayed as a summary table",
          )}
        >
          <RadioBtn
            onChange={onChangeTableOption}
            checked={checkedTableOption}
            options={tableOptions}
            name={"tableOption-radio"}
          />
        </FormField>
        {showColumnOptions && (
          <div className="table-column-options-wrapper">
            <div className="indentation-element" />
            <div className="table-column-options">
              {checkedTableOption === TableOptionsEnum.TableHN2 && (
                <>
                  <ColumnNameOption
                    item={item}
                    qItems={qItems}
                    qOrder={qOrder}
                    dispatch={dispatch}
                  />
                  <ColumnToOrderByOption
                    item={item}
                    tableType={TableOptionsEnum.TableHN2}
                    dispatch={dispatch}
                  />
                </>
              )}
              {checkedTableOption === TableOptionsEnum.Table && (
                <ColumnToOrderByOption
                  item={item}
                  tableType={TableOptionsEnum.Table}
                  qItems={qItems}
                  qContained={qContained}
                  allChoiceItems={allChoiceItems}
                  dispatch={dispatch}
                />
              )}
              {checkedTableOption === TableOptionsEnum.GTable && (
                <ColumnToOrderByOption
                  item={item}
                  tableType={TableOptionsEnum.GTable}
                  qItems={qItems}
                  qOrder={qOrder}
                  dispatch={dispatch}
                />
              )}
              <ColumnOrderingFunctionOption item={item} dispatch={dispatch} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
