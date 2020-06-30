import IAnswer, { AnswerTypes, IChoice, IExtremas, IText } from './IAnswer';

export default interface IQuestion {
    id: string;
    sectionId: string;
    questionText: string;
    answerType: AnswerTypes;
    answer: IAnswer | IChoice | IExtremas | IText;
    hasDescription: boolean;
    isRequired: boolean;
    description?: string;
}
