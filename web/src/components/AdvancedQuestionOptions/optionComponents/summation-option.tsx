import { useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { ScoringFormulaCodes } from "src/types/scoringFormulas";

import { ICodeSystem } from "../../../types/IQuestionnareItemType";

import { addItemCode, removeItemCodes } from "../../../helpers/codeHelper";
import { scoreCoding } from "../../../helpers/itemControl";
import { scoreSumOptions } from "../../../helpers/QuestionHelper";
import { TreeContext } from "../../../store/treeStore/treeStore";
import {
  getScoringFormulaName,
  getSelectedScoringCode,
} from "../../../utils/scoringUtils";
import FormField from "../../FormField/FormField";
import RadioBtn from "../../RadioBtn/RadioBtn";

type SummationOptionProps = {
  item: QuestionnaireItem;
};

export const SummationOption = ({
  item,
}: SummationOptionProps): JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

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
            removeItemCodes(
              item,
              [ICodeSystem.scoringFormulas, ICodeSystem.score],
              dispatch,
            );
            if (
              newValue === ScoringFormulaCodes.sectionScore ||
              newValue === ScoringFormulaCodes.totalScore
            ) {
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
