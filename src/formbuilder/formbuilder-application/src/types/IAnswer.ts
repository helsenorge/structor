export enum AnswerTypes {
    boolean = 'boolean',
    choice = 'choice',
    number = 'number',
    time = 'time',
    text = 'text',
    default = 'Trykk for å velge',
}

export interface IAnswer {
    id: string;
}

export interface IChoice extends IAnswer {
    isMultiple: boolean;
    isOpen: boolean;
    choices: Array<string>;
    defaultValue?: number;
}

export interface INumber extends IAnswer {
    hasMax: boolean;
    hasMin: boolean;
    hasUnit: boolean;
    isDecimal: boolean;
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
    defaultTime?: string;
    startTime?: string;
    endTime?: string;
}

export interface IBoolean extends IAnswer {
    isChecked: boolean;
    label: string;
}
export default AnswerTypes;
