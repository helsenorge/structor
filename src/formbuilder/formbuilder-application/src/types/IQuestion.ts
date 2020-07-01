import { AnswerTypes, IChoice, INumber, IText } from './IAnswer';

export default interface IQuestion {
    id: string;
    sectionId: string;
    questionText: string;
    answerType: AnswerTypes;
    answer: IChoice | INumber | IText;
    hasDescription: boolean;
    isRequired: boolean;
    description?: string;
}
