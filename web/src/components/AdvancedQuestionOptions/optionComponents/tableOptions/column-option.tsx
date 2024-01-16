import { useTranslation } from "react-i18next";
import { removeItemCode, addItemCode, getItemCode } from "../../../../helpers/codeHelper";
import { ActionType } from "../../../../store/treeStore/treeStore";
import { ICodeSystem } from "../../../../types/IQuestionnareItemType";
import FormField from "../../../FormField/FormField";
import { QuestionnaireItem } from "../../../../types/fhir";
import Select from "../../../Select/Select";
import { createOptionsFromQItemCode, getDisplayValueInOption, getSelectedValue } from "../../../../utils/optionsUtils";

type ColumnOptionProps = {
    item: QuestionnaireItem;
    parentItem: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const ColumnOption = ({item, parentItem, dispatch}: ColumnOptionProps) => {
    const { t } = useTranslation();

    const options = createOptionsFromQItemCode(parentItem, ICodeSystem.tableColumnName);

    const onChangeOption = (newValue: string) => {
        removeItemCode(item, ICodeSystem.tableColumn, dispatch);
        addItemCode(
            item, 
            {
                system: ICodeSystem.tableColumn,
                code: newValue,
                display: getDisplayValueInOption(options, newValue),
            }, 
            dispatch
        );
    }

    const blablubb = () => {
        const hei = getItemCode(parentItem, ICodeSystem.tableColumn);
        const hei2 = getItemCode(item, ICodeSystem.tableColumn);
    }


    return (
        <div className="horizontal full">
            <FormField
                label={t('Table column')}
                sublabel={t('Select a table column to link the item to')}
            >
            <Select
                placeholder={t('Choose a column:')}
                options={options}
                value={getSelectedValue(item, ICodeSystem.tableColumn)}
                onChange={(e) => onChangeOption(e.target.value)}
            />
            </FormField>
        </div>
    )
}