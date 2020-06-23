import IQuestion from './IQuestion';

export default interface ISection {
    id: number;
    questions: Array<IQuestion>;
}
