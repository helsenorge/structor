import { removeItemCode, addItemCode } from "../../../../helpers/codeHelper";
import { ICodeSystem } from "../../../../types/IQuestionnareItemType";
import FormField from "../../../FormField/FormField";
import { QuestionnaireItem } from "../../../../types/fhir";
import { ActionType } from "../../../../store/treeStore/treeStore";
import { useTranslation } from "react-i18next";
import Select from "../../../Select/Select";
import { createOptionsFromQItemCode, getDisplayValueInOption, getSelectedValue } from "../../../../utils/optionsUtils";

type ColumnToOrderByOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const ColumnToOrderByOption = ({item, dispatch}: ColumnToOrderByOptionProps) => {
    const { t } = useTranslation();

    const options = createOptionsFromQItemCode(item, ICodeSystem.tableColumnName);

    const onChangeOption = (newValue: string) => {
        removeItemCode(item, ICodeSystem.tableOrderingColumn, dispatch);
        addItemCode(
            item, 
            {
                system: ICodeSystem.tableOrderingColumn,
                code: newValue,
                display: getDisplayValueInOption(options, newValue),
            }, 
            dispatch
        );
    }

    return (
        <div className="horizontal full">
            <FormField
                label={t('Ordering column')}
                sublabel={t('Select the column to order the table by')}
            >
            <Select
                placeholder={t('Choose a column:')}
                options={options}
                value={getSelectedValue(item, ICodeSystem.tableOrderingColumn)}
                onChange={(e) => onChangeOption(e.target.value)}
            />
            </FormField>
        </div>
    )
}