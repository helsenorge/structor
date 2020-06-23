import Question from './Question';
import ISection from './ISection';
import InvalidArgumentException from './InvalidArgumentException';

export default class Section implements ISection {
    id: number;
    questions: Array<Question>;

    constructor(id: number, questions?: Array<Question>) {
        this.id = id;
        this.questions = questions ? questions : [];
    }

    addQuestion(question: Question, index?: number): void {
        if (!question)
            throw new InvalidArgumentException('No question was provided');
        if (!index) this.questions.push(question);
        else {
            this.questions.splice(index, 0, question);
        }
    }

    removeQuestion(index: number): void {
        if (!index) throw new InvalidArgumentException('No index was provided');
        this.questions.splice(index, 1);
    }
}
