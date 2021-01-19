import { Items, OrderItem, TreeState } from '../store/treeStore/treeStore';
import { Questionnaire, QuestionnaireItem, ValueSet } from '../types/fhir';

import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';

function extractMetadata(questionnaireObj: Questionnaire) {
    const getMetadataParts = ({
        resourceType,
        language,
        id,
        name,
        title,
        description,
        version,
        status,
        publisher,
        meta,
        useContext,
        contact,
        subjectType,
        extension,
        purpose,
        copyright,
    }: IQuestionnaireMetadata) => ({
        resourceType,
        language,
        id,
        name,
        title,
        description,
        version,
        status,
        publisher,
        meta,
        useContext,
        contact,
        subjectType,
        extension,
        purpose,
        copyright,
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
    const qContained = questionnaireObj.contained as Array<ValueSet>; // we expect contained to only contain ValueSets
    const { qItems, qOrder } = extractItemsAndOrder(questionnaireObj.item);

    const newState: TreeState = {
        qItems,
        qOrder,
        qMetadata,
        qContained,
    };

    return newState;
}

export default mapToTreeState;
