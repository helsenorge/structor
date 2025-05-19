import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import RadioBtn from "src/components/RadioBtn/RadioBtn";
import { presentationButtons } from "src/helpers/MetadataHelper";

import {
  IExtensionType,
  IValueSetSystem,
} from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

interface ButtonsPresentationProps {
  updateExtension: (extension: Extension) => void;
}

const ButtonsPresentationView = ({
  updateExtension,
}: ButtonsPresentationProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  const selected =
    qMetadata?.extension?.find(
      (ex) => ex.url === IExtensionType.presentationbuttons,
    )?.valueCoding?.code ?? "sticky";

  const getExtension = (code: string): Extension => {
    return {
      url: IExtensionType.presentationbuttons,
      valueCoding: {
        system: IValueSetSystem.presentationbuttonsValueSet,
        code: code,
      },
    };
  };

  return (
    <FormField label={t("Button bar display")}>
      <RadioBtn
        onChange={(newValue: string) => {
          updateExtension(getExtension(newValue));
        }}
        checked={selected}
        options={presentationButtons}
        name={"presentationbuttons-radio"}
      />
    </FormField>
  );
};

export default ButtonsPresentationView;
