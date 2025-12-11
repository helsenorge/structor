import { useTranslation } from "react-i18next";

import type { ActionType } from "../../../store/treeStore/treeStore";
import { IItemProperty } from "../../../types/IQuestionnareItemType";
import type { QuestionnaireItem } from "fhir/r4";

import { updateItemAction } from "../../../store/treeStore/treeActions";
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
                e.target.value,
              ),
            );
          }}
        />
      </FormField>
    </div>
  );
};
