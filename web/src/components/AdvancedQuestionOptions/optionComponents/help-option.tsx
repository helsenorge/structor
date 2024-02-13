import FormField from "../../FormField/FormField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";
import { QuestionnaireItem } from "fhir/r4";
import { ActionType, Items, OrderItem } from "../../../store/treeStore/treeStore";
import { useTranslation } from "react-i18next";
import { canTypeHaveHelp } from "../../../helpers/questionTypeFeatures";
import { deleteItemAction, newItemHelpIconAction, updateItemAction } from "../../../store/treeStore/treeActions";
import { getHelpText, isItemControlHelp } from "../../../helpers/itemControl";
import MarkdownEditor from "../../MarkdownEditor/MarkdownEditor";
import { createMarkdownExtension } from "../../../helpers/extensionHelper";
import { IItemProperty } from "../../../types/IQuestionnareItemType";
import { findTreeArray } from "../../../store/treeStore/findTreeArray";

type HelpOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
    parentArray: Array<string>;
    qItems: Items;
    qOrder: OrderItem[];
};

export const HelpOption = ({item, dispatch, parentArray, qItems, qOrder}: HelpOptionProps) => {
    const { t } = useTranslation();

    const getHelpTextItem = (): QuestionnaireItem | undefined => {
        const selfArray = findTreeArray(parentArray, qOrder);
        const selfOrder = selfArray.find((node) => node.linkId === item.linkId)?.items || [];
        const helpItem = selfOrder.find((child) => isItemControlHelp(qItems[child.linkId]));
        return helpItem ? qItems[helpItem.linkId] : undefined;
    };

    const getHelpTextForItem = (): string => {
        const helpItem = getHelpTextItem();
        return helpItem ? getHelpText(helpItem) : '';
    };

    const dispatchHelpText = () => {
        const helpItem = getHelpTextItem();
        if (helpItem) {
            dispatch(deleteItemAction(helpItem.linkId, [...parentArray, item.linkId]));
        } else {
            dispatch(newItemHelpIconAction([...parentArray, item.linkId]));
        }
    };

    const dispatchUpdateItemHelpText = (id: string, value: string) => {
        const newValue = createMarkdownExtension(value);
        dispatch(updateItemAction(id, IItemProperty._text, newValue));
    };

    const handleHelpText = (markdown: string): void => {
        const helpItem = getHelpTextItem();
        if (helpItem) {
            dispatchUpdateItemHelpText(helpItem.linkId, markdown);
        }
    };

    const helpTextItem = getHelpTextItem();

    return (
        <>
            {canTypeHaveHelp(item) && (
                <>
                    <div className="horizontal full">
                        <FormField
                            label={t('Help')}
                            sublabel={t('Select whether you want to give the user a help text')}
                        ></FormField>
                    </div>
                    <FormField>
                        <SwitchBtn onChange={() => dispatchHelpText()} value={!!helpTextItem} label={t('Help icon')} />
                    </FormField>
                    {!!helpTextItem && (
                        <FormField label={t('Enter a helping text')}>
                            <MarkdownEditor data={getHelpTextForItem()} onBlur={handleHelpText} />
                        </FormField>
                    )}
                </>
            )}
        </>
    )
}