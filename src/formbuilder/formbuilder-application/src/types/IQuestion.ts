import {
    AnswerTypes,
    IChoice,
    INumber,
    IText,
    ITime,
    IBoolean,
    IAnswer,
} from './IAnswer';

export default interface IQuestion {
    id: string;
    sectionId: string;
    questionText: string;
    answerType: AnswerTypes;
    answer: IAnswer;
    hasDescription: boolean;
    isRequired: boolean;
    isDependent: boolean;
    dependentOf?: string;
    description?: string;
}
