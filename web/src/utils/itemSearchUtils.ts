import { Items, OrderItem } from '../store/treeStore/treeStore';
import { IExtentionType, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../types/fhir';

export const doesItemHaveCode = (item: QuestionnaireItem, code: string): boolean => {
    let itemHasCode = false;
    item.code?.forEach((x) => {
        if (x.code === code) {
            itemHasCode = true;
        }
    });
    return itemHasCode;
};

export const isItemInArray = (qOrder: OrderItem[], qItem: QuestionnaireItem, valueToReturn = false): boolean => {
    qOrder.forEach((item) => {
        if (item.linkId === qItem.linkId) {
            valueToReturn = true;
            return;
        }
        if (item.items) {
            valueToReturn = isItemInArray(item.items, qItem, valueToReturn);
        }
    });
    return valueToReturn;
};

export const doesItemWithCodeExistInArray = (
    qOrder: OrderItem[],
    qItems: Items,
    codeToSearchFor: string,
    valueToReturn = false,
): boolean => {
    qOrder.forEach((orderItem) => {
        const qItem = qItems[orderItem.linkId];

        if (qItem.code) {
            qItem.code.forEach((code) => {
                if (code.code === codeToSearchFor) {
                    valueToReturn = true;
                    return;
                }
            });
        }

        if (orderItem.items && !valueToReturn) {
            valueToReturn = doesItemWithCodeExistInArray(orderItem.items, qItems, codeToSearchFor, valueToReturn);
        }
    });

    return valueToReturn;
};

export const doesAllAnswerOptionsInItemHaveExtenison = (
    qItem: QuestionnaireItem,
    extensionToSearchFor: IExtentionType,
): boolean => {
    let foundExtension = false;
    let valueToReturn = true;
    qItem.answerOption?.forEach((answerOption) => {
        foundExtension = false;
        if (answerOption.valueCoding?.extension) {
            answerOption.valueCoding?.extension.forEach((extension) => {
                if (extension.url === extensionToSearchFor) {
                    foundExtension = true;
                }
            });
        }
        if (foundExtension === false) {
            valueToReturn = false;
        }
    });
    return valueToReturn;
};

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
