import { useTranslation } from "react-i18next";
import FormField from "../../FormField/FormField";
import RadioBtn from "../../RadioBtn/RadioBtn";
import { ICodeSystem, ICodingProperty,  } from "../../../types/IQuestionnareItemType";
import { useContext,  } from "react";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { QuestionnaireItem } from "fhir/r4";
import { updateItemCodePropertyWithCodeAction } from "../../../store/treeStore/treeActions";
import { SliderDisplayTypes } from "../../../helpers/codeHelper";

type Props = {
    item: QuestionnaireItem;
}

export const SliderLabels = ({item}: Props) => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const sliderDisplayTypeCoding = item.code?.find((cd) => cd.system === ICodeSystem.sliderDisplayType);

    return (<FormField label={t('Valuetype to display')}>
        <RadioBtn
            onChange={(newValue) => {
                if(sliderDisplayTypeCoding && sliderDisplayTypeCoding.code){
                    dispatch(updateItemCodePropertyWithCodeAction(item.linkId, ICodingProperty.code,  newValue, ICodeSystem.sliderDisplayType, sliderDisplayTypeCoding.code ))
                }
            }}
            checked={sliderDisplayTypeCoding?.code}
            options={[
                {
                    code: SliderDisplayTypes.Label,
                    display: t('Title values'),
                },
                {
                    code: SliderDisplayTypes.OrdinalValue,
                    display: t('Decimal values'),
                },
            ]}
            name="choice-slider-display-value-radio"
        />
    </FormField>)
}