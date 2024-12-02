import { useEffect, useState } from "react";

import { QuestionnaireItem, Coding } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  ICodeSystem,
  ICodingProperty,
} from "../../../../types/IQuestionnareItemType";

import {
  removeItemCodeWithCode,
  addItemCode,
  getAllMatchingCodes,
  updateChildWithMatchingCode,
} from "../../../../helpers/codeHelper";
import { updateItemCodePropertyWithCodeAction } from "../../../../store/treeStore/treeActions";
import {
  ActionType,
  Items,
  OrderItem,
} from "../../../../store/treeStore/treeStore";
import Btn from "../../../Btn/Btn";
import FormField from "../../../FormField/FormField";
import InputField from "../../../InputField/inputField";

type ColumnNameOptionProps = {
  item: QuestionnaireItem;
  qItems: Items;
  qOrder: OrderItem[];
  dispatch: React.Dispatch<ActionType>;
};

export const ColumnNameOption = ({
  item,
  qItems,
  qOrder,
  dispatch,
}: ColumnNameOptionProps): JSX.Element => {
  const { t } = useTranslation();
  const [existingColumnCodes, setExistingColumnCodes] = useState<
    Coding[] | undefined
  >(getAllMatchingCodes(item, ICodeSystem.tableColumnName));
  const lastItem =
    existingColumnCodes && existingColumnCodes[existingColumnCodes?.length - 1];

  const onBlurNameInput = (
    oldCodeValue: string,
    newDisplayValue: string
  ): void => {
    if (newDisplayValue === "") {
      return;
    }
    dispatch(
      updateItemCodePropertyWithCodeAction(
        item.linkId,
        ICodingProperty.display,
        newDisplayValue,
        ICodeSystem.tableColumnName,
        oldCodeValue
      )
    );
    updateChildWithMatchingCode(
      item,
      qItems,
      qOrder,
      newDisplayValue,
      ICodeSystem.tableColumn,
      oldCodeValue,
      dispatch
    );
  };

  const onAddButtonClicked = (): void => {
    const previousCode = lastItem?.code;
    const newCode = previousCode ? parseInt(previousCode) + 1 : 1;

    addItemCode(
      item,
      {
        system: ICodeSystem.tableColumnName,
        code: newCode.toString(),
        display: "",
      },
      dispatch
    );
  };

  const onDeleteButtonClicked = (code: string): void => {
    removeItemCodeWithCode(item, ICodeSystem.tableColumnName, code, dispatch);
  };

  useEffect(() => {
    setExistingColumnCodes(
      getAllMatchingCodes(item, ICodeSystem.tableColumnName)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.code]);

  return (
    <div className="horizontal full">
      <FormField
        label={t("Table columns")}
        sublabel={t("Add columns to the table")}
      >
        {existingColumnCodes?.map((coding, index) => (
          <div
            key={coding.display + index.toString()}
            className="columnNames-fieldWrapper"
          >
            <InputField
              defaultValue={coding.display}
              placeholder={t("Enter column name..")}
              onBlur={(e) => {
                onBlurNameInput(coding.code || "", e.target.value);
              }}
            />
            {
              <button
                className="columnNames-deleteButton"
                type="button"
                name={t("Remove element")}
                onClick={() => onDeleteButtonClicked(coding.code || "")}
              />
            }
          </div>
        ))}
        <div className="columnNames-addButton">
          <Btn
            title={t("+ Add column")}
            type="button"
            onClick={() => onAddButtonClicked()}
            variant={"secondary"}
          />
        </div>
      </FormField>
    </div>
  );
};
