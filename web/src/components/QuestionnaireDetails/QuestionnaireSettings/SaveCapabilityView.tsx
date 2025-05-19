import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import RadioBtn from "src/components/RadioBtn/RadioBtn";
import { saveCapability } from "src/helpers/MetadataHelper";

import {
  IExtensionType,
  IValueSetSystem,
} from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

interface SaveCapabilityProps {
  updateExtension: (extension: Extension) => void;
}

const SaveCapabilityView = ({
  updateExtension,
}: SaveCapabilityProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  const selected =
    qMetadata?.extension?.find((ex) => ex.url === IExtensionType.saveCapability)
      ?.valueCoding?.code ?? "1";

  const getExtension = (code: string): Extension => {
    return {
      url: IExtensionType.saveCapability,
      valueCoding: {
        system: IValueSetSystem.saveCapabilityValueSet,
        code: code,
      },
    };
  };

  return (
    <FormField label={t("Save capabilities")}>
      <RadioBtn
        onChange={(newValue: string) => {
          updateExtension(getExtension(newValue));
        }}
        checked={selected}
        options={saveCapability}
        name={"saveCapability-radio"}
      />
    </FormField>
  );
};

export default SaveCapabilityView;
