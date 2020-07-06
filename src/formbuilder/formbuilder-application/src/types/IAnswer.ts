export enum AnswerTypes {
    boolean = 'boolean',
    choice = 'choice',
    number = 'number',
    time = 'time',
    text = 'text',
    default = 'Trykk for å velge',
}

export enum FhirAnswerTypes {
    boolean = 'boolean',
    decimal = 'decimal',
    integer = 'integer',
    date = 'date',
    dateTime = 'dateTime',
    time = 'time',
    choice = 'choice',
    openChoice = 'open-choice',
    string = 'string',
    number = 'number',
    text = 'text',
    radio = 'radio',
}

export interface IAnswer {
    id: string;
}

export interface IChoice extends IAnswer {
    isMultiple: boolean;
    isOpen: boolean;
    choices: Array<string>;
    hasDefault: boolean;
    defaultValue?: number;
}

export interface INumber extends IAnswer {
    hasMax: boolean;
    hasMin: boolean;
    hasUnit: boolean;
    isDecimal: boolean;
    hasDefault: boolean;
    maxValue: number;
    minValue: number;
    defaultValue?: number;
    unit?: string;
}

export interface IText extends IAnswer {
    isLong: boolean;
    maxLength: number;
}

export interface ITime extends IAnswer {
    isTime: boolean;
    isDate: boolean;
    hasDefaultTime: boolean;
    hasStartTime: boolean;
    hasEndTime: boolean;
    defaultTime?: number;
    startTime?: number;
    endTime?: number;
}

export interface IBoolean extends IAnswer {
    isChecked: boolean;
    label: string;
}
export default AnswerTypes;
