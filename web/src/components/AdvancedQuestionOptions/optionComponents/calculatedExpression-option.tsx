import React, { useContext } from "react";

import { Extension, QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { getSeverityClass } from "src/components/Validation/validationHelper";
import { ValidationType } from "src/components/Validation/validationTypes";
import {
  removeItemExtension,
  setItemExtension,
} from "src/helpers/extensionHelper";
import { TreeContext } from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import FormField from "../../FormField/FormField";

type CalculatedExpressionOptionProps = {
  item: QuestionnaireItem;
  disabled?: boolean;
  errors: ValidationError[];
};

const CalculatedExpressionOption = ({
  item,
  disabled,
  errors,
}: CalculatedExpressionOptionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const errorClass = getSeverityClass(
    "box",
    errors.filter(
      (error) =>
        error.errorProperty === ValidationType.calculation &&
        item.linkId === error.linkId,
    ),
  );
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
    if (!event.target.value) {
      removeItemExtension(item, IExtensionType.calculatedExpression, dispatch);
    } else {
      const ceExtension: Extension = {
        url: IExtensionType.calculatedExpression,
        valueString: event.target.value,
      };
      setItemExtension(item, ceExtension, dispatch);
    }
  };

  const calculatedExpression =
    item.extension?.find(
      (ext) => ext.url === IExtensionType.calculatedExpression,
    )?.valueString || "";

  return (
    <>
      <div className={errorClass}>
        <FormField label={t("Calculation formula")}>
          <textarea
            data-testid="calculation-formula-testid"
            value={calculatedExpression}
            onChange={handleBlur}
            disabled={disabled}
          />
        </FormField>
      </div>
    </>
  );
};

export default CalculatedExpressionOption;
