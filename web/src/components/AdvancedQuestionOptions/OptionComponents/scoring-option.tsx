import { useState } from "react";
import { QSCoding } from "../../../helpers/QuestionHelper";
import { removeItemCode, addItemCode } from "../../../helpers/codeHelper";
import { existItemWithCode, scoreCoding } from "../../../helpers/itemControl";
import { ICodeSystem } from "../../../types/IQuestionnareItemType";
import { ScoringFormulaCodes } from "../../../types/scoringFormulas";
import { removeOrdinalValueExtensionfromAnswerOptions } from "../../../utils/answerOptionExtensionUtils";
import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";
import { QuestionnaireItem } from "../../../types/fhir";
import { ActionType } from "../../../store/treeStore/treeStore";
import { useTranslation } from "react-i18next";

type ScoringOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const ScoringOption = ({item, dispatch}: ScoringOptionProps) => {
    const { t } = useTranslation();
    const [hasQuestionScoreCode, setHasQuestionScoreCode] = useState(
        existItemWithCode(item, ScoringFormulaCodes.questionScore),
    );

    return (
        <>
            <div className="horizontal full">
                <FormField
                    label={t('Scoring')}
                    sublabel={t('Select whether the field should be a scoring field')}
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
                    label={t('Scoring field')}
                />
            </FormField>
        </>
    )
}