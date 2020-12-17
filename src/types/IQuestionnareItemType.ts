export enum IQuestionnaireItemType {
    group = 'group',
    display = 'display',
    boolean = 'boolean',
    decimal = 'decimal',
    integer = 'integer',
    date = 'date',
    dateTime = 'dateTime',
    time = 'time',
    string = 'string',
    text = 'text',
    url = 'url',
    choice = 'choice',
    openChoice = 'open-choice',
    attachment = 'attachment',
    reference = 'reference',
    quantity = 'quantity',
}

export enum IItemProperty {
    linkId = 'linkId',
    definition = 'definition',
    code = 'code',
    prefix = 'prefix',
    text = 'text',
    type = 'type',
    enableWhen = 'enableWhen',
    enableBehavior = 'enableBehavior',
    maxLength = 'maxLength',
    minLength = 'minLength',
    answerOption = 'answerOption',
    initial = 'initial',
    answerValueSet = 'answerValueSet',
    required = 'required',
    repeats = 'repeats',
    readOnly = 'readOnly',
    extension = 'extension',
}

export enum IOperator {
    exists = 'exists',
    equal = '=',
    notEqual = '!=',
    greaterThan = '>',
    lessThan = '<',
    greaterThanOrEqual = '>=',
    lessThanOrEqual = '<=',
}

export type IEnableWhen = {
    question?: string;
    operator?: string;
    answerInteger?: number;
};
