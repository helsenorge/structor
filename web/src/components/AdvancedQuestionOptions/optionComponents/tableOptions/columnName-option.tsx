import { QuestionnaireItem } from "../../../../types/fhir";
import { useTranslation } from "react-i18next";
import { ActionType, Items, OrderItem } from "../../../../store/treeStore/treeStore";
import { ICodeSystem, ICodingProperty } from "../../../../types/IQuestionnareItemType";
import FormField from "../../../FormField/FormField";
import InputField from "../../../InputField/inputField";
import { 
    removeItemCode2, 
    addItemCode,
    updateChildrenWithMatchingSystemAndCode, 
    getAllMatchingCodes,
} from "../../../../helpers/codeHelper";
import { useEffect } from "react";
import Btn from "../../../Btn/Btn";
import { updateItemCodePropertyAction2 } from "../../../../store/treeStore/treeActions";

type ColumnNameOptionProps = {
    item: QuestionnaireItem;
    qItems: Items;
    qOrder: OrderItem[];
    dispatch: React.Dispatch<ActionType>;
};

export const ColumnNameOption = ({item, qItems, qOrder, dispatch}: ColumnNameOptionProps) => {
    const { t } = useTranslation();
    const existingColumnCodes = getAllMatchingCodes(item, ICodeSystem.tableColumnName);
    const lastItem = existingColumnCodes && existingColumnCodes[existingColumnCodes?.length -1];

    const onBlurNameInput = (oldCodeValue: string, newDisplayValue: string): void => {
        if (newDisplayValue === '') {
            return;
        }
        dispatch(updateItemCodePropertyAction2(
            item.linkId, 
            ICodingProperty.display, 
            newDisplayValue, 
            ICodeSystem.tableColumnName,
            oldCodeValue));
    };

    const onAddButtonClicked = (): void => {
        const previousCode = lastItem?.code;
        const newCode = previousCode ? parseInt(previousCode) + 1 : 1;
        
        addItemCode(
            item,
            {
              system: ICodeSystem.tableColumnName,
              code: newCode.toString(),
              display: '',
            },
            dispatch
          );
    }

    const onDeleteButtonClicked = (code: string): void => {
        removeItemCode2(item, ICodeSystem.tableColumnName, code, dispatch);
    };

    const updateChildrenWithTableColumnCoding = (): void => {
        const allTableColumnNameCodings = getAllMatchingCodes(item, ICodeSystem.tableColumnName);
        if (allTableColumnNameCodings) {
            updateChildrenWithMatchingSystemAndCode(item, qItems, qOrder, allTableColumnNameCodings, ICodeSystem.tableColumn, dispatch);
        }
    }

    useEffect(() => {
        // setColumnNamesCodings(initialColumnCodesValues);
        updateChildrenWithTableColumnCoding();
    }, [item.code]);

    return (
        <div className="horizontal full">
            <FormField label={t('Table columns')} sublabel={t('Add columns to the table')}>
                {existingColumnCodes?.map((coding, index) => (
                    <div key={coding.display + index.toString()} className="columnNames-fieldWrapper">
                        <InputField
                            defaultValue={coding.display}
                            placeholder={t('Enter column name..')}
                            onBlur={(e) => {onBlurNameInput(coding.code || '', e.target.value)}}
                        />
                        {
                            <button
                                className="columnNames-deleteButton" 
                                type="button" 
                                name={t('Remove element')} 
                                onClick={() => onDeleteButtonClicked(coding.code || '')}
                            />
                        }
                    </div>
                ))}
                <div className="columnNames-addButton">
                    <Btn
                        title={t('+ Add column')}
                        type="button"
                        onClick={() => onAddButtonClicked()}
                        variant={"secondary"}
                    />
                </div>
            </FormField>
        </div>
    )
}