import { useTranslation } from "react-i18next";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";
import { QuestionnaireItem } from "fhir/r4";
import { ICodeSystem, ICodingProperty } from "../../../types/IQuestionnareItemType";
import { updateItemCodePropertyWithCodeAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { useContext } from "react";
import { SliderLabelEnum } from "../../../helpers/codeHelper";

type Props = {
    item: QuestionnaireItem;

}

export const SliderMinMaxLabels = ({item}: Props) => {
    const { t } = useTranslation();
    const { dispatch} = useContext(TreeContext);
    const leftLabel = item.code?.find((cd) => cd.system === ICodeSystem.sliderLabels && cd.code === SliderLabelEnum.LabelLeft);
    const rightLabel = item.code?.find((cd) => cd.system === ICodeSystem.sliderLabels && cd.code === SliderLabelEnum.LabelRight);


    const handleSetMaxLabel = (event: React.FocusEvent<HTMLInputElement>) => {
        dispatch(updateItemCodePropertyWithCodeAction(item.linkId, ICodingProperty.display, event.target.value, ICodeSystem.sliderLabels, SliderLabelEnum.LabelRight))
    }
    const handleSetMinLabel = (event: React.FocusEvent<HTMLInputElement>) => {
        dispatch(updateItemCodePropertyWithCodeAction(item.linkId, ICodingProperty.display, event.target.value, ICodeSystem.sliderLabels, SliderLabelEnum.LabelLeft))
    }

    return (
        <div>
            <FormField label={t('Min label')}>
                <InputField
                    name="slider-min-label"
                    onBlur={handleSetMinLabel}
                    placeholder={t('Enter a displayvalue for min..')}
                    defaultValue={rightLabel?.display}
                />
                </FormField>
                <FormField label={t('Maks label')}>
                <InputField
                    name="slider-max-label"
                    onBlur={handleSetMaxLabel}
                    placeholder={t('Enter a displayvalue for max..')}
                    defaultValue={leftLabel?.display}
                />
                </FormField>
        </div>
    );
}