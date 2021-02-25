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
    // extention
    predefined = 'predifined',
    // number is not a fhir-type, but used internally for types integer, decimal and quantity
    number = 'number',
}

export enum IItemProperty {
    linkId = 'linkId',
    definition = 'definition',
    code = 'code',
    prefix = 'prefix',
    text = 'text',
    _text = '_text',
    type = 'type',
    enableWhen = 'enableWhen',
    enableBehavior = 'enableBehavior',
    maxLength = 'maxLength',
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

export enum IExtentionType {
    validationtext = 'http://ehelse.no/fhir/StructureDefinition/validationtext',
    minValue = 'http://hl7.org/fhir/StructureDefinition/minValue',
    maxValue = 'http://hl7.org/fhir/StructureDefinition/maxValue',
    regEx = 'http://hl7.org/fhir/StructureDefinition/regex',
    maxDecimalPlaces = 'http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces',
    markdown = 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
    questionnaireUnit = 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
    itemControl = 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    fhirPath = 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
    endpoint = 'http://ehelse.no/fhir/StructureDefinition/sdf-endpoint',
    itemControlValueSet = 'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
    sotHeader = 'http://ehelse.no/fhir/ValueSet/SOTHeaders',
}
