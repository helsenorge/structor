import { QuestionnaireItem } from "fhir/r4";

import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../types/IQuestionnareItemType";

import { Items, OrderItem } from "../store/treeStore/treeStore";

export const doesItemHaveCode = (
  item: QuestionnaireItem,
  code: string,
): boolean => {
  let itemHasCode = false;
  item.code?.forEach((x) => {
    if (x.code === code) {
      itemHasCode = true;
    }
  });
  return itemHasCode;
};

export const isItemInArray = (
  qOrder: OrderItem[],
  qItem: QuestionnaireItem,
  valueToReturn = false,
): boolean => {
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
      valueToReturn = doesItemWithCodeExistInArray(
        orderItem.items,
        qItems,
        codeToSearchFor,
        valueToReturn,
      );
    }
  });

  return valueToReturn;
};

export const doesAllAnswerOptionsInItemHaveExtenison = (
  qItem: QuestionnaireItem,
  extensionToSearchFor: IExtensionType,
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

export const getAllItemTypes = (
  qOrder: OrderItem[],
  qItems: Items,
  itemType: IQuestionnaireItemType,
  newArray: OrderItem[] = [],
): OrderItem[] => {
  qOrder.forEach((orderItem) => {
    const qItem = qItems[orderItem.linkId];
    if (qItem.type === itemType) {
      newArray.push(orderItem);
    }
    if (orderItem.items) {
      getAllItemTypes(orderItem.items, qItems, itemType, newArray);
    }
  });
  return newArray;
};
