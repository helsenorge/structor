import { getValueSetId, Items, OrderItem, TreeState, ValueSets } from '../store/treeStore/treeStore';
import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';
import { Resource, ValueSet, Questionnaire, QuestionnaireItem } from '../types/fhir';

function findItemsUsingValueSet(id: string, items: Array<QuestionnaireItem> | undefined): Array<string> {
    const relatedItems: Array<string> = [];

    if (items === undefined) {
        return relatedItems;
    }

    function findRelatedItem(item: QuestionnaireItem) {
        if (item.answerValueSet?.substring(1) === id) {
            // TODO Not very nice to change the value of item.answerValueSet here. Find a better way.
            item.answerValueSet = `#${getValueSetId(item.linkId)}`;
            relatedItems.push(item.linkId);
        }

        if (item.item !== undefined && item.item.length > 0) {
            item.item.forEach((subItem) => {
                findRelatedItem(subItem);
            });
        }
    }

    items.forEach((item) => {
        findRelatedItem(item);
    });

    return relatedItems;
}

function convertToValueSets(questionnaireObj: Questionnaire) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function instanceofValueSet(object: any): object is ValueSet {
        return object.resourceType === 'ValueSet';
    }
    if (questionnaireObj.contained === undefined) return {};

    const valueSets: ValueSets = {};

    questionnaireObj.contained
        .filter((resource: Resource) => {
            return instanceofValueSet(resource);
        })
        .forEach((resource) => {
            const valueSet = resource as ValueSet;
            if (valueSet.id !== undefined) {
                const linkIds = findItemsUsingValueSet(valueSet.id, questionnaireObj.item);
                linkIds.forEach((linkId) => {
                    const valueSetId = getValueSetId(linkId);

                    valueSets[valueSetId] = {
                        ...valueSet,
                        id: valueSetId,
                    };
                });
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

        // Order is handled by qOrder, removing child items
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
    const qValueSet: ValueSets = convertToValueSets(questionnaireObj);
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
