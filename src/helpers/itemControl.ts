import { Extension, QuestionnaireItem, Coding } from '../types/fhir';
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
    dataReceiver = 'data-receiver',
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

export const createItemControlExtensionWithTypes = (types: string[]): Extension => {
    const initCodingArray: Coding[] = [];
    const extension = {
        url: IExtentionType.itemControl,
        valueCodeableConcept: { coding: initCodingArray },
    };

    types.forEach((type: string) => {
        extension.valueCodeableConcept.coding.push({
            system: IValueSetSystem.itemControlValueSet,
            code: type,
        });
    });
    return extension;
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

const existItemControlWithCode = (item: QuestionnaireItem, code: string): boolean => {
    const exist =
        item.extension
            ?.filter((x: Extension) => x.url === IExtentionType.itemControl)
            ?.find((x: Extension) => x.valueCodeableConcept?.coding?.some((s: Coding) => s.code === code)) !==
        undefined;
    return exist;
};

const existItemControlExtension = (item: QuestionnaireItem): boolean => {
    return item.extension?.find((x: Extension) => x.url === IExtentionType.itemControl) !== undefined;
};

const handleTypeInItemControlExtension = (item: QuestionnaireItem, code: ItemControlType): Extension | null => {
    if (!existItemControlExtension(item)) {
        return createItemControlExtension(code);
    }

    const coding = item.extension
        ?.find((f: Extension) => f.url === IExtentionType.itemControl)
        ?.valueCodeableConcept?.coding?.filter((f: Coding) => f.code !== code)
        ?.map((c: Coding) => c.code) as string[];

    if (!existItemControlWithCode(item, code)) {
        coding.push(code);
    }

    return coding.length > 0 ? createItemControlExtensionWithTypes(coding) : null;
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
    return existItemControlWithCode(item, ItemControlType.summary);
};

export const isItemControlSummaryContainer = (item: QuestionnaireItem): boolean => {
    return existItemControlWithCode(item, ItemControlType.summaryContainer);
};

export const isItemControlDataReceiver = (item: QuestionnaireItem): boolean => {
    return existItemControlWithCode(item, ItemControlType.dataReceiver);
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
    const extensionsToSet = (item.extension || []).filter((x: Extension) => x.url !== IExtentionType.itemControl);
    const extension = handleTypeInItemControlExtension(item, code);
    if (extension) {
        extensionsToSet.push(extension);
    }
    dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
};
