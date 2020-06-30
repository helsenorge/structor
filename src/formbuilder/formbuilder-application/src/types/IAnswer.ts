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
    radio = 'radio',
}

export default interface IAnswer {
    type: AnswerTypes;
}

export interface IChoice extends IAnswer {
    choices: Array<string>;
}

export interface IExtremas extends IAnswer {
    maxValue: number;
    minValue: number;
}

export interface IText extends IAnswer {
    maxLength: number;
}
