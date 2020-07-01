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

export interface IChoice {
    choices: Array<string>;
    default?: string;
}

export interface INumber {
    maxValue: number;
    minValue: number;
    isDecimal: boolean;
    default?: number;
    unit?: string;
}

export interface IText {
    maxLength: number;
}

export interface IDateTime {
    isTime: boolean;
    isDate: boolean;
    /* Max date
        Min Date*/
}
