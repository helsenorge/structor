import { useContext, useState } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { ICodeSystem } from "../../../types/IQuestionnareItemType";
import { ScoringFormulaCodes } from "../../../types/scoringFormulas";

import { addItemCode, removeItemCodes } from "../../../helpers/codeHelper";
import { existItemWithCode, scoreCoding } from "../../../helpers/itemControl";
import { QSCoding } from "../../../helpers/QuestionHelper";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { removeOrdinalValueExtensionfromAnswerOptions } from "../../../utils/answerOptionExtensionUtils";
import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type ScoringOptionProps = {
  item: QuestionnaireItem;
};

export const ScoringOption = ({
  item,
}: ScoringOptionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const [hasQuestionScoreCode, setHasQuestionScoreCode] = useState(
    existItemWithCode(item, ScoringFormulaCodes.questionScore),
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
            removeItemCodes(
              item,
              [ICodeSystem.scoringFormulas, ICodeSystem.score],
              dispatch,
            );
            if (hasQuestionScoreCode) {
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
