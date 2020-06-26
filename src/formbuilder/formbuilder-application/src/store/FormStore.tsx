import React, { useReducer, createContext, Dispatch } from 'react';
import ISection from '../types/ISection';
import IQuestion from '../types/IQuestion';
import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';
import { generateID } from '../helpers/IDGenerator';
import produce from 'immer';

const initSectionId = generateID();
const initSection: ISection = { id: initSectionId, questionOrder: [] };
const initSections: SectionList = {};
initSections[initSectionId] = initSection;

export const initialState: State = {
    sections: initSections,
    questions: {},
    sectionOrder: [initSectionId],
};

export enum ActionTypes {
    'ADD_SECTION',
    'ADD_NEW_SECTION',
    'REMOVE_SECTION',
    'ADD_QUESTION',
    'ADD_NEW_QUESTION',
    'REMOVE_QUESTION',
}

export enum SwapActionTypes {
    'SWAP_SECTION',
    'SWAP_QUESTION',
}

export interface Action {
    type: ActionTypes;
    sectionIndex?: number;
    sectionId?: string;
    questionId?: string;
    questionIndex?: number;
    section?: ISection;
    question?: IQuestion;
}

export interface SwapAction {
    type: SwapActionTypes;
    sectionId?: string;
    questionId?: string;
    oldSectionIndex?: number;
    newSectionIndex?: number;
    oldQuestionIndex?: number;
    newQuestionIndex?: number;
}

export interface State {
    sections: SectionList;
    questions: QuestionList;
    sectionOrder: Array<string>;
}

export function addSection(sectionIndex: number, section: ISection): Action {
    return {
        type: ActionTypes.ADD_SECTION,
        sectionIndex: sectionIndex,
        section: section,
    };
}

export function addNewSection(): Action {
    const sectionId = generateID();
    const newSection: ISection = { id: sectionId, questionOrder: [] };
    return {
        type: ActionTypes.ADD_NEW_SECTION,
        section: newSection,
    };
}

export function removeSection(sectionIndex: number): Action {
    return {
        type: ActionTypes.REMOVE_SECTION,
        sectionIndex: sectionIndex,
    };
}

// export function swapSection(
//     sectionIndex: number,
//     newSectionIndex: number,
// ): Action {
//     return {
//         type: ActionTypes.SWAP_SECTION,
//         sectionIndex: sectionIndex,
//         newSectionIndex: newSectionIndex,
//     };
// }

// export function addQuestion(
//     sectionIndex: number,
//     questionIndex: number,
//     question: IQuestion,
// ): Action {
//     return {
//         type: ActionTypes.ADD_QUESTION,
//         sectionIndex: sectionIndex,
//         questionIndex: questionIndex,
//         question: question,
//     };
// }

export function addNewQuestion(sectionId: string): Action {
    const questionId = generateID();
    const newQuestion: IQuestion = {
        id: questionId,
        sectionId: sectionId,
        questionText: '',
    };
    return {
        type: ActionTypes.ADD_NEW_QUESTION,
        question: newQuestion,
    };
}

export function removeQuestion(
    questionIndex: number,
    sectionId: string,
): Action {
    return {
        type: ActionTypes.REMOVE_QUESTION,
        questionIndex: questionIndex,
        sectionId: sectionId,
    };
}

// export function swapQuestion(
//     sectionIndex: number,
//     questionIndex: number,
//     newSectionIndex: number,
//     newQuestionIndex: number,
// ): Action {
//     return {
//         type: ActionTypes.SWAP_QUESTION,
//         sectionIndex: sectionIndex,
//         newSectionIndex: newSectionIndex,
//         questionIndex: questionIndex,
//         newQuestionIndex: newQuestionIndex,
//     };
// }

const reducer = produce((draft: State, action: Action | SwapAction) => {
    switch (action.type) {
        // case ActionTypes.ADD_SECTION:
        //     if (action.section)
        //         draft.sections[action.sectionIndex] = action.section;
        //     break;
        case ActionTypes.ADD_NEW_SECTION:
            if (action.section) {
                draft.sections[action.section.id] = action.section;
                draft.sectionOrder.push(action.section.id);
            }
            break;
        case ActionTypes.REMOVE_SECTION:
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
        // case SwapActionTypes.SWAP_SECTION:
        //     if (action.newSectionIndex) {
        //         const tmpSection = draft.sections[action.sectionIndex];
        //         draft.sections[action.sectionIndex] =
        //             draft.sections[action.newSectionIndex];
        //         draft.sections[action.newSectionIndex] = tmpSection;
        //     }
        //     break;
        // case ActionTypes.ADD_QUESTION:
        //     if (action.question && action.questionIndex)
        //         draft.sections[action.sectionIndex].questions[
        //             action.questionIndex
        //         ] = action.question;
        //     break;
        case ActionTypes.ADD_NEW_QUESTION:
            if (action.question) {
                draft.sections[action.question.sectionId].questionOrder.push(
                    action.question.id,
                );
                draft.questions[action.question.id] = action.question;
            }
            break;
        case ActionTypes.REMOVE_QUESTION:
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
        // case ActionTypes.SWAP_QUESTION:
        //     if (
        //         action.newSectionIndex &&
        //         action.newQuestionIndex &&
        //         action.questionIndex
        //     ) {
        //         const tmpQuestion =
        //             draft.sections[action.sectionIndex].questions[
        //                 action.questionIndex
        //             ];
        //         draft.sections[action.sectionIndex].questions[
        //             action.questionIndex
        //         ] =
        //             draft.sections[action.newSectionIndex].questions[
        //                 action.newQuestionIndex
        //             ];
        //         draft.sections[action.newSectionIndex].questions[
        //             action.questionIndex
        //         ] = tmpQuestion;
        //     }
        //     break;
    }
});

// export const oldReducer = (state: State, action: Action): State => {
//     switch (action.type) {
//         case ActionTypes.ADD_SECTION:
//             if (!action.section)
//                 throw new InvalidArgumentException('No section was provided');
//             state.sections[action.sectionIndex] = action.section;
//             return {
//                 sections: state.sections,
//             };
//         case ActionTypes.REMOVE_SECTION:
//             const {
//                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
//                 [action.sectionIndex]: removedSection,
//                 ...returnNewSections
//             } = state.sections;
//             return { sections: state.sections = returnNewSections };
//         case ActionTypes.ADD_QUESTION:
//             if (!action.question)
//                 throw new InvalidArgumentException('No question was provided');
//             if (!action.questionIndex)
//                 throw new InvalidArgumentException(
//                     'No questionIndex was provided',
//                 );
//             state.sections[action.sectionIndex].questions[
//                 action.questionIndex
//             ] = action.question;
//             return {
//                 sections: state.sections,
//             };
//         case ActionTypes.REMOVE_QUESTION:
//             if (!action.questionIndex)
//                 throw new InvalidArgumentException(
//                     'No questionIndex was provided',
//                 );
//             const sectionCopyRemoveQuestion = { ...state.sections };
//             const {
//                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
//                 [action.questionIndex]: removedQuestion,
//                 ...returnSectionWithNewQuestions
//             } = sectionCopyRemoveQuestion;
//             return {
//                 sections: returnSectionWithNewQuestions,
//             };

//         default:
//             return state;
//     }
// };

export const FormContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null,
});

export const FormContextProvider = (props: {
    children: JSX.Element;
}): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log(state);
    return (
        // eslint-disable-next-line
        // @ts-ignore
        <FormContext.Provider value={{ state, dispatch }}>
            {props.children}
        </FormContext.Provider>
    );
};
