import { Extension, QuestionnaireItem } from '../types/fhir';
import { IExtentionType, IQuestionnaireItemType, IValueSetSystem, IItemProperty } from '../types/IQuestionnareItemType';
import { getEnumKeyByString } from './enumHelper';
import { ActionType } from '../store/treeStore/treeStore';
import { updateItemAction } from '../store/treeStore/treeActions';

export enum ItemControlType {
    inline = 'inline',
    help = 'help',
    sidebar = 'sidebar',
    dropdown = 'drop-down',
    autocomplete = 'autocomplete',
    highlight = 'highlight',
    summary = 'summary',
    summaryContainer = 'summary-container',
    checkbox = 'check-box',
    radioButton = 'radio-button',
    yearMonth = 'yearMonth',
    year = 'year',
    receiverComponent = 'receiver-component',
    dynamic = 'dynamic',
}

export const createItemControlExtension = (itemControlType: ItemControlType): Extension => {
    return {
        url: IExtentionType.itemControl,
        valueCodeableConcept: {
            coding: [
                {
                    system: IValueSetSystem.itemControlValueSet,
                    code: itemControlType,
                },
            ],
        },
    };
};

const getItemControlType = (item?: QuestionnaireItem): ItemControlType | undefined => {
    const itemControlExtension = item?.extension?.find((x) => x.url === IExtentionType.itemControl);
    if (itemControlExtension) {
        const code = itemControlExtension.valueCodeableConcept?.coding
            ? itemControlExtension.valueCodeableConcept.coding[0].code
            : undefined;

        if (code) {
            const key = getEnumKeyByString(ItemControlType, code);
            return key ? ItemControlType[key] : undefined;
        }
    }
    return undefined;
};

const getItemControlIndex = (item: QuestionnaireItem, code: string): number => {
    const itemControlExtension = item.extension?.filter((x: Extension) => x.url === IExtentionType.itemControl);
    if (itemControlExtension) {
        return itemControlExtension.findIndex((x: Extension) => x.valueCodeableConcept?.coding?.[0].code === code);
    }
    return -1;
};

export const isIgnorableItem = (item: QuestionnaireItem, parentItem?: QuestionnaireItem): boolean => {
    return isItemControlHelp(item) || isItemControlSidebar(item) || isItemControlInline(parentItem);
};

export const isItemControlReceiverComponent = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.receiverComponent;
};

export const isItemControlDropDown = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.dropdown;
};

export const isItemControlRadioButton = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.radioButton;
};

export const isItemControlAutocomplete = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.autocomplete;
};

export const isItemControlCheckbox = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.checkbox;
};

export const isItemControlHelp = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.help;
};

export const isItemControlHighlight = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.highlight;
};

export const isItemControlSidebar = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.sidebar;
};

export const isItemControlInline = (item?: QuestionnaireItem): boolean => {
    return item?.type === IQuestionnaireItemType.text && getItemControlType(item) === ItemControlType.inline;
};

export const isItemControlSummary = (item: QuestionnaireItem): boolean => {
    return getItemControlIndex(item, ItemControlType.summary) > -1;
};

export const isItemControlSummaryContainer = (item: QuestionnaireItem): boolean => {
    return getItemControlIndex(item, ItemControlType.summaryContainer) > -1;
};

export const getHelpText = (item: QuestionnaireItem): string => {
    if (!isItemControlHelp(item)) {
        return '';
    }
    return item._text?.extension?.find((ex) => ex.url === IExtentionType.markdown)?.valueMarkdown || item.text || '';
};

export const setItemControlExtension = (
    item: QuestionnaireItem,
    code: ItemControlType,
    dispatch: (value: ActionType) => void,
): void => {
    const extensionsToSet = (item.extension || []).filter(
        (x: Extension) => x.url !== IExtentionType.itemControl || x.valueCodeableConcept?.coding?.[0].code !== code,
    );
    if (getItemControlIndex(item, code) === -1) {
        const newExtension = createItemControlExtension(code);
        extensionsToSet.push(newExtension);
    }

    dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
};
