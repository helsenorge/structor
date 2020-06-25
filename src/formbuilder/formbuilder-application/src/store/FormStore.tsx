import React, { useReducer, createContext, Dispatch } from 'react';
import Section from '../types/Section';
import Question from '../types/Question';
import { SectionList } from '../types/Form';
import produce from 'immer';

const initSection: Section = { id: 0, questions: [] };

export const initialState: State = { sections: { 0: initSection } };

export enum ActionTypes {
    ADD_SECTION,
    ADD_NEW_SECTION,
    REMOVE_SECTION,
    ADD_QUESTION,
    ADD_NEW_QUESTION,
    REMOVE_QUESTION,
}

export interface Action {
    type: ActionTypes;
    sectionIndex: number;
    questionIndex?: number;
    section?: Section;
    question?: Question;
}
export interface State {
    readonly sections: SectionList;
}

export function addSection(sectionIndex: number, section: Section): Action {
    return {
        type: ActionTypes.ADD_SECTION,
        sectionIndex: sectionIndex,
        section: section,
        question: { id: 0, questionText: '', sectionId: sectionIndex },
        questionIndex: 0,
    };
}

export function addNewSection(sectionIndex: number): Action {
    const newSection: Section = { id: sectionIndex, questions: [] };
    return {
        type: ActionTypes.ADD_NEW_SECTION,
        sectionIndex: sectionIndex,
        section: newSection,
        question: { id: 0, questionText: '', sectionId: sectionIndex },
        questionIndex: 0,
    };
}

export function removeSection(sectionIndex: number): Action {
    return {
        type: ActionTypes.REMOVE_SECTION,
        sectionIndex: sectionIndex,
    };
}

export function addQuestion(
    sectionIndex: number,
    questionIndex: number,
    question: Question,
): Action {
    return {
        type: ActionTypes.ADD_QUESTION,
        sectionIndex: sectionIndex,
        questionIndex: questionIndex,
        question: question,
    };
}

export function removeQuestion(
    sectionIndex: number,
    questionIndex: number,
): Action {
    return {
        type: ActionTypes.REMOVE_QUESTION,
        sectionIndex: sectionIndex,
        questionIndex: questionIndex,
    };
}

const reducer = produce((draft: State, action: Action) => {
    switch (action.type) {
        case ActionTypes.ADD_SECTION:
            if (action.section)
                draft.sections[action.sectionIndex] = action.section;
            break;
        case ActionTypes.ADD_NEW_SECTION:
            if (action.section)
                draft.sections[action.sectionIndex] = action.section;
            break;
        case ActionTypes.REMOVE_SECTION:
            delete draft.sections[action.sectionIndex];
            break;
        case ActionTypes.ADD_QUESTION:
            if (action.question && action.questionIndex)
                draft.sections[action.sectionIndex].questions[
                    action.questionIndex
                ] = action.question;
            break;
        case ActionTypes.REMOVE_QUESTION:
            if (action.questionIndex)
                delete draft.sections[action.sectionIndex].questions[
                    action.questionIndex
                ];
            break;
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
        <FormContext.Provider value={{ state, dispatch }}>
            {props.children}
        </FormContext.Provider>
    );
};
