import { QuestionnaireItem } from '../types/fhir';
import { IExtentionType, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { getEnumKeyByString } from './enumHelper';

export enum ItemControlType {
    inline = 'inline',
    help = 'help',
    sidebar = 'sidebar',
}

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

export const isIgnorableItem = (item: QuestionnaireItem, parentItem?: QuestionnaireItem): boolean => {
    return isItemControlHelp(item) || isItemControlSidebar(item) || isItemControlInline(parentItem);
};

export const isItemControlHelp = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.help;
};

export const isItemControlSidebar = (item: QuestionnaireItem): boolean => {
    return getItemControlType(item) === ItemControlType.sidebar;
};

export const isItemControlInline = (item?: QuestionnaireItem): boolean => {
    return item?.type === IQuestionnaireItemType.text && getItemControlType(item) === ItemControlType.inline;
};

export const getHelpText = (item: QuestionnaireItem): string => {
    if (!isItemControlHelp(item)) {
        return '';
    }
    if (!item._text || !item._text.extension) {
        return '';
    }

    return item._text.extension[0].valueMarkdown || '';
};
