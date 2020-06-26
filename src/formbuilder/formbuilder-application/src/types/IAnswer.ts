export enum AnswerTypes {
    'bool',
    'decimal',
    'integer',
    'date',
    'dateTime',
    'time',
    'choice',
    'string',
    'text',
}

export default interface IAnswer {
    type: AnswerTypes;
    max?: number;
    min?: number;
    choices?: [string];
}