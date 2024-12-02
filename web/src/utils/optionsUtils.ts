import { QuestionnaireItem, ValueSet } from "fhir/r4";

import { ICodeSystem } from "../types/IQuestionnareItemType";
import { Option } from "../types/OptionTypes";

import { getOrderItemByLinkId } from "../helpers/codeHelper";
import { getFirstAnswerValueSetFromOrderItem } from "../helpers/valueSetHelper";
import { OrderItem, Items } from "../store/treeStore/treeStore";

export const createOptionsFromQItemCode = (
  item: QuestionnaireItem,
  system: ICodeSystem
): Option[] => {
  const newArray: Option[] = [];
  item.code?.forEach((code) => {
    if (code.system === system && code.code && code.display) {
      const newOption: Option = {
        code: code.code,
        display: code.display.toString(),
      };
      newArray.push(newOption);
    }
  });
  return newArray;
};

export const getSelectedValue = (
  item: QuestionnaireItem,
  system: ICodeSystem
): string | undefined => {
  let stringToReturn = "";
  item.code?.forEach((code) => {
    if (code.system === system && code.code) {
      stringToReturn = code.code;
    }
  });
  return stringToReturn;
};

export const getDisplayValueInOption = (
  options: Option[],
  codeToSearchIn: string
): string => {
  let stringToReturn = "";
  options.forEach((option) => {
    if (option.code === codeToSearchIn) {
      stringToReturn = option.display || "";
    }
  });
  return stringToReturn;
};

export const getContainedOptions = (
  orderItem: OrderItem[],
  qItems: Items,
  qContained: ValueSet[] | undefined
): Option[] => {
  const optionArray: Option[] = [];
  const firstChoiceAnswerValueSet = getFirstAnswerValueSetFromOrderItem(
    orderItem,
    qItems
  );

  if (firstChoiceAnswerValueSet) {
    const idToSearchFor: string = firstChoiceAnswerValueSet.replace("#", "");

    qContained?.forEach((contained) => {
      if (contained.id === idToSearchFor) {
        contained.compose?.include.forEach((include) => {
          include.concept?.forEach((concept) => {
            concept.display &&
              optionArray.push({
                code: concept.code,
                display: concept.display,
              });
          });
        });
      }
    });
  }
  return optionArray;
};

export const getGTableOptions = (
  item: QuestionnaireItem,
  qOrder: OrderItem[],
  qItems: Items
): Option[] => {
  const newArray: Option[] = [];
  const orderItem = getOrderItemByLinkId(qOrder, item.linkId);
  orderItem?.items.forEach((childOrderItem) => {
    const childItem = qItems[childOrderItem.linkId];
    if (childItem.text) {
      newArray.push({ code: childItem.linkId, display: childItem.text });
    }
  });
  return newArray;
};
