import { State } from './FormStore';
import { DuplicateAction, DuplicateActionTypes } from './ActionTypes';
import { generateID } from '../helpers/IDGenerator';

export default function DuplicateActions(draft: State, action: DuplicateAction): void {
    switch (action.type) {
        case DuplicateActionTypes.DUPLICATE_SECTION:
            if (
                action.sectionId !== undefined &&
                action.newSectionId !== undefined &&
                action.sectionIndex !== undefined &&
                action.newSectionIndex !== undefined
            ) {
                const sectionCopy = { ...draft.sections[action.sectionId] };
                sectionCopy.sectionTitle += sectionCopy.sectionTitle.endsWith('- Kopi') ? '' : '- Kopi';
                sectionCopy.id = action.newSectionId;
                const newQuestionsOrder = new Array<string>();
                sectionCopy.questionOrder.forEach((questionId: string) => {
                    const tmpQuestion = { ...draft.questions[questionId] };
                    tmpQuestion.id = generateID();
                    tmpQuestion.questionText += tmpQuestion.questionText.endsWith('- Kopi') ? '' : '- Kopi';
                    const answerCopy = { ...tmpQuestion.answer };
                    answerCopy.id = generateID();
                    tmpQuestion.answer = answerCopy;
                    draft.questions[tmpQuestion.id] = tmpQuestion;
                    newQuestionsOrder.push(tmpQuestion.id);
                });
                sectionCopy.questionOrder = newQuestionsOrder;
                draft.sections[sectionCopy.id] = sectionCopy;
                draft.sectionOrder.splice(action.newSectionIndex, 0, sectionCopy.id);
            }
            break;
        case DuplicateActionTypes.DUPLICATE_QUESTION:
            if (
                action.sectionId !== undefined &&
                action.questionId !== undefined &&
                action.newQuestionId !== undefined &&
                action.newQuestionIndex !== undefined
            ) {
                const questionCopy = {
                    ...draft.questions[action.questionId],
                };
                questionCopy.questionText += questionCopy.questionText.endsWith('- Kopi') ? '' : ' - Kopi';
                questionCopy.id = action.newQuestionId;
                const answerCopy = { ...questionCopy.answer };
                answerCopy.id = generateID();
                questionCopy.answer = answerCopy;
                draft.questions[questionCopy.id] = questionCopy;
                draft.sections[action.sectionId].questionOrder.splice(action.newQuestionIndex, 0, questionCopy.id);
            }
            break;
    }
}
