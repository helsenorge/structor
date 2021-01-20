import { OrderItem, TreeState } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';

export const getEnableWhenConditionals = (
    state: TreeState,
    parentArray: string[],
    linkId: string,
): ValueSetComposeIncludeConcept[] => {
    const createValueSetComposeIncludeConcept = (linkId: string, indent: number) => {
        const getQItem = (linkId: string): QuestionnaireItem => {
            return state.qItems[linkId];
        };

        // TODO: ignore items which cannot have enableWhen? (display, group, text.help, text.highlight...)
        const itemText = `${'\xA0'.repeat(indent * 4)}${getQItem(linkId).text || 'Ikke definert tittel'}`;
        const displayText = itemText.length > 120 ? `${itemText?.substr(0, 120)}...` : itemText;
        return {
            code: linkId,
            display: displayText,
        };
    };

    const expandSubTree = (order: OrderItem, indent: number): ValueSetComposeIncludeConcept[] => {
        return order.items.reduce((acc: ValueSetComposeIncludeConcept[], current: OrderItem) => {
            return [
                ...acc,
                createValueSetComposeIncludeConcept(current.linkId, indent),
                ...expandSubTree(current, indent + 1),
            ];
        }, []);
    };

    const search = (order: OrderItem[], searchArray: string[], indent: number): ValueSetComposeIncludeConcept[] => {
        if (searchArray.length === 0) {
            return [];
        }
        const currentLinkId = searchArray[0];
        const stopIndex = order.findIndex((x) => x.linkId === currentLinkId);
        const stopIndexWithoutSelfItem = searchArray.length > 1 ? stopIndex + 1 : stopIndex;
        return order
            .slice(0, stopIndexWithoutSelfItem)
            .reduce((acc: ValueSetComposeIncludeConcept[], current: OrderItem) => {
                const expandedPart = current.linkId === currentLinkId ? [] : expandSubTree(current, indent + 1);
                return [...acc, createValueSetComposeIncludeConcept(current.linkId, indent), ...expandedPart];
            }, [])
            .concat(search(order[stopIndex].items, searchArray.slice(1), indent + 1));
    };

    return search(state.qOrder, [...parentArray, linkId], 0);
};
