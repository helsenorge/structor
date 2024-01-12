import { QuestionnaireItem } from "../../../../types/fhir";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../store/treeStore/treeStore";
import { ICodeSystem } from "../../../../types/IQuestionnareItemType";
import FormField from "../../../FormField/FormField";
import InputField from "../../../InputField/inputField";
import { removeItemCode, addItemCode } from "../../../../helpers/codeHelper";

type ColumnNameOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const ColumnNameOption = ({item, dispatch}: ColumnNameOptionProps) => {
    const { t } = useTranslation();

    const onBlurInput = (newValue: string) => {
        removeItemCode(item, ICodeSystem.tableColumnName, dispatch);
        addItemCode(
            item, 
            {
                system: ICodeSystem.tableColumnName,
                code: newValue,
                display: newValue,
            }, 
            dispatch
        );
    }

    return (
        <div className="horizontal full">
            <FormField label={t('Table columns')} sublabel={t('Add columns to the table')}>
                <InputField
                    defaultValue={''}
                    placeholder={t('Enter column name..')}
                    onBlur={(e) => {onBlurInput(e.target.value)}}
                />
            </FormField>
        </div>
    )
}