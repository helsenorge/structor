import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { ICodeSystem } from "../../../types/IQuestionnareItemType";

import {
  addValidateReadOnlyItemCode,
  getItemCodeWithMatchingSystemAndCode,
  removeItemCode,
  ValidationOptionsCodes,
} from "../../../helpers/codeHelper";
import { ActionType } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type ValidateReadOnlyOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const ValidateReadOnlyOption = ({
  item,
  dispatch,
}: ValidateReadOnlyOptionProps) => {
  const { t } = useTranslation();

  const validateReadOnlyCode = getItemCodeWithMatchingSystemAndCode(
    item,
    ICodeSystem.validationOptions,
    ValidationOptionsCodes.validateReadOnly,
  );

  return (
    <>
      <div className="horizontal equal">
        <FormField>
          <SwitchBtn
            onChange={() => {
              if (validateReadOnlyCode) {
                removeItemCode(item, ICodeSystem.validationOptions, dispatch);
              } else {
                addValidateReadOnlyItemCode(
                  item,
                  ValidationOptionsCodes.validateReadOnly,
                  dispatch,
                );
              }
            }}
            value={!!validateReadOnlyCode || false}
            label={t("Read-only can be validated")}
          />
        </FormField>
      </div>
    </>
  );
};
