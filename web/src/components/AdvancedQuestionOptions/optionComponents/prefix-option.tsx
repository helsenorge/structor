import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IItemProperty } from "../../../types/IQuestionnareItemType";

import { updateItemAction } from "../../../store/treeStore/treeActions";
import { ActionType } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

type PrefixOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const PrefixOption = ({
  item,
  dispatch,
}: PrefixOptionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="horizontal full">
      <FormField label={t("Prefix")} isOptional>
        <InputField
          defaultValue={item.prefix}
          onBlur={(e) => {
            dispatch(
              updateItemAction(
                item.linkId,
                IItemProperty.prefix,
                e.target.value
              )
            );
          }}
        />
      </FormField>
    </div>
  );
};
