import FormField from "../../FormField/FormField";
import { QuestionnaireItem } from "../../../types/fhir";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../store/treeStore/treeStore";
import InputField from "../../InputField/inputField";
import { IExtentionType } from "../../../types/IQuestionnareItemType";
import { removeItemExtension, setItemExtension } from "../../../helpers/extensionHelper";

type PlaceholderOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const PlaceholderOption = ({item, dispatch}: PlaceholderOptionProps) => {
    const { t } = useTranslation();

    const getPlaceholder = item?.extension?.find((x) => x.url === IExtentionType.entryFormat)?.valueString ?? '';

    return (
        <FormField label={t('Placeholder text')}>
            <InputField
                defaultValue={getPlaceholder}
                onBlur={(e) => {
                    if (e.target.value) {
                        const extension = {
                            url: IExtentionType.entryFormat,
                            valueString: e.target.value,
                        }
                        setItemExtension(item, extension, dispatch);
                    } else {
                        removeItemExtension(item, IExtentionType.entryFormat, dispatch);
                    }
                }}
            />
        </FormField>
    )
}