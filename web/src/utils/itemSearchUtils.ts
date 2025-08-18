import { QuestionnaireItem } from "fhir/r4";
import { ItemControlType } from "src/helpers/itemControl";

import {
  IExtensionType,
  IQuestionnaireItemType,
  IValueSetSystem,
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

export const isItemWithLinkIdInArray = (
  qOrder: OrderItem[],
  linkId: string,
  valueToReturn = false,
): boolean => {
  qOrder.forEach((item) => {
    if (item.linkId === linkId) {
      valueToReturn = true;
      return;
    }
    if (item.items) {
      valueToReturn = isItemWithLinkIdInArray(
        item.items,
        linkId,
        valueToReturn,
      );
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

export const doesItemHaveStepCoding = (qItem: QuestionnaireItem): boolean => {
  if (!qItem.extension) return false;

  for (const extension of qItem.extension) {
    const coding = extension.valueCodeableConcept?.coding;

    if (coding) {
      for (const x of coding) {
        if (
          x.system === IValueSetSystem.itemControlValueSet &&
          x.code === ItemControlType.step
        ) {
          return true;
        }
      }
    }
  }

  return false;
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

export const doesItemHaveChildren = (
  targetLinkId: string,
  qOrder: OrderItem[],
): boolean => {
  // Funksjon som søker rekursivt i qOrder etter targetLinkId
  const findChildren = (orderItems: OrderItem[]): boolean => {
    for (const orderItem of orderItems) {
      if (orderItem.linkId === targetLinkId) {
        return orderItem.items.length > 0;
      }
      if (findChildren(orderItem.items)) {
        return true;
      }
    }
    return false;
  };

  // Start søk på root nivå
  return findChildren(qOrder);
};

export const isItemChildOfType = (
  childItemId: string,
  type: IQuestionnaireItemType,
  qItems: Items,
  qOrder: OrderItem[],
): boolean => {
  const isChildOfType = (
    orderItems: OrderItem[],
    parentIsEqualToType: boolean,
  ): boolean => {
    for (const orderItem of orderItems) {
      const currentItem = qItems[orderItem.linkId];

      if (orderItem.linkId === childItemId) {
        // Hvis vi finner childItemId
        return parentIsEqualToType;
      }

      if (currentItem?.type === type) {
        // Sjekk rekursivt for children med parentIsEqualToType=true
        if (isChildOfType(orderItem.items, true)) {
          return true;
        }
      } else {
        // Sjekk rekursivt for children med parentIsEqualToType=false
        if (isChildOfType(orderItem.items, parentIsEqualToType)) {
          return true;
        }
      }
    }
    return false;
  };

  // Start søket på root nivå, hvor ingen parent items finnes
  return isChildOfType(qOrder, false);
};
