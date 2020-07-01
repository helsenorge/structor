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
    id: string;
    choices: Array<string>;
    default?: string;
}

export interface INumber {
    id: string;
    hasMax: boolean;
    hasMin: boolean;
    maxValue: number;
    minValue: number;
    isDecimal: boolean;
    default?: number;
    unit?: string;
    hasUnit: boolean;
}

export interface IText {
    id: string;
    maxLength: number;
}

export interface IDateTime {
    id: string;
    isTime: boolean;
    isDate: boolean;
    /* Max date
        Min Date*/
}

export default AnswerTypes;