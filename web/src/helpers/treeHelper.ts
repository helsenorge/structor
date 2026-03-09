import { IQuestionnaireItemType } from "src/types/IQuestionnareItemType";

import type { Items, OrderItem } from "../store/treeStore/treeStore";
import type { QuestionnaireItem } from "fhir/r4";

import {
  isIgnorableItem,
  isItemControlReceiverComponent,
  isRecipientList,
} from "./itemControl";

export const findElementInTreeArray = (
  searchPath: Array<string>,
  searchItems: Array<OrderItem>,
): Array<OrderItem> => {
  if (searchPath.length === 0) {
    return searchItems;
  }
  // finn neste i searchPath:
  const searchIndex = searchItems.findIndex((x) => x.linkId === searchPath[0]);
  return findElementInTreeArray(
    searchPath.slice(1),
    searchItems[searchIndex].items,
  );
};

const removeUnsupportedChildren = (
  itemOrder: OrderItem[],
  qItems: Items,
  parentLinkId?: string,
): OrderItem[] => {
  const parentItem = parentLinkId ? qItems[parentLinkId] : undefined;
  return itemOrder.filter(
    (x) => !isIgnorableItem(qItems[x.linkId], parentItem),
  );
};
export const getItemType = (
  item: QuestionnaireItem,
):
  | QuestionnaireItem["type"]
  | IQuestionnaireItemType.receiverComponent
  | IQuestionnaireItemType.receiver
  | undefined => {
  if (!item) return undefined;
  if (isItemControlReceiverComponent(item))
    return IQuestionnaireItemType.receiverComponent;
  if (isRecipientList(item)) return IQuestionnaireItemType.receiver;
  return item.type;
};
const getItemIndexAsString = (
  linkId: string,
  itemOrder: Array<OrderItem>,
  qItems: Items,
  parentNumber = "",
  parentLinkId?: string,
): string => {
  const itemIndex =
    removeUnsupportedChildren(itemOrder, qItems, parentLinkId).findIndex(
      (item) => item.linkId === linkId,
    ) + 1;

  return parentNumber ? `${parentNumber}.${itemIndex}` : `${itemIndex}`;
};

export const calculateItemNumber = (
  linkId: string,
  searchPath: Array<string>,
  itemOrder: Array<OrderItem>,
  qItems: Items,
): string => {
  if (!searchPath || searchPath.length === 0) {
    return getItemIndexAsString(linkId, itemOrder, qItems);
  }

  let currentArray = itemOrder;
  let parentNumber = "";
  let parentLinkId = "";
  searchPath.forEach((currentLinkId) => {
    parentNumber = getItemIndexAsString(
      currentLinkId,
      currentArray,
      qItems,
      parentNumber,
      parentLinkId,
    );
    currentArray =
      currentArray.find((orderItem) => orderItem.linkId === currentLinkId)
        ?.items || [];
    parentLinkId = currentLinkId;
  });

  return getItemIndexAsString(
    linkId,
    currentArray,
    qItems,
    parentNumber,
    parentLinkId,
  );
};
