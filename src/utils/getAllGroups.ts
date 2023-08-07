import { OrderItem, Items } from '../store/treeStore/treeStore';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';

export const getAllGroups = (qOrder: OrderItem[], qItems: Items, newArray: OrderItem[]): OrderItem[] => {
    for (let i = 0; i < qOrder.length; i++) {
        const item = qItems[qOrder[i].linkId];
        if (item.type === IQuestionnaireItemType.group) {
            newArray.push(qOrder[i]);
        }
        if (qOrder[i].items) {
            getAllGroups(qOrder[i].items, qItems, newArray);
        }
    }
    return newArray;
};
