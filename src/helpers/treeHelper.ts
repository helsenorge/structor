import { OrderItem } from '../store/treeStore/treeStore';

export const findElementInTreeArray = (searchPath: Array<string>, searchItems: Array<OrderItem>): Array<OrderItem> => {
    if (searchPath.length === 0) {
        return searchItems;
    }
    // finn neste i searchPath:
    const searchIndex = searchItems.findIndex((x) => x.linkId === searchPath[0]);
    return findElementInTreeArray(searchPath.slice(1), searchItems[searchIndex].items);
};
