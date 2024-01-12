import { removeItemCode, addItemCode } from "../../../../helpers/codeHelper";
import { ICodeSystem } from "../../../../types/IQuestionnareItemType";
import FormField from "../../../FormField/FormField";
import { Coding } from "@helsenorge/refero/types/fhir";
import { useEffect } from "react";
import { QuestionnaireItem } from "../../../../types/fhir";
import { ActionType } from "../../../../store/treeStore/treeStore";
import { useTranslation } from "react-i18next";
import { TableColumnOrderingOptionsEnum } from "../../../../types/tableOptions";
import RadioBtn from "../../../RadioBtn/RadioBtn";
import { existItemWithSystem } from "../../../../helpers/itemControl";

type ColumnOrderingFunctionOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const ColumnOrderingFunctionOption = ({item, dispatch}: ColumnOrderingFunctionOptionProps) => {
    const { t } = useTranslation();
    const columnOrderingOptions = [
        { code: TableColumnOrderingOptionsEnum.Descending, display: t('Descending') },
        { code: TableColumnOrderingOptionsEnum.Ascending, display: t(`Ascending`) },
    ];

    const addDefaultColumnOrdering = () => {
        const columnCodeExist = existItemWithSystem(item, ICodeSystem.tableOrderingFunctions);
        if (!columnCodeExist) {
            const defaultColumnOrdering: Coding = {
                system: ICodeSystem.tableOrderingFunctions,
                code: TableColumnOrderingOptionsEnum.Descending,
                display: 'Descending',
            }
            addItemCode(item, defaultColumnOrdering, dispatch);
        }
    };

    useEffect(() => {
        addDefaultColumnOrdering();
    }, []);

    const onChangeColumnOrderingOption = (newValue: string) => {
        removeItemCode(item,ICodeSystem.tableOrderingFunctions, dispatch);
        let columnOrderingCoding: Coding = {};
        switch (newValue) {
            case TableColumnOrderingOptionsEnum.Ascending:
                columnOrderingCoding = {
                    system: ICodeSystem.tableOrderingFunctions,
                    code: TableColumnOrderingOptionsEnum.Ascending,
                    display: 'Ascending',
                }
                break;
            default:
                columnOrderingCoding = {
                    system: ICodeSystem.tableOrderingFunctions,
                    code: TableColumnOrderingOptionsEnum.Descending,
                    display: 'Descending',
                }
                break;
        }
        addItemCode(item, columnOrderingCoding, dispatch);
    }

    const checkedColumnOrderingOption = () => {
        const itemWithColumnOrderingSystem = item.code?.find((code) => code.system === ICodeSystem.tableOrderingFunctions);
        if (itemWithColumnOrderingSystem && itemWithColumnOrderingSystem.code === TableColumnOrderingOptionsEnum.Ascending) {
            return TableColumnOrderingOptionsEnum.Ascending
        } else {
            return TableColumnOrderingOptionsEnum.Descending
        }
    };

    return(
        <div className="horizontal full">
            <FormField
                label={t('Ordering function')}
                sublabel={t(`Select the default ordering function when ordering by a table column`)}
            >
                <RadioBtn
                onChange={onChangeColumnOrderingOption}
                checked={checkedColumnOrderingOption()}
                options={columnOrderingOptions}
                name={'tableColumnOrderingOption-radio'}
                />
            </FormField>
        </div>
    )
}