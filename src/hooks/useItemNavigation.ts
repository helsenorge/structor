import { useContext } from 'react';
import { OrderItem, TreeContext } from '../store/treeStore/treeStore';
import { isIgnorableItem } from '../helpers/itemControl';
import { updateMarkedLinkIdAction } from '../store/treeStore/treeActions';

interface FlatOrderItem {
    linkId: string;
    path: Array<string>;
}

interface ItemNavigation {
    next: () => void;
    previous: () => void;
    hasNext: () => boolean;
    hasPrevious: () => boolean;
}

export const useItemNavigation = (): ItemNavigation => {
    const { state, dispatch } = useContext(TreeContext);
    const { qCurrentItem, qItems, qOrder } = state;

    const flatMap = (orderItems: Array<OrderItem>, ancestors: Array<string> = [], items: Array<FlatOrderItem> = []) => {
        const parentItem = ancestors ? qItems[ancestors[ancestors.length - 1]] : undefined;
        orderItems
            .filter((x) => !isIgnorableItem(qItems[x.linkId], parentItem))
            .forEach((x) => {
                const item: FlatOrderItem = { linkId: x.linkId, path: [...ancestors] };
                items.push(item);
                if (x.items) {
                    flatMap(x.items, [...ancestors, x.linkId], items);
                }
            });
        return items;
    };

    const flattened = flatMap(qOrder);

    function getCurrentIndex() {
        return flattened.findIndex((item) => item.linkId === qCurrentItem?.linkId);
    }

    const previous = () => {
        const currentIndex = getCurrentIndex();
        if (currentIndex > 0) {
            const previousItem = flattened[currentIndex - 1];
            dispatch(updateMarkedLinkIdAction(previousItem.linkId, previousItem.path));
        }
    };

    const next = () => {
        const currentIndex = getCurrentIndex();
        if (currentIndex < flattened.length - 1) {
            const nextItem = flattened[currentIndex + 1];
            dispatch(updateMarkedLinkIdAction(nextItem.linkId, nextItem.path));
        }
    };

    const hasNext = (): boolean => {
        const currentIndex = getCurrentIndex();
        return currentIndex < flattened.length - 1;
    };

    const hasPrevious = (): boolean => {
        const currentIndex = getCurrentIndex();
        return currentIndex > 0;
    };

    return { next, previous, hasNext, hasPrevious };
};
