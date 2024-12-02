import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { ICodeSystem } from "../../../../types/IQuestionnareItemType";

import { removeItemCode, addItemCode } from "../../../../helpers/codeHelper";
import { ActionType } from "../../../../store/treeStore/treeStore";
import {
  createOptionsFromQItemCode,
  getDisplayValueInOption,
  getSelectedValue,
} from "../../../../utils/optionsUtils";
import FormField from "../../../FormField/FormField";
import Select from "../../../Select/Select";

type ColumnOptionProps = {
  item: QuestionnaireItem;
  parentItem: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const ColumnOption = ({
  item,
  parentItem,
  dispatch,
}: ColumnOptionProps): JSX.Element => {
  const { t } = useTranslation();

  const options = createOptionsFromQItemCode(
    parentItem,
    ICodeSystem.tableColumnName
  );

  const onChangeOption = (newValue: string): void => {
    removeItemCode(item, ICodeSystem.tableColumn, dispatch);
    addItemCode(
      item,
      {
        system: ICodeSystem.tableColumn,
        code: newValue,
        display: getDisplayValueInOption(options, newValue),
      },
      dispatch
    );
  };

  return (
    <div className="horizontal full">
      <FormField
        label={t("Table column")}
        sublabel={t("Select a table column to link the item to")}
      >
        <Select
          placeholder={t("Choose a column:")}
          options={options}
          value={getSelectedValue(item, ICodeSystem.tableColumn)}
          onChange={(e) => onChangeOption(e.target.value)}
        />
      </FormField>
    </div>
  );
};
