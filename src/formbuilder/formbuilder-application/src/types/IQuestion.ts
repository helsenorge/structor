import { AnswerTypes, IChoice, INumber, IText, IDateTime } from './IAnswer';

export default interface IQuestion {
    id: string;
    sectionId: string;
    questionText: string;
    answerType: AnswerTypes;
    answer: IChoice | INumber | IText | IDateTime;
    hasDescription: boolean;
    isRequired: boolean;
    description?: string;
}
