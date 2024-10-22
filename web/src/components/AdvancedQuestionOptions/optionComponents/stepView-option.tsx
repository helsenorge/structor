import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  ItemControlType,
  setItemControlExtension,
} from "../../../helpers/itemControl";
import { ActionType } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type StepViewOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const StepViewOption = ({
  item,
  dispatch,
}: StepViewOptionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div className="horizontal full">
        <FormField
          label={t("Step-view")}
          sublabel={t("Select whether the group should be a step in step-view")}
        ></FormField>
      </div>
      <FormField>
        <SwitchBtn
          onChange={() => {
            setItemControlExtension(item, ItemControlType.step, dispatch);
          }}
          value={
            item.extension?.find((ex) =>
              ex.valueCodeableConcept?.coding?.find(
                (coding) => coding.code === ItemControlType.step,
              ),
            )
              ? true
              : false
          }
          label={t("Step in step-view")}
        />
      </FormField>
    </>
  );
};
