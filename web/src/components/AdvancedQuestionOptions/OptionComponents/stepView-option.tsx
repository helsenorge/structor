import FormField from "../../FormField/FormField";
import { QuestionnaireItem } from "../../../types/fhir";
import { useTranslation } from "react-i18next";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";
import { ActionType } from "../../../store/treeStore/treeStore";
import { ItemControlType, setItemControlExtension } from "../../../helpers/itemControl";

type StepViewOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const StepViewOption = ({item, dispatch}: StepViewOptionProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="horizontal full">
                <FormField
                    label={t('Step-view')}
                    sublabel={t('Select whether the group should be a step in step-view')}
                ></FormField>
            </div>
            <FormField>
                <SwitchBtn
                    onChange={() => {
                        setItemControlExtension(item, ItemControlType.step, dispatch);
                    }}
                    value={
                        item.extension?.find((ex) =>
                            ex.valueCodeableConcept?.coding?.find(
                                (coding) => coding.code === ItemControlType.step,
                            ),
                        )
                            ? true
                            : false
                    }
                    label={t('Step in step-view')}
                />
            </FormField>
        </>
    )
}