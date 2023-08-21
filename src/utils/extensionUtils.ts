import { addOrdinalValueExtensionToAllAnswerOptions } from '../helpers/answerOptionHelper';
import { updateItemAction } from '../store/treeStore/treeActions';
import { ActionType } from '../store/treeStore/treeStore';
import { IItemProperty } from '../types/IQuestionnareItemType';
import { Extension, QuestionnaireItem, QuestionnaireItemAnswerOption } from '../types/fhir';

export const findExtensionInExtensionArrayByUrl = (extensionArray: Extension[], url: string): Extension | undefined => {
    let extensionToReturn: Extension = { url: '', valueDecimal: 0 };
    extensionArray.find((x) => {
        if (x.url === url) {
            extensionToReturn = x;
        }
    });
    if (extensionToReturn.url !== '' && extensionToReturn.valueDecimal !== 0) {
        return extensionToReturn;
    }
};

export const addDefaultOrdinalValueExtensionToAllAnswerOptions = (
    item: QuestionnaireItem,
    dispatch: React.Dispatch<ActionType>,
) => {
    if (item.answerOption) {
        const newArray = [];
        newArray.push(addOrdinalValueExtensionToAllAnswerOptions(item.answerOption || [], '0'));
        dispatch(updateItemAction(item.linkId, IItemProperty.answerOption, newArray));
    }
};
