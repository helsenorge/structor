import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { ICodeSystem } from "../../../types/IQuestionnareItemType";

import { removeItemCode, addItemCode } from "../../../helpers/codeHelper";
import { scoreCoding } from "../../../helpers/itemControl";
import { scoreSumOptions } from "../../../helpers/QuestionHelper";
import { ActionType } from "../../../store/treeStore/treeStore";
import {
  getScoringFormulaName,
  getSelectedScoringCode,
} from "../../../utils/scoringUtils";
import FormField from "../../FormField/FormField";
import RadioBtn from "../../RadioBtn/RadioBtn";

type SummationOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const SummationOption = ({ item, dispatch }: SummationOptionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="horizontal full">
        <FormField
          label={t("Summation field")}
          sublabel={t(
            "Select whether the field should be a summation field for section score or total score",
          )}
        ></FormField>
      </div>
      <FormField>
        <RadioBtn
          onChange={(newValue: string) => {
            if (newValue === "0") {
              removeItemCode(item, ICodeSystem.scoringFormulas, dispatch);
              removeItemCode(item, ICodeSystem.score, dispatch);
            } else {
              removeItemCode(item, ICodeSystem.scoringFormulas, dispatch);
              removeItemCode(item, ICodeSystem.score, dispatch);
              addItemCode(item, scoreCoding, dispatch);
              addItemCode(
                item,
                {
                  system: ICodeSystem.scoringFormulas,
                  code: newValue,
                  display: getScoringFormulaName(newValue),
                },
                dispatch,
              );
            }
          }}
          checked={item.code ? getSelectedScoringCode(item.code) : "0"}
          options={scoreSumOptions}
          name={"scoreSumOptions-radio"}
        />
      </FormField>
    </>
  );
};
