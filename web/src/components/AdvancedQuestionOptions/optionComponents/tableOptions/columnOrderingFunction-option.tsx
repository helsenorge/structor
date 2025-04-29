import { Coding, QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { ICodeSystem } from "../../../../types/IQuestionnareItemType";
import { TableColumnOrderingOptionsEnum } from "../../../../types/tableOptions";

import { removeItemCode, addItemCode } from "../../../../helpers/codeHelper";
import { ActionType } from "../../../../store/treeStore/treeStore";
import FormField from "../../../FormField/FormField";
import RadioBtn from "../../../RadioBtn/RadioBtn";

type ColumnOrderingFunctionOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const ColumnOrderingFunctionOption = ({
  item,
  dispatch,
}: ColumnOrderingFunctionOptionProps): JSX.Element => {
  const { t } = useTranslation();
  const columnOrderingOptions = [
    {
      code: TableColumnOrderingOptionsEnum.Descending,
      display: t("Descending"),
    },
    { code: TableColumnOrderingOptionsEnum.Ascending, display: t("Ascending") },
  ];

  const onChangeColumnOrderingOption = (newValue: string): void => {
    removeItemCode(item, ICodeSystem.tableOrderingFunctions, dispatch);
    let columnOrderingCoding: Coding = {};
    if (newValue === TableColumnOrderingOptionsEnum.Ascending) {
      columnOrderingCoding = {
        system: ICodeSystem.tableOrderingFunctions,
        code: TableColumnOrderingOptionsEnum.Ascending,
        display: "Ascending",
      };
    } else {
      columnOrderingCoding = {
        system: ICodeSystem.tableOrderingFunctions,
        code: TableColumnOrderingOptionsEnum.Descending,
        display: "Descending",
      };
    }
    addItemCode(item, columnOrderingCoding, dispatch);
  };

  const checkedColumnOrderingOption = (): string | undefined => {
    const itemWithColumnOrderingSystem = item.code?.find(
      (code) => code.system === ICodeSystem.tableOrderingFunctions,
    );
    if (itemWithColumnOrderingSystem) {
      return itemWithColumnOrderingSystem.code;
    }
  };

  return (
    <div className="horizontal full">
      <FormField
        label={t("Ordering function")}
        sublabel={t(
          "Select the default ordering function when ordering by a table column",
        )}
      >
        <RadioBtn
          onChange={onChangeColumnOrderingOption}
          checked={checkedColumnOrderingOption()}
          options={columnOrderingOptions}
          name={"tableColumnOrderingOption-radio"}
        />
      </FormField>
    </div>
  );
};
