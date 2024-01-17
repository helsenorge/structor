import { QuestionnaireItem } from "../../../../types/fhir";
import { useTranslation } from "react-i18next";
import { ActionType, Items, OrderItem } from "../../../../store/treeStore/treeStore";
import { ICodeSystem } from "../../../../types/IQuestionnareItemType";
import FormField from "../../../FormField/FormField";
import InputField from "../../../InputField/inputField";
import { 
    removeItemCode, 
    addItemCode, 
    getDisplayValuesFromAllMatchingCodes, 
    updateChildrenWithMatchingSystemAndCode, 
    getAllMatchingCodes 
} from "../../../../helpers/codeHelper";
import { useEffect, useState } from "react";
import Btn from "../../../Btn/Btn";

type ColumnNameOptionProps = {
    item: QuestionnaireItem;
    qItems: Items;
    qOrder: OrderItem[];
    dispatch: React.Dispatch<ActionType>;
};

export const ColumnNameOption = ({item, qItems, qOrder, dispatch}: ColumnNameOptionProps) => {
    const { t } = useTranslation();
    const existingColumnCodes = getDisplayValuesFromAllMatchingCodes(item, ICodeSystem.tableColumnName);
    const initialColumnCodesValues = existingColumnCodes.length > 0 ? existingColumnCodes : [''];
    const [columnNames, setColumnNames] = useState<string[]>(initialColumnCodesValues);

    const updateChildrenWithTableColumnCoding = (): void => {
        const allTableColumnNameCodings = getAllMatchingCodes(item, ICodeSystem.tableColumnName);
        if (allTableColumnNameCodings) {
            updateChildrenWithMatchingSystemAndCode(item, qItems, qOrder, allTableColumnNameCodings, ICodeSystem.tableColumn, dispatch);
        }
    }

    const removeAllColumnNameCodes = (item: QuestionnaireItem) => {
        item.code?.forEach((code) => {
            if (code.system === ICodeSystem.tableColumnName) {
                removeItemCode(item, ICodeSystem.tableColumnName, dispatch);
            }
        })
    };

    const addUpdatedColumnNameCodes = (updatedColumnNames: string[]) => {
        let columnOrder = 1;
        updatedColumnNames.forEach((columnName) => {
            addItemCode(
              item,
              {
                system: ICodeSystem.tableColumnName,
                code: columnOrder.toString(),
                display: columnName,
              },
              dispatch
            );
            columnOrder += 1;
          });
    };

    const onBlurInput = (newValue: string, index: number) => {
        const columnNamesCopy = [...columnNames];
        columnNamesCopy[index] = newValue;
        const arrayWithoutEmptyStrings = columnNamesCopy.filter((x) => x !== '');
        setColumnNames(arrayWithoutEmptyStrings);

        removeAllColumnNameCodes(item);
        addUpdatedColumnNameCodes(arrayWithoutEmptyStrings);
    };

    const onAddButtonClicked = (): void => {
        setColumnNames([...columnNames, '']);
    }

    const onDeleteButtonClicked = (index: number): void => {
        const columnNamesCopy = [...columnNames];
        const arrayWithoutDeletedColumn = columnNamesCopy.filter((columnName) => columnNamesCopy.indexOf(columnName) !== index);
        removeAllColumnNameCodes(item);
        addUpdatedColumnNameCodes(arrayWithoutDeletedColumn);
    };

    useEffect(() => {
        setColumnNames(initialColumnCodesValues);
        updateChildrenWithTableColumnCoding();
    }, [item.code]);

    return (
        <div className="horizontal full">
            <FormField label={t('Table columns')} sublabel={t('Add columns to the table')}>
                {columnNames.map((columnName, index) => (
                    <div key={columnName + index.toString()} className="columnNames-fieldWrapper">
                        <InputField
                            defaultValue={columnName}
                            placeholder={t('Enter column name..')}
                            onBlur={(e) => {onBlurInput(e.target.value, index)}}
                        />
                        {columnNames[index] !== '' &&
                            <button
                                className="columnNames-deleteButton" 
                                type="button" 
                                name={t('Remove element')} 
                                onClick={() => onDeleteButtonClicked(index)}
                            />
                        }
                    </div>
                ))}
                <div className="columnNames-addButton">
                    <Btn
                        title={t('+ Add column')}
                        type="button"
                        onClick={() => onAddButtonClicked()}
                        variant="secondary"
                    />
                </div>
            </FormField>
        </div>
    )
}