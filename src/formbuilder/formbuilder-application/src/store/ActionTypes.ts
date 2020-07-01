import ISection from '../types/ISection';
import IQuestion from '../types/IQuestion';
import { IChoice, IText, IDateTime, INumber } from '../types/IAnswer';

export enum UpdateActionTypes {
    ADD_SECTION = 'ADD_SECTION',
    ADD_NEW_SECTION = 'ADD_NEW_SECTION',
    REMOVE_SECTION = 'REMOVE_SECTION',
    ADD_QUESTION = 'ADD_QUESTION',
    ADD_NEW_QUESTION = 'ADD_NEW_QUESTION',
    REMOVE_QUESTION = 'REMOVE_QUESTION',
    UPDATE_ANSWER = 'UPDATE_ANSWER',
    UPDATE_QUESTION = 'UPDATE_QUESTION',
    UPDATE_SECTION = 'UPDATE_SECTION',
}

export enum SwapActionTypes {
    SWAP_SECTION = 'SWAP_SECTION',
    SWAP_QUESTION = 'SWAP_QUESTION',
}

export enum DuplicateActionTypes {
    DUPLICATE_SECTION = 'DUPLICATE_SECTION',
    DUPLICATE_QUESTION = 'DUPLICATE_QUESTION',
}

export enum MemberTypes {
    UPDATE = 'UPDATE',
    SWAP = 'SWAP',
    DUPLICATE = 'DUPLICATE',
}

export interface UpdateAction {
    type: UpdateActionTypes;
    member: MemberTypes.UPDATE;
    sectionIndex?: number;
    sectionId?: string;
    questionId?: string;
    questionIndex?: number;
    section?: ISection;
    question?: IQuestion;
    answer?: IText | IChoice | IDateTime | INumber;
    sectionTitle?: string;
}

export interface SwapAction {
    type: SwapActionTypes;
    member: MemberTypes.SWAP;
    sectionId?: string;
    oldSectionIndex?: number;
    newSectionIndex?: number;
    oldSectionId?: string;
    newSectionId?: string;
    oldQuestionIndex?: number;
    newQuestionIndex?: number;
}

export interface DuplicateAction {
    type: DuplicateActionTypes;
    member: MemberTypes.DUPLICATE;
    sectionId?: string;
    sectionIndex?: number;
    newSectionIndex?: number;
    newSectionId?: string;
    questionIndex?: number;
    questionId?: string;
    newQuestionIndex?: number;
    newQuestionId?: string;
}
