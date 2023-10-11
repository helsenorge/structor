import {
    addOrdinalValueExtensionToAllAnswerOptions,
    removeExtensionFromAnswerOptions,
} from '../helpers/answerOptionHelper';
import { updateItemAction } from '../store/treeStore/treeActions';
import { ActionType } from '../store/treeStore/treeStore';
import { IExtentionType, IItemProperty } from '../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../types/fhir';

export const addDefaultOrdinalValueExtensionToAllAnswerOptions = (
    item: QuestionnaireItem,
    dispatch: React.Dispatch<ActionType>,
): void => {
    if (item.answerOption) {
        const newArray = addOrdinalValueExtensionToAllAnswerOptions(item.answerOption || [], '0');
        dispatch(updateItemAction(item.linkId, IItemProperty.answerOption, newArray));
    }
};

export const removeOrdinalValueExtensionfromAnswerOptions = (
    item: QuestionnaireItem,
    dispatch: React.Dispatch<ActionType>,
): void => {
    if (item.answerOption) {
        const newArray = removeExtensionFromAnswerOptions(item.answerOption || [], IExtentionType.ordinalValue);
        dispatch(updateItemAction(item.linkId, IItemProperty.answerOption, newArray));
    }
};
