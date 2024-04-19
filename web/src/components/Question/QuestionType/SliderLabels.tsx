import { useTranslation } from "react-i18next";
import { ItemControlType } from "../../../helpers/itemControl";
import FormField from "../../FormField/FormField";
import RadioBtn from "../../RadioBtn/RadioBtn";
import { IExtensionType } from "../../../types/IQuestionnareItemType";
import { useContext, useEffect } from "react";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { addItemCode } from "../../../helpers/codeHelper";
import { QuestionnaireItem } from "fhir/r4";

type Props = {
    item: QuestionnaireItem;
}

export const SliderLabels = ({item}: Props) => {

    const { t } = useTranslation();
    const { dispatch, state } = useContext(TreeContext);
    // console.log(JSON.stringify(state, null, 2))
    useEffect(() => {
        addItemCode(item, {
            code: IExtensionType.valueSetLabel,
            display: t('Display value'),
        }, dispatch)
    },[dispatch, item, t]);
    return (<FormField label={t('Valuetype to display')}>
        <RadioBtn
            onChange={(newValue: string) => {
                console.log('newValue', newValue)

            }}
            checked={IExtensionType.valueSetLabel}
            options={[
                {
                    code: IExtensionType.valueSetLabel,
                    display: t('Display value'),
                },
                {
                    code: IExtensionType.ordinalValue,
                    display: t('Ordinal value'),
                },
            ]}
            name="choice-item-control-radio"
        />
    </FormField>)
}