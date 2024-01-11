import FormField from "../../../FormField/FormField";
import { Extension, QuestionnaireItem } from "../../../../types/fhir";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../store/treeStore/treeStore";
import RadioBtn from "../../../RadioBtn/RadioBtn";
import { IExtentionType } from "../../../../types/IQuestionnareItemType";
import { TableOptionsEnum } from "../../../../types/tableOptions";
import { TableColumnOrderingOption } from "./tableColumnOrdering-option";
import { ItemControlType, createItemControlExtension, existItemControlWithCode } from "../../../../helpers/itemControl";
import { removeItemExtension, setItemExtension } from "../../../../helpers/extensionHelper";
import { TableColumnToOrderByOption } from "./tableColumnToOrderBy-option";
import { TableColumnNameOption } from "./tableColumnName";

type TableOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const TableOption = ({item, dispatch}: TableOptionProps) => {
    const { t } = useTranslation();

    const getTableCode = (extension: Extension | undefined): string | undefined => {
        let stringToReturn: string | undefined = undefined;
        extension?.valueCodeableConcept?.coding?.find((coding) => {
            if (coding.code === TableOptionsEnum.GTable
                || coding.code === TableOptionsEnum.Table 
                || coding.code === TableOptionsEnum.TableHN1 
                || coding.code === TableOptionsEnum.TableHN2) {
            stringToReturn = coding.code
            }
        })
        return stringToReturn;
    };

    const checkedTableOption = (): string => {
        const tableCode = getTableCode(itemControlExtension) || TableOptionsEnum.None;
        return tableCode;
    };

    const onChangeTableOption = (newValue: string) => {
        let newExtension: Extension;
        switch (newValue) {
            case TableOptionsEnum.GTable:
                newExtension = createItemControlExtension(ItemControlType.gTable);
                setItemExtension(item, newExtension, dispatch);
                break;
            case TableOptionsEnum.Table:
                newExtension = createItemControlExtension(ItemControlType.table);
                setItemExtension(item, newExtension, dispatch);
                break;
            case TableOptionsEnum.TableHN1:
                newExtension = createItemControlExtension(ItemControlType.tableHN1);
                setItemExtension(item, newExtension, dispatch);
                break;
            case TableOptionsEnum.TableHN2:
                newExtension = createItemControlExtension(ItemControlType.tableHN2);
                setItemExtension(item, newExtension, dispatch);
                break;
            default:
                removeItemExtension(item, IExtentionType.itemControl, dispatch);
        }
    };

    const itemControlExtension = item.extension?.find((extension) => extension.url === IExtentionType.itemControl);
    const hasTableCode = existItemControlWithCode(item, getTableCode(itemControlExtension) || '');
    const tableOptions = [
        { code: TableOptionsEnum.None, display: t(`Don't display as a table`) },
        { code: TableOptionsEnum.GTable, display: t('Table with repeating groups displayed') },
        { code: TableOptionsEnum.Table, display: t('Table with answer options as columns') },
        { code: TableOptionsEnum.TableHN1, display: t('Table with question and answer in two columns') },
        { code: TableOptionsEnum.TableHN2, display: t('Table with custom columns and column headers') },
    ];
    const showColumnOptions: boolean = hasTableCode && checkedTableOption() === TableOptionsEnum.TableHN2;

    return (
        <>
            <FormField label={t('Table')} sublabel={t('Choose whether the group should be displayed as a table')}>
                <RadioBtn
                    onChange={onChangeTableOption}
                    checked={checkedTableOption()}
                    options={tableOptions}
                    name={'tableOption-radio'}
                />
            </FormField>
            {
               showColumnOptions && (
                <>
                    <TableColumnOrderingOption item={item} dispatch={dispatch} />
                    <TableColumnToOrderByOption item={item} dispatch={dispatch} />
                    <TableColumnNameOption item={item} dispatch={dispatch} />
                </>
               )
            }
        </>
    )
}

