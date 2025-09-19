import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import {
  ErrorClassVariant,
  getErrorMessagesAndSeverityClasses,
  getSeverityClass,
  getValidationErrorByErrorProperty,
} from "src/components/Validation/validationHelper";
import { ValidationType } from "src/components/Validation/validationTypes";
import { translatableSettings } from "src/helpers/LanguageHelper";
import { ValidationError } from "src/utils/validationUtils";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

interface PrintVersionViewProps {
  errors: ValidationError[];
  removeExtension: (extensionUrl: string) => void;
  updateExtension: (extension: Extension) => void;
}

const PrintVersionView = ({
  errors,
  removeExtension,
  updateExtension,
}: PrintVersionViewProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  const validationErrors = getErrorMessagesAndSeverityClasses(
    ErrorClassVariant.highlight,
    getValidationErrorByErrorProperty(ValidationType.binary, errors),
  );
  return (
    <FormField label={t("Connect to print version (binary)")}>
      <InputField
        className={getSeverityClass(
          ErrorClassVariant.highlight,
          errors.filter((x) => x.errorProperty === ValidationType.binary),
        )}
        placeholder={t("For example Binary/35")}
        defaultValue={
          qMetadata?.extension?.find(
            (ex) => ex.url === IExtensionType.printVersion,
          )?.valueReference?.reference ?? ""
        }
        onBlur={(e) => {
          if (!e.target.value) {
            removeExtension(IExtensionType.printVersion);
          } else {
            const extensionSettings =
              translatableSettings[IExtensionType.printVersion];
            if (extensionSettings) {
              updateExtension(extensionSettings.generate(e.target.value));
            }
          }
        }}
      />
      {validationErrors?.map((error) => (
        <div
          key={error.message}
          className={error.severityClass}
          aria-live="polite"
        >
          {error.message}
        </div>
      ))}
    </FormField>
  );
};

export default PrintVersionView;
