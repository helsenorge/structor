import { useContext, useState } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import FormField from "src/components/FormField/FormField";
import InputField from "src/components/InputField/inputField";
import SwitchBtn from "src/components/SwitchBtn/SwitchBtn";
import { addItemCode, removeItemCodes } from "src/helpers/codeHelper";
import { TreeContext } from "src/store/treeStore/treeStore";
import { ICodeSystem } from "src/types/IQuestionnareItemType";

type Props = {
  item: QuestionnaireItem;
};

export const ContextCodeOption = ({ item }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const contextCode = item.code?.find(
    (code) => code.system === ICodeSystem.contextParameter,
  )?.code;
  const onChangeContextCode = (newValue: string): void => {
    removeItemCodes(item, [ICodeSystem.contextParameter], dispatch);
    if (newValue) {
      addItemCode(
        item,
        {
          system: ICodeSystem.contextParameter,
          code: newValue,
          display: newValue,
        },
        dispatch,
      );
    }
  };

  return (
    <FormField label={t("Context parameter")}>
      <InputField
        defaultValue={contextCode || ""}
        value={contextCode || ""}
        onChange={(e) => onChangeContextCode(e.target.value)}
        className="form-control"
      />
    </FormField>
  );
};
