import IQuestion from './IQuestion';

export default interface ISection {
    readonly id: number;
    readonly questions: { [questionNumber: number]: IQuestion };
}
