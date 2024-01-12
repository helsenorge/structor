import { ActionType } from "../../../store/treeStore/treeStore";
import { IItemProperty } from "../../../types/IQuestionnareItemType";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import FormField from "../../FormField/FormField";
import UriField from "../../FormField/UriField";
import { useTranslation } from "react-i18next";
import { QuestionnaireItem } from "../../../types/fhir";

type DefinitionOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const DefinitionOption = ({item, dispatch}: DefinitionOptionProps) => {
    const { t } = useTranslation();

    return (
        <div className="horizontal full">
            <FormField label={t('Definition')} isOptional>
                <UriField
                    value={item.definition}
                    onBlur={(e) => {
                        dispatch(updateItemAction(item.linkId, IItemProperty.definition, e.target.value));
                    }}
                />
            </FormField>
        </div>
    )
}