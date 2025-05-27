import React, { useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IItemProperty } from "../../../types/IQuestionnareItemType";

import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import UriField from "../../FormField/UriField";

type DefinitionOptionProps = {
  item: QuestionnaireItem;
};

export const DefinitionOption = ({
  item,
}: DefinitionOptionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  return (
    <div className="horizontal full">
      <FormField label={t("Definition")}>
        <UriField
          testId="definition-testid"
          value={item.definition}
          onBlur={(e) => {
            dispatch(
              updateItemAction(
                item.linkId,
                IItemProperty.definition,
                e.target.value,
              ),
            );
          }}
        />
      </FormField>
    </div>
  );
};
