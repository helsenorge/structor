import { State } from './FormStore';
import { SwapAction, SwapActionTypes } from './ActionTypes';

export default function SwapActions(draft: State, action: SwapAction): void {
    switch (action.type) {
        case SwapActionTypes.SWAP_SECTION:
            if (action.oldSectionIndex !== undefined && action.newSectionIndex !== undefined) {
                const oldId = draft.sectionOrder[action.oldSectionIndex];
                draft.sectionOrder[action.oldSectionIndex] = draft.sectionOrder[action.newSectionIndex];
                draft.sectionOrder[action.newSectionIndex] = oldId;
            }
            break;

        case SwapActionTypes.SWAP_QUESTION:
            if (
                action.oldQuestionIndex !== undefined &&
                action.newQuestionIndex !== undefined &&
                action.oldSectionId !== undefined &&
                action.newSectionId !== undefined
            ) {
                const sourceId = draft.sections[action.oldSectionId].questionOrder[action.oldQuestionIndex];
                if (action.oldSectionId !== action.newSectionId) {
                    draft.questions[sourceId].sectionId = action.newSectionId;
                }
                draft.sections[action.oldSectionId].questionOrder.splice(action.oldQuestionIndex, 1);
                draft.sections[action.newSectionId].questionOrder.splice(action.newQuestionIndex, 0, sourceId);
            }
            break;
    }
}
