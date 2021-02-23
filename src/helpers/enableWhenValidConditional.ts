import { OrderItem, TreeState } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';

export const getEnableWhenConditionals = (
    state: TreeState,
    parentArray: string[],
    linkId: string,
): ValueSetComposeIncludeConcept[] => {
    const createValueSetComposeIncludeConcept = (linkId: string, idArray: Array<number>, index: number) => {
        const getQItem = (linkId: string): QuestionnaireItem => {
            return state.qItems[linkId];
        };

        // TODO: ignore items which cannot have enableWhen? (display, group, text.help, text.highlight...)
        const itemText = `${'\xA0'.repeat(idArray.length * 4)}${getQItem(linkId).text || 'Ikke definert tittel'}`;
        const displayText = itemText.length > 120 ? `${itemText?.substr(0, 120)}...` : itemText;
        return {
            code: linkId,
            display: `${displayText} ${JSON.stringify([...idArray, index + 1])}`,
        };
    };

    const expandSubTree = (order: OrderItem, idArray: Array<number>): ValueSetComposeIncludeConcept[] => {
        return order.items.reduce((acc: ValueSetComposeIncludeConcept[], current: OrderItem, index: number) => {
            return [
                ...acc,
                createValueSetComposeIncludeConcept(current.linkId, idArray, index),
                ...expandSubTree(current, [...idArray, index + 1]),
            ];
        }, []);
    };

    const search = (
        order: OrderItem[],
        searchArray: string[],
        idArray: Array<number>,
    ): ValueSetComposeIncludeConcept[] => {
        if (searchArray.length === 0) {
            return [];
        }
        const currentLinkId = searchArray[0];
        const stopIndex = order.findIndex((x) => x.linkId === currentLinkId);
        const stopIndexWithoutSelfItem = searchArray.length > 1 ? stopIndex + 1 : stopIndex;
        return order
            .slice(0, stopIndexWithoutSelfItem)
            .reduce((acc: ValueSetComposeIncludeConcept[], current: OrderItem, index: number) => {
                const expandedPart =
                    current.linkId === currentLinkId ? [] : expandSubTree(current, [...idArray, index + 1]);
                return [...acc, createValueSetComposeIncludeConcept(current.linkId, idArray, index), ...expandedPart];
            }, [])
            .concat(search(order[stopIndex].items, searchArray.slice(1), [...idArray, stopIndex + 1]));
    };

    return search(state.qOrder, [...parentArray, linkId], []);
};
