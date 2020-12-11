import { Items, OrderItem, TreeState, ValueSets } from '../store/treeStore/treeStore';
import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';
import { Resource, ValueSet, Questionnaire, QuestionnaireItem } from '../types/fhir';

function convertToValueSets(contained?: Array<Resource>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function instanceofValueSet(object: any): object is ValueSet {
        return object.resourceType === 'ValueSet';
    }
    if (contained === undefined) return {};

    const valueSets: ValueSets = {};

    contained
        .filter((resource: Resource) => {
            return instanceofValueSet(resource);
        })
        .forEach((resource) => {
            const valueSet = resource as ValueSet;
            if (valueSet.id !== undefined) {
                valueSets[valueSet.id] = valueSet;
            }
        });

    return valueSets;
}

function extractMetadata(questionnaireObj: Questionnaire) {
    const getMetadataParts = ({
        resourceType,
        language,
        name,
        title,
        description,
        status,
        publisher,
        meta,
        useContext,
        contact,
        subjectType,
    }: IQuestionnaireMetadata) => ({
        resourceType,
        language,
        name,
        title,
        description,
        status,
        publisher,
        meta,
        useContext,
        contact,
        subjectType,
    });
    return getMetadataParts(questionnaireObj);
}

function extractItemsAndOrder(item?: Array<QuestionnaireItem>): { qItems: Items; qOrder: Array<OrderItem> } {
    function mapToOrderItem(qItem: QuestionnaireItem, qItems: Items): OrderItem {
        let children: Array<OrderItem>;
        if (qItem.item !== undefined && qItem.item.length > 0) {
            children = qItem.item?.map((childItem: QuestionnaireItem) => {
                return mapToOrderItem(childItem, qItems);
            });
        } else {
            children = [];
        }

        const orderItem: OrderItem = {
            linkId: qItem.linkId,
            items: children,
        };
        // Add item to qItems - removes children as this is handled by qOrder
        delete qItem.item;
        qItems[qItem.linkId] = qItem;
        return orderItem;
    }

    const qItems: Items = {};
    const qOrder = item?.map((qItem) => {
        return mapToOrderItem(qItem, qItems);
    });

    return { qItems, qOrder: qOrder || [] };
}

function mapToTreeState(questionnaireObj: Questionnaire): TreeState {
    const qMetadata: IQuestionnaireMetadata = extractMetadata(questionnaireObj);
    const qValueSet: ValueSets = convertToValueSets(questionnaireObj.contained);
    const { qItems, qOrder } = extractItemsAndOrder(questionnaireObj.item);

    const newState: TreeState = {
        qValueSet,
        qItems,
        qOrder,
        qMetadata,
    };

    return newState;
}

export default mapToTreeState;
