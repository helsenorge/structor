import { QuestionnaireItem } from '../types/fhir';
import { IExtentionType } from '../types/IQuestionnareItemType';

export const isIgnorableItem = (item: QuestionnaireItem): boolean => {
    return isItemControlHelp(item) || isItemControlSidebar(item);
};

export const isItemControlHelp = (item: QuestionnaireItem): boolean => {
    const hasItemControlExtention = item.extension?.find((x) => x.url === IExtentionType.itemControl);

    return (
        item.extension !== undefined &&
        hasItemControlExtention !== undefined &&
        hasItemControlExtention.valueCodeableConcept?.coding !== undefined &&
        hasItemControlExtention.valueCodeableConcept.coding[0].code === 'help'
    );
};

export const isItemControlSidebar = (item: QuestionnaireItem): boolean => {
    const hasItemControlExtention = item.extension?.find((x) => x.url === IExtentionType.itemControl);

    return (
        item.extension !== undefined &&
        hasItemControlExtention !== undefined &&
        hasItemControlExtention.valueCodeableConcept?.coding !== undefined &&
        hasItemControlExtention.valueCodeableConcept.coding[0].code === 'sidebar'
    );
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
