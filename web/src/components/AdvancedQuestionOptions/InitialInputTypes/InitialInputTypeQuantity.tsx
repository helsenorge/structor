import React, { useState } from "react";

import { Quantity, QuestionnaireItem, QuestionnaireItemInitial } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { getQuantityExtension } from "../../../helpers/extensionHelper";
import { isNumeric } from "../../../helpers/formatHelper";
import FormField from "../../FormField/FormField";

type InitialInputTypeQuantityProps = {
  initial?: QuestionnaireItemInitial;
  item: QuestionnaireItem;
  dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeQuantity = (
  props: InitialInputTypeQuantityProps
): React.JSX.Element => {
  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState(getValue(props.initial));

  function getValue(
    initial: QuestionnaireItemInitial | undefined
  ): number | undefined {
    if (!initial) {
      return undefined;
    }
    return initial.valueQuantity?.value;
  }

  function getValueQuantity(value: number): Quantity | undefined {
    if (props.item.extension) {
      const extesion = getQuantityExtension(props.item.extension);
      if (extesion) {
        extesion.value = value;
      }
      return extesion;
    }
  }

  return (
    <FormField label={t("Initial value")}>
      <input
        type="number"
        value={initialValue}
        onChange={({ target: { value } }) => {
          const newValue = value.replace(/,/g, ".");
          if (isNumeric(newValue) || value === "-" || value === "") {
            setInitialValue(parseFloat(newValue));
          }
        }}
        onBlur={() => {
          const newInitial: QuestionnaireItemInitial | undefined = initialValue
            ? { valueQuantity: getValueQuantity(initialValue) }
            : undefined;
          props.dispatchAction(newInitial);
        }}
      />
    </FormField>
  );
};

export default InitialInputTypeQuantity;
