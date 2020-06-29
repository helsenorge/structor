import IQuestion from './IQuestion';

export default interface ISection {
    id: string;
    questionOrder: Array<string>;
    title: string;
}
