export interface IAnswer {
    id: string;
    answers: fhir.QuestionnaireResponseItem;
}
export interface IQuestion {
    id: string;
    questions: fhir.QuestionnaireItem;
}

export interface IQuestionAndAnswer {
    id: string;
    answers?: IAnswer;
    questions: IQuestion;
}
