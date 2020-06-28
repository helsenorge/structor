import IAnswer, { IChoice } from "./IAnswer";

export default interface IQuestion {
    id: string;
    sectionId: string;
    questionText: string;
    answer: IAnswer | IChoice;
}
