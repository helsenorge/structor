import { QuestionnaireItem } from "fhir/r4";

import { IExtensionType, IItemProperty } from "../types/IQuestionnareItemType";

import {
  addOrdinalValueExtensionToAllAnswerOptions,
  removeExtensionFromAnswerOptions,
} from "../helpers/answerOptionHelper";
import { updateItemAction } from "../store/treeStore/treeActions";
import { ActionType } from "../store/treeStore/treeStore";

export const addDefaultOrdinalValueExtensionToAllAnswerOptions = (
  item: QuestionnaireItem,
  dispatch: React.Dispatch<ActionType>
): void => {
  if (item.answerOption) {
    const newArray = addOrdinalValueExtensionToAllAnswerOptions(
      item.answerOption || [],
      "0"
    );
    dispatch(
      updateItemAction(item.linkId, IItemProperty.answerOption, newArray)
    );
  }
};

export const removeOrdinalValueExtensionfromAnswerOptions = (
  item: QuestionnaireItem,
  dispatch: React.Dispatch<ActionType>
): void => {
  if (item.answerOption) {
    const newArray = removeExtensionFromAnswerOptions(
      item.answerOption || [],
      IExtensionType.ordinalValue
    );
    dispatch(
      updateItemAction(item.linkId, IItemProperty.answerOption, newArray)
    );
  }
};
