import { State } from './FormStore';
import { UpdateAction, UpdateActionTypes } from './ActionTypes';
import { IChoice } from '../types/IAnswer';

export default function UpdateActions(
    draft: State,
    action: UpdateAction,
): void {
    switch (action.type) {
        case UpdateActionTypes.ADD_NEW_SECTION:
            if (action.section) {
                draft.sections[action.section.id] = action.section;
                draft.sectionOrder.push(action.section.id);
            }
            break;
        case UpdateActionTypes.UPDATE_SECTION:
            if (action.section) {
                draft.sections[action.section.id] = action.section;
            }
            break;
        case UpdateActionTypes.REMOVE_SECTION:
            if (action.sectionIndex !== undefined) {
                const sectionId = draft.sectionOrder[action.sectionIndex];
                draft.sectionOrder.splice(action.sectionIndex, 1);
                const section = draft.sections[sectionId];
                section.questionOrder.forEach((questionId) => {
                    delete draft.questions[questionId];
                });
                delete draft.sections[sectionId];
            }
            break;
        case UpdateActionTypes.ADD_NEW_QUESTION:
            if (action.question) {
                draft.sections[action.question.sectionId].questionOrder.push(
                    action.question.id,
                );
                draft.questions[action.question.id] = action.question;
            }
            break;
        case UpdateActionTypes.UPDATE_ANSWER:
            if (action.answer) {
                draft.questions[
                    action.questionId as string
                ].answer = action.answer as IChoice;
            }
            break;
        case UpdateActionTypes.UPDATE_QUESTION:
            if (action.question) {
                draft.questions[action.question.id] = action.question;
            }
            break;
        case UpdateActionTypes.REMOVE_QUESTION:
            if (
                action.questionIndex !== undefined &&
                action.sectionId !== undefined
            ) {
                const questionId =
                    draft.sections[action.sectionId].questionOrder[
                        action.questionIndex
                    ];
                draft.sections[action.sectionId].questionOrder.splice(
                    action.questionIndex,
                    1,
                );
                delete draft.questions[questionId];
            }
            break;
    }
}
