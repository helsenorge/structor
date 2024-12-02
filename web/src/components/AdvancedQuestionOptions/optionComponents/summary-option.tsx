import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  setItemControlExtension,
  ItemControlType,
  isItemControlSummary,
  isItemControlSummaryContainer,
} from "../../../helpers/itemControl";
import { ActionType } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type SummaryOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const SummaryOption = ({
  item,
  dispatch,
}: SummaryOptionProps): JSX.Element => {
  const { t } = useTranslation();

  const hasSummaryExtension = isItemControlSummary(item);
  const hasSummaryContainerExtension = isItemControlSummaryContainer(item);

  return (
    <div>
      <FormField>
        <SwitchBtn
          onChange={() => {
            setItemControlExtension(item, ItemControlType.summary, dispatch);
          }}
          value={hasSummaryExtension}
          label={t("Put in PDF first")}
        />
      </FormField>
      <FormField>
        <SwitchBtn
          onChange={() => {
            setItemControlExtension(
              item,
              ItemControlType.summaryContainer,
              dispatch
            );
          }}
          value={hasSummaryContainerExtension}
          label={t("Mark group in PDF")}
        />
      </FormField>
    </div>
  );
};
