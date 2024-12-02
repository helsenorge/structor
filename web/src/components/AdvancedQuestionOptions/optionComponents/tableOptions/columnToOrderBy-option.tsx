import { QuestionnaireItem, ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { ICodeSystem } from "../../../../types/IQuestionnareItemType";
import { Option } from "../../../../types/OptionTypes";
import { TableOptionsEnum } from "../../../../types/tableOptions";

import { removeItemCode, addItemCode } from "../../../../helpers/codeHelper";
import {
  ActionType,
  Items,
  OrderItem,
} from "../../../../store/treeStore/treeStore";
import {
  createOptionsFromQItemCode,
  getContainedOptions,
  getDisplayValueInOption,
  getGTableOptions,
  getSelectedValue,
} from "../../../../utils/optionsUtils";
import FormField from "../../../FormField/FormField";
import Select from "../../../Select/Select";

type ColumnToOrderByOptionProps = {
  item: QuestionnaireItem;
  tableType: TableOptionsEnum;
  qItems?: Items;
  qOrder?: OrderItem[];
  qContained?: ValueSet[];
  allChoiceItems?: OrderItem[];
  dispatch: React.Dispatch<ActionType>;
};

export const ColumnToOrderByOption = ({
  item,
  qItems,
  qOrder,
  qContained,
  tableType,
  allChoiceItems,
  dispatch,
}: ColumnToOrderByOptionProps): JSX.Element => {
  const { t } = useTranslation();

  const getOptionsToUse = (): Option[] | undefined => {
    if (
      tableType === TableOptionsEnum.Table &&
      allChoiceItems &&
      qItems &&
      qContained
    ) {
      const tableOptions = getContainedOptions(
        allChoiceItems,
        qItems,
        qContained
      );
      return tableOptions;
    }
    if (tableType === TableOptionsEnum.GTable && qItems && qOrder) {
      const gTableOptions = getGTableOptions(item, qOrder, qItems);
      return gTableOptions;
    }
    if (tableType === TableOptionsEnum.TableHN2) {
      const tableHN2Options = createOptionsFromQItemCode(
        item,
        ICodeSystem.tableColumnName
      );
      return tableHN2Options;
    }
  };
  const optionsToUse = getOptionsToUse();

  const onChangeOption = (newValue: string): void => {
    removeItemCode(item, ICodeSystem.tableOrderingColumn, dispatch);
    optionsToUse &&
      addItemCode(
        item,
        {
          system: ICodeSystem.tableOrderingColumn,
          code: newValue,
          display: getDisplayValueInOption(optionsToUse, newValue),
        },
        dispatch
      );
  };

  return (
    <>
      {optionsToUse && (
        <div className="horizontal full">
          <FormField
            label={t("Ordering column")}
            sublabel={t("Select the column to order the table by")}
          >
            <Select
              placeholder={t("Choose a column:")}
              options={optionsToUse}
              value={getSelectedValue(item, ICodeSystem.tableOrderingColumn)}
              onChange={(e) => onChangeOption(e.target.value)}
            />
          </FormField>
        </div>
      )}
    </>
  );
};
