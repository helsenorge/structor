import { AnswerTypes, IAnswer } from './IAnswer';

export default interface IQuestion {
    id: string;
    valid?: true;
    sectionId: string;
    questionText: string;
    answerType: AnswerTypes;
    answer: IAnswer;
    isRequired: boolean;
    isDependent: boolean;
    collapsed: boolean;
    dependentOf?: string;
    placeholder?: string;
}
