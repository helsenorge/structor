import { ActionType } from "../../../store/treeStore/treeStore";
import { IItemProperty } from "../../../types/IQuestionnareItemType";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import FormField from "../../FormField/FormField";
import { useTranslation } from "react-i18next";
import { QuestionnaireItem } from "fhir/r4";
import InputField from "../../InputField/inputField";

type PrefixOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const PrefixOption = ({item, dispatch}: PrefixOptionProps) => {
    const { t } = useTranslation();

    return (
        <div className="horizontal full">
            <FormField label={t('Prefix')} isOptional>
                <InputField
                    defaultValue={item.prefix}
                    onBlur={(e) => {
                        dispatch(updateItemAction(item.linkId, IItemProperty.prefix, e.target.value));
                    }}
                />
            </FormField>
        </div>
    )
}