import React, { useState } from "react";

import { QuestionnaireItemInitial } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { isNumeric } from "../../../helpers/formatHelper";
import FormField from "../../FormField/FormField";

type InitialInputTypeIntegerProps = {
  initial?: QuestionnaireItemInitial;
  dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeDecimal = (
  props: InitialInputTypeIntegerProps
): React.JSX.Element => {
  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState(getValue(props.initial));

  function getValue(initial: QuestionnaireItemInitial | undefined): string {
    if (!initial) {
      return "";
    }
    return initial.valueDecimal?.toString() || "";
  }

  return (
    <FormField label={t("Initial value")}>
      <input
        type="number"
        value={initialValue}
        onChange={({ target: { value } }) => {
          const newValue = value.replace(/,/g, ".");
          if (isNumeric(newValue) || value === "-" || value === "") {
            setInitialValue(newValue);
          }
        }}
        onBlur={() => {
          const newInitial: QuestionnaireItemInitial | undefined = isNumeric(
            initialValue
          )
            ? { valueDecimal: parseFloat(initialValue) }
            : undefined;
          props.dispatchAction(newInitial);
        }}
      />
    </FormField>
  );
};

export default InitialInputTypeDecimal;
