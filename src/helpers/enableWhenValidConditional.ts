import { OrderItem, TreeState } from '../store/treeStore/treeStore';
import { ValueSetComposeIncludeConcept } from '../types/fhir';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { isItemControlHelp, isItemControlHighlight, isItemControlInline, isItemControlSidebar } from './itemControl';

export const getEnableWhenConditionals = (
    state: TreeState,
    parentArray: string[],
    itemLinkId: string,
): ValueSetComposeIncludeConcept[] => {
    const createValueSetComposeIncludeConcept = (
        linkId: string,
        idArray: Array<number>,
        index: number,
    ): ValueSetComposeIncludeConcept[] => {
        const qItem = state.qItems[linkId];

        // ignore itemControl = help, itemControl = highlight, itemControl = sidebar, itemControl = inline, type = display
        if (
            isItemControlHelp(qItem) ||
            isItemControlHighlight(qItem) ||
            isItemControlSidebar(qItem) ||
            isItemControlInline(qItem) ||
            qItem.type === IQuestionnaireItemType.display
        ) {
            return [];
        }

        // TODO: ignore items which cannot have enableWhen? (display, group, text.help, text.highlight...)
        const itemText = `${'\xA0'.repeat(idArray.length * 4)}${qItem.text || 'Ikke definert tittel'}`; // TODO translate
        const displayText = itemText.length > 120 ? `${itemText?.substr(0, 120)}...` : itemText;
        return [
            {
                code: linkId,
                display: `${[...idArray, index + 1].join('.')} ${displayText}`,
            },
        ];
    };

    const expandSubTree = (order: OrderItem, idArray: Array<number>): ValueSetComposeIncludeConcept[] => {
        return order.items.reduce((acc: ValueSetComposeIncludeConcept[], current: OrderItem, index: number) => {
            return [
                ...acc,
                ...createValueSetComposeIncludeConcept(current.linkId, idArray, index),
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
                return [
                    ...acc,
                    ...createValueSetComposeIncludeConcept(current.linkId, idArray, index),
                    ...expandedPart,
                ];
            }, [])
            .concat(search(order[stopIndex].items, searchArray.slice(1), [...idArray, stopIndex + 1]));
    };

    return search(state.qOrder, [...parentArray, itemLinkId], []);
};
