import { FunctionComponent, useContext, useState } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import {
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import { itemExtractionOptions } from "../../../helpers/QuestionHelper";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import ValueSetExpansionRadioBtn from "../../RadioBtn/RadioBtn.ValueSetExpansion";

interface ItemExtractionContextProps {
  item: QuestionnaireItem;
}

const ItemExtractionContextView: FunctionComponent<
  ItemExtractionContextProps
> = ({ item }: ItemExtractionContextProps) => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const itemExtraction =
    item.extension?.find(
      (ex) => ex.url === IExtensionType.itemExtractionContext,
    )?.valueUri ?? "";
  const [selectedExtraction, setExtraction] = useState(itemExtraction);

  const addItemExtention = (newValue: string): void => {
    setItemExtension(
      item,
      {
        url: IExtensionType.itemExtractionContext,
        valueUri: newValue,
      },
      dispatch,
    );
  };

  const onChange = (newValue: string): void => {
    setExtraction(newValue ?? "");
    if (!newValue) {
      removeItemExtension(item, IExtensionType.itemExtractionContext, dispatch);
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

export default ItemExtractionContextView;
