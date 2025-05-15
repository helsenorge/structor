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
  removeExtension: (extensionUrl: string) => void;
  updateExtension: (extension: Extension) => void;
}

const ButtonsPresentationView = ({
  removeExtension,
  updateExtension,
}: ButtonsPresentationProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  return (
    <FormField label={t("Button bar display")}>
      <RadioBtn
        onChange={(newValue: string) => {
          if (newValue) {
            updateExtension({
              url: IExtensionType.presentationbuttons,
              valueCoding: {
                system: IValueSetSystem.presentationbuttonsValueSet,
                code: newValue,
              },
            });
          } else {
            removeExtension(IExtensionType.presentationbuttons);
          }
        }}
        checked={
          qMetadata?.extension?.find(
            (ex) => ex.url === IExtensionType.presentationbuttons,
          )?.valueCoding?.code ?? "sticky"
        }
        options={presentationButtons}
        name={"presentationbuttons-radio"}
      />
    </FormField>
  );
};

export default ButtonsPresentationView;
