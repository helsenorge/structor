import { QuestionnaireItem } from "fhir/r4";
import { OrderItem } from "src/store/treeStore/treeStore";
import { IExtensionType } from "src/types/IQuestionnareItemType";

import { getExtensionStringValue } from "./extensionHelper";

const getLinkIdFromValueString = (item: QuestionnaireItem): string[] => {
  const extensionValueString =
    getExtensionStringValue(item, IExtensionType.calculatedExpression) ?? "";
  const regex = /'(.*?)'/g;
  const matches = [];
  let match;

  while ((match = regex.exec(extensionValueString)) !== null) {
    matches.push(match[1]);
  }

  return matches;
};

export const existAllCalculatedExpressionLinkIds = (
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): string[] => {
  const linkIds = getLinkIdFromValueString(qItem);
  const notExistlinkIds: string[] = [];

  linkIds.forEach((linkId) => {
    const mainItemIndex = qOrder.findIndex((q) => q.linkId === linkId);
    if (
      mainItemIndex < 0 &&
      notExistlinkIds.findIndex((f) => f === linkId) < 0
    ) {
      notExistlinkIds.push(linkId);
    }
  });

  return notExistlinkIds;
};
