import React, { useReducer, createContext, Dispatch } from 'react';
import ISection from '../types/ISection';
import IQuestion from '../types/IQuestion';
import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';
import { generateID } from '../helpers/IDGenerator';
import produce from 'immer';
import {
    AnswerTypes,
    IChoice,
    IDateTime,
    INumber,
    IText,
} from '../types/IAnswer';
import {
    UpdateAction,
    UpdateActionTypes,
    DuplicateAction,
    DuplicateActionTypes,
    SwapAction,
    SwapActionTypes,
    MemberTypes,
} from './ActionTypes';
import UpdateActions from './UpdateActions';
import SwapActions from './SwapActions';
import DuplicateActions from './DuplicateActions';

const initSectionId = generateID();
const initSection: ISection = {
    id: initSectionId,
    questionOrder: [],
    sectionTitle: '',
};
const initSections: SectionList = {};
initSections[initSectionId] = initSection;

export const initialState: State = {
    sections: initSections,
    questions: {},
    sectionOrder: [initSectionId],
};

export interface State {
    sections: SectionList;
    questions: QuestionList;
    sectionOrder: Array<string>;
}

export function addNewSection(): UpdateAction {
    const sectionId = generateID();
    return {
        type: UpdateActionTypes.ADD_NEW_SECTION,
        member: MemberTypes.UPDATE,
        section: {
            id: sectionId,
            questionOrder: [],
            sectionTitle: '',
        },
    };
}

export function duplicateSection(
    sectionIndex: number,
    sectionId: string,
): DuplicateAction {
    const newSectionId = generateID();
    const newSectionIndex = sectionIndex + 1;
    return {
        type: DuplicateActionTypes.DUPLICATE_SECTION,
        member: MemberTypes.DUPLICATE,
        sectionIndex: sectionIndex,
        sectionId: sectionId,
        newSectionIndex: newSectionIndex,
        newSectionId: newSectionId,
    };
}

export function removeSection(sectionIndex: number): UpdateAction {
    return {
        type: UpdateActionTypes.REMOVE_SECTION,
        member: MemberTypes.UPDATE,
        sectionIndex: sectionIndex,
    };
}

export function swapSection(
    oldSectionIndex: number,
    newSectionIndex: number,
): SwapAction {
    return {
        type: SwapActionTypes.SWAP_SECTION,
        member: MemberTypes.SWAP,
        oldSectionIndex: oldSectionIndex,
        newSectionIndex: newSectionIndex,
    };
}

export function updateSection(
    sectionId: string,
    sectionTitle: string,
): UpdateAction {
    return {
        type: UpdateActionTypes.UPDATE_SECTION,
        member: MemberTypes.UPDATE,
        sectionId: sectionId,
        sectionTitle: sectionTitle,
    };
}

export function addNewQuestion(sectionId: string): UpdateAction {
    const questionId = generateID();
    const newQuestion: IQuestion = {
        id: questionId,
        sectionId: sectionId,
        questionText: '',
        answerType: AnswerTypes.boolean,
        answer: { id: generateID(), choices: [''] },
        isRequired: true,
        hasDescription: false,
    };
    return {
        type: UpdateActionTypes.ADD_NEW_QUESTION,
        member: MemberTypes.UPDATE,
        question: newQuestion,
    };
}

export function duplicateQuestion(
    sectionId: string,
    questionIndex: number,
    questionId: string,
): DuplicateAction {
    const newQuestionId = generateID();
    const newQuestionIndex = questionIndex + 1;
    return {
        type: DuplicateActionTypes.DUPLICATE_QUESTION,
        member: MemberTypes.DUPLICATE,
        sectionId: sectionId,
        questionId: questionId,
        newQuestionIndex: newQuestionIndex,
        newQuestionId: newQuestionId,
    };
}

export function removeQuestion(
    questionIndex: number,
    sectionId: string,
): UpdateAction {
    return {
        type: UpdateActionTypes.REMOVE_QUESTION,
        member: MemberTypes.UPDATE,
        questionIndex: questionIndex,
        sectionId: sectionId,
    };
}

export function swapQuestion(
    oldSectionId: string,
    oldQuestionIndex: number,
    newSectionId: string,
    newQuestionIndex: number,
): SwapAction {
    return {
        type: SwapActionTypes.SWAP_QUESTION,
        member: MemberTypes.SWAP,
        oldQuestionIndex: oldQuestionIndex,
        newQuestionIndex: newQuestionIndex,
        oldSectionId: oldSectionId,
        newSectionId: newSectionId,
    };
}

export function updateQuestion(question: IQuestion): UpdateAction {
    return {
        type: UpdateActionTypes.UPDATE_QUESTION,
        member: MemberTypes.UPDATE,
        question: question,
    };
}

export function updateAnswer(
    questionId: string,
    answer: IChoice | INumber | IText | IDateTime,
): UpdateAction {
    console.log(answer);
    return {
        type: UpdateActionTypes.UPDATE_ANSWER,
        member: MemberTypes.UPDATE,
        questionId: questionId,
        answer: answer,
    };
}

const reducer = produce(
    (draft: State, action: UpdateAction | SwapAction | DuplicateAction) => {
        switch (action.member) {
            case MemberTypes.UPDATE:
                UpdateActions(draft, action as UpdateAction);
                break;
            case MemberTypes.SWAP:
                SwapActions(draft, action as SwapAction);
                break;
            case MemberTypes.DUPLICATE:
                DuplicateActions(draft, action as DuplicateAction);
                break;
        }
    },
);

export const FormContext = createContext<{
    state: State;
    dispatch: Dispatch<UpdateAction | SwapAction | DuplicateAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

export const FormContextProvider = (props: {
    children: JSX.Element;
}): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        // eslint-disable-next-line
        // @ts-ignore
        <FormContext.Provider value={{ state, dispatch }}>
            {props.children}
        </FormContext.Provider>
    );
};
