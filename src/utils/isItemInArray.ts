import { OrderItem } from '../store/treeStore/treeStore';
import { QuestionnaireItem } from '../types/fhir';

export const isItemInArray = (arrayToSearch: OrderItem[], qItem: QuestionnaireItem, valueToReturn = false): boolean => {
    arrayToSearch.forEach((item) => {
        if (item.linkId === qItem.linkId) {
            valueToReturn = true;
            return;
        }
        if (item.items) {
            valueToReturn = isItemInArray(item.items, qItem, valueToReturn);
        }
    });
    return valueToReturn;
};
