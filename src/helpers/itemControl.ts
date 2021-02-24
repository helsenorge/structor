import { QuestionnaireItem } from '../types/fhir';
import { IExtentionType } from '../types/IQuestionnareItemType';

export const isItemControlHelp = (item: QuestionnaireItem): boolean => {
    const hasItemControlExtention = item.extension?.find((x) => x.url === IExtentionType.itemControl);

    const ignoreItem =
        item.extension !== undefined &&
        hasItemControlExtention !== undefined &&
        hasItemControlExtention.valueCodeableConcept?.coding !== undefined &&
        (hasItemControlExtention.valueCodeableConcept.coding[0].code === 'help' ||
            hasItemControlExtention.valueCodeableConcept.coding[0].code === 'sidebar');

    return ignoreItem;
};
