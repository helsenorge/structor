import Question from './Question';

export default interface Section {
    readonly id: number;
    readonly questions: { [questionNumber: number]: Question };
}
