import { scoreCoding, scoreSumOptions } from "../../../helpers/QuestionHelper";
import { removeItemCode, addItemCode } from "../../../helpers/codeHelper";
import { ICodeSystem } from "../../../types/IQuestionnareItemType";
import FormField from "../../FormField/FormField";
import { QuestionnaireItem } from "../../../types/fhir";
import { ActionType } from "../../../store/treeStore/treeStore";
import { useTranslation } from "react-i18next";
import RadioBtn from "../../RadioBtn/RadioBtn";
import { getScoringFormulaName, getSelectedScoringCode } from "../../../utils/scoringUtils";

type SummationOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const SummationOption = ({item, dispatch}: SummationOptionProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="horizontal full">
                <FormField
                    label={t('Summation field')}
                    sublabel={t(
                        'Select whether the field should be a summation field for section score or total score',
                    )}
                ></FormField>
            </div>
            <FormField>
                <RadioBtn
                    onChange={(newValue: string) => {
                        if (newValue === '0') {
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
                    checked={item.code ? getSelectedScoringCode(item.code) : '0'}
                    options={scoreSumOptions}
                    name={'scoreSumOptions-radio'}
                />
            </FormField>
        </>
    )
}