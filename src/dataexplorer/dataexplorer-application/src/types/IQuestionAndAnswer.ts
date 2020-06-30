import { QuestionnaireItem, QuestionnaireResponseItem } from './fhirTypes/fhir';

export interface IAnswer {
    id: string;
    answers: QuestionnaireResponseItem;
}
export interface IQuestion {
    id: string;
    questions: QuestionnaireItem;
}

export interface IQuestionAndAnswer {
    id: string;
    answers?: IAnswer;
    questions: IQuestion;
}
