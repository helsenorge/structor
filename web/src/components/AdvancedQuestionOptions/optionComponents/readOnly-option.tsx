import { useTranslation } from "react-i18next";

import type { ActionType } from "../../../store/treeStore/treeStore";
import { IItemProperty } from "../../../types/IQuestionnareItemType";
import type { QuestionnaireItem } from "fhir/r4";

import { updateItemAction } from "../../../store/treeStore/treeActions";
import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type ReadOnlyOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
  isDataReceiver: boolean;
};

export const ReadOnlyOption = ({
  item,
  dispatch,
  isDataReceiver,
}: ReadOnlyOptionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div className="horizontal equal">
        <FormField>
          <SwitchBtn
            onChange={() =>
              dispatch(
                updateItemAction(
                  item.linkId,
                  IItemProperty.readOnly,
                  !item.readOnly,
                ),
              )
            }
            value={item.readOnly || false}
            label={t("Read-only")}
            disabled={isDataReceiver}
          />
        </FormField>
      </div>
    </>
  );
};
