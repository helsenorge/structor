import { TreeState, OrderItem, Items } from '../store/treeStore/treeStore';
import { QuestionnaireItem } from '../types/fhir';

export const generateQuestionnaire = (state: TreeState): string => {
    const generateTree = (order: Array<OrderItem>, items: Items): Array<QuestionnaireItem> => {
        return order.map((x) => {
            return {
                ...items[x.linkId],
                item: generateTree(x.items, items),
            };
        });
    };

    return JSON.stringify({
        resourceType: 'Questionnaire',
        status: 'draft',
        title: state.title,
        description: state.description,
        contained: Object.values(state.qValueSet),
        item: generateTree(state.qOrder, state.qItems),
    });
};
