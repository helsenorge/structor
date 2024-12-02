import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IItemProperty } from "../../../types/IQuestionnareItemType";

import { updateItemAction } from "../../../store/treeStore/treeActions";
import { ActionType } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import UriField from "../../FormField/UriField";

type DefinitionOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const DefinitionOption = ({
  item,
  dispatch,
}: DefinitionOptionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="horizontal full">
      <FormField label={t("Definition")} isOptional>
        <UriField
          value={item.definition}
          onBlur={(e) => {
            dispatch(
              updateItemAction(
                item.linkId,
                IItemProperty.definition,
                e.target.value
              )
            );
          }}
        />
      </FormField>
    </div>
  );
};
