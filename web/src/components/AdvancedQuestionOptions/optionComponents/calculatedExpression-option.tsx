import React from "react";

import { Extension, QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import FormField from "../../FormField/FormField";

type CalculatedExpressionOptionProps = {
  item: QuestionnaireItem;
  disabled?: boolean;
  updateExtension: (extension: Extension) => void;
  removeExtension: (extensionType: IExtensionType) => void;
};

const CalculatedExpressionOption = (
  props: CalculatedExpressionOptionProps,
): React.JSX.Element => {
  const { t } = useTranslation();
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
    if (!event.target.value) {
      props.removeExtension(IExtensionType.calculatedExpression);
    } else {
      const ceExtension: Extension = {
        url: IExtensionType.calculatedExpression,
        valueString: event.target.value,
      };
      props.updateExtension(ceExtension);
    }
  };

  const calculatedExpression =
    props.item.extension?.find(
      (ext) => ext.url === IExtensionType.calculatedExpression,
    )?.valueString || "";
  return (
    <FormField label={t("Calculation formula")}>
      <textarea
        defaultValue={calculatedExpression}
        onBlur={handleBlur}
        disabled={props.disabled}
      />
    </FormField>
  );
};

export default CalculatedExpressionOption;
