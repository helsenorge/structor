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

// export default interface IAnswer {
//     type: AnswerTypes;
//     max?: number;
//     min?: number;
//     choices?: Array<string>;
// }

export default interface IAnswer {
    type: AnswerTypes;
    choices?: Array<string>;
    id: string;
}

export interface IChoice extends IAnswer {
    choices: Array<string>;
}