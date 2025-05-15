import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { ValidationType } from "src/components/Validation/validationTypes";
import { getValidaitonClassNameWithPropsName } from "src/helpers/validationClassHelper";
import { ValidationError } from "src/utils/validationUtils";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

interface EndpointViewProps {
  errors: ValidationError[];
  removeExtension: (extensionUrl: string) => void;
  updateExtension: (extension: Extension) => void;
}

const EndpointView = ({
  errors,
  removeExtension,
  updateExtension,
}: EndpointViewProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  return (
    <FormField label={t("Helsenorge endpoint")}>
      <InputField
        className={getValidaitonClassNameWithPropsName(
          ValidationType.endpoint,
          errors,
        )}
        placeholder={t("For example Endpoint/35")}
        defaultValue={
          qMetadata?.extension?.find((ex) => ex.url === IExtensionType.endpoint)
            ?.valueReference?.reference ?? ""
        }
        onBlur={(e) => {
          if (!e.target.value) {
            removeExtension(IExtensionType.endpoint);
          } else {
            updateExtension({
              url: IExtensionType.endpoint,
              valueReference: {
                reference: e.target.value,
              },
            });
          }
        }}
      />
    </FormField>
  );
};

export default EndpointView;
