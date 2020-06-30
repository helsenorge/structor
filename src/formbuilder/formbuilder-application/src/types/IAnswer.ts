export enum AnswerTypes {
    boolean = 'boolean',
    decimal = 'decimal',
    integer = 'integer',
    date = 'date',
    dateTime = 'dateTime',
    time = 'time',
    choice = 'choice',
    string = 'string',
    text = 'text',
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
