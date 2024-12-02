import { useState } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { ICodeSystem } from "../../../types/IQuestionnareItemType";
import { ScoringFormulaCodes } from "../../../types/scoringFormulas";

import { removeItemCode, addItemCode } from "../../../helpers/codeHelper";
import { existItemWithCode, scoreCoding } from "../../../helpers/itemControl";
import { QSCoding } from "../../../helpers/QuestionHelper";
import { ActionType } from "../../../store/treeStore/treeStore";
import { removeOrdinalValueExtensionfromAnswerOptions } from "../../../utils/answerOptionExtensionUtils";
import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type ScoringOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const ScoringOption = ({
  item,
  dispatch,
}: ScoringOptionProps): JSX.Element => {
  const { t } = useTranslation();
  const [hasQuestionScoreCode, setHasQuestionScoreCode] = useState(
    existItemWithCode(item, ScoringFormulaCodes.questionScore)
  );

  return (
    <>
      <div className="horizontal full">
        <FormField
          label={t("Scoring")}
          sublabel={t("Select whether the field should be a scoring field")}
        ></FormField>
      </div>
      <FormField>
        <SwitchBtn
          onChange={() => {
            if (hasQuestionScoreCode) {
              removeItemCode(item, ICodeSystem.score, dispatch);
              removeItemCode(item, ICodeSystem.scoringFormulas, dispatch);
              removeOrdinalValueExtensionfromAnswerOptions(item, dispatch);
              setHasQuestionScoreCode(false);
            } else {
              addItemCode(item, scoreCoding, dispatch);
              addItemCode(item, QSCoding, dispatch);
              setHasQuestionScoreCode(true);
            }
          }}
          value={hasQuestionScoreCode}
          label={t("Scoring field")}
        />
      </FormField>
    </>
  );
};
