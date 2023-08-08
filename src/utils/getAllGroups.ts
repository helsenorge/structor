import { OrderItem, Items } from '../store/treeStore/treeStore';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';

export const getAllGroups = (qOrder: OrderItem[], qItems: Items, newArray: OrderItem[] = []): OrderItem[] => {
    qOrder.forEach((orderItem) => {
        const qItem = qItems[orderItem.linkId];
        if (qItem.type === IQuestionnaireItemType.group) {
            newArray.push(orderItem);
        }
        if (orderItem.items) {
            getAllGroups(orderItem.items, qItems, newArray);
        }
    });
    return newArray;
};
