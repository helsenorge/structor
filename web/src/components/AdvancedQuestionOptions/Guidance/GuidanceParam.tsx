import React, { FocusEvent, useContext, useState } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { getSeverityClass } from "src/components/Validation/validationHelper";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import {
  createGuidanceParameterExtension,
  hasExtension,
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import {
  getGuidanceParameterName,
  isValidGuidanceParameterName,
} from "../../../helpers/QuestionHelper";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type GuidanceParamProps = {
  item: QuestionnaireItem;
};

const GuidanceParam = (props: GuidanceParamProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const hasGuidanceParam = hasExtension(
    props.item,
    IExtensionType.guidanceParam,
  );
  const [parameterName, setParameterName] = useState(
    getGuidanceParameterName(props.item),
  );
  const [validationMessage, setValidationMessage] = useState("");

  const toggleGuidanceParam = (): void => {
    if (hasGuidanceParam) {
      removeItemExtension(props.item, IExtensionType.guidanceParam, dispatch);
    } else {
      setItemExtension(
        props.item,
        createGuidanceParameterExtension(),
        dispatch,
      );
    }
  };

  const updateParameterName = (event: FocusEvent<HTMLInputElement>): void => {
    validateParameterName(event.target.value);
    if (isValidGuidanceParameterName(event.target.value)) {
      setItemExtension(
        props.item,
        createGuidanceParameterExtension(event.target.value),
        dispatch,
      );
    }
  };

  const validateParameterName = (value: string): void => {
    if (!isValidGuidanceParameterName(value)) {
      setValidationMessage(
        t(
          "Parameter name must be 1-255 characters and can only contain numbers, _ and normal and capital letters a-z",
        ),
      );
    } else {
      setValidationMessage("");
    }
    setParameterName(value);
  };

  return (
    <div>
      <FormField>
        <SwitchBtn
          onChange={toggleGuidanceParam}
          value={hasGuidanceParam}
          label={t("Send as parameter")}
        />
      </FormField>
      {hasGuidanceParam && (
        <FormField label={t("Parameter name")}>
          <InputField
            defaultValue={parameterName}
            placeholder={t("For example hn_frontend_parametername")}
            onBlur={updateParameterName}
            onChange={(event) => validateParameterName(event.target.value)}
          />
          {validationMessage && (
            <div
              className={getSeverityClass("text", [{ errorLevel: "error" }])}
            >
              {validationMessage}
            </div>
          )}
        </FormField>
      )}
    </div>
  );
};

export default GuidanceParam;
