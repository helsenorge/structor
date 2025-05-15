import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import RadioBtn from "src/components/RadioBtn/RadioBtn";
import { authenticationRequirement } from "src/helpers/MetadataHelper";

import {
  IExtensionType,
  IValueSetSystem,
} from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

interface AuthenticationRequirementProps {
  removeExtension: (extensionUrl: string) => void;
  updateExtension: (extension: Extension) => void;
}

const AuthenticationRequirementView = ({
  removeExtension,
  updateExtension,
}: AuthenticationRequirementProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  const selected =
    qMetadata?.extension?.find(
      (ex) => ex.url === IExtensionType.authenticationRequirement,
    )?.valueCoding?.code ?? "3";

  const getExtension = (code: string): Extension => {
    return {
      url: IExtensionType.authenticationRequirement,
      valueCoding: {
        system: IValueSetSystem.authenticationRequirementValueSet,
        code: code,
      },
    };
  };

  return (
    <FormField
      label={t("Describes if user must be logged in to answer questionnaire")}
    >
      <RadioBtn
        onChange={(newValue: string) => {
          if (newValue) {
            updateExtension(getExtension(newValue));
          } else {
            removeExtension(IExtensionType.authenticationRequirement);
          }
        }}
        checked={selected}
        options={authenticationRequirement}
        name={"authenticationRequirement-radio"}
      />
    </FormField>
  );
};

export default AuthenticationRequirementView;
