import React, { FunctionComponent, useState } from "react";

import { useTranslation } from "react-i18next";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import {
  removeQuestionnaireExtension,
  setQuestionnaireExtension,
} from "../../../helpers/extensionHelper";
import { itemExtractionOptions } from "../../../helpers/QuestionHelper";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import ValueSetExpansionRadioBtn from "../../RadioBtn/RadioBtn.ValueSetExpansion";

const MetaItemExtractionContextView: FunctionComponent = () => {
  const { t } = useTranslation();
  const { state, dispatch } = React.useContext(TreeContext);
  const { qMetadata } = state;
  const itemExtraction =
    qMetadata?.extension?.find(
      (ex) => ex.url === IExtensionType.itemExtractionContext,
    )?.valueUri ?? "";
  const [selectedExtraction, setExtraction] = useState(itemExtraction);

  const addItemExtention = (newValue: string): void => {
    const extension = {
      url: IExtensionType.itemExtractionContext,
      valueUri: newValue,
    };
    setQuestionnaireExtension(qMetadata, extension, dispatch);
  };

  const onChange = (newValue: string): void => {
    setExtraction(newValue ?? "");
    if (!newValue) {
      removeQuestionnaireExtension(
        qMetadata,
        IExtensionType.itemExtractionContext,
        dispatch,
      );
    } else {
      addItemExtention(newValue);
    }
  };

  return (
    <FormField label={t("Item Extraction")}>
      <ValueSetExpansionRadioBtn
        onChange={onChange}
        checked={selectedExtraction}
        options={itemExtractionOptions}
      />
    </FormField>
  );
};

export default MetaItemExtractionContextView;
