export enum IQuestionnaireItemType {
    attachment = 'attachment',
    // address is not a fhir-type, but used internally for types choice
    address = 'address',
    boolean = 'boolean',
    choice = 'choice',
    date = 'date',
    dateTime = 'dateTime',
    decimal = 'decimal',
    display = 'display',
    group = 'group',
    // inline is not a fhir-type, but used internally for text item with itemControl 'inline'
    inline = 'inline',
    integer = 'integer',
    // number is not a fhir-type, but used internally for types integer, decimal and quantity
    number = 'number',
    openChoice = 'open-choice',
    // extention
    predefined = 'predifined',
    quantity = 'quantity',
    reference = 'reference',
    string = 'string',
    text = 'text',
    time = 'time',
    url = 'url',
}

export enum ICodingProperty {
    code = 'code',
    display = 'display',
    system = 'system',
}

export enum IItemProperty {
    answerOption = 'answerOption',
    answerValueSet = 'answerValueSet',
    code = 'code',
    definition = 'definition',
    enableBehavior = 'enableBehavior',
    enableWhen = 'enableWhen',
    extension = 'extension',
    initial = 'initial',
    linkId = 'linkId',
    maxLength = 'maxLength',
    prefix = 'prefix',
    text = 'text',
    _text = '_text',
    readOnly = 'readOnly',
    repeats = 'repeats',
    required = 'required',
    type = 'type',
}

export enum IOperator {
    greaterThan = '>',
    greaterThanOrEqual = '>=',
    lessThan = '<',
    lessThanOrEqual = '<=',
    notEqual = '!=',
    equal = '=',
    exists = 'exists',
}

export type IEnableWhen = {
    answerInteger?: number;
    operator?: string;
    question?: string;
};

export enum IExtentionType {
    canBePerformedBy = 'http://ehelse.no/fhir/StructureDefinition/sdf-canbeperformedby',
    canBePerformedByValueSet = 'http://ehelse.no/fhir/ValueSet/CanBePerformedBy',
    endpoint = 'http://ehelse.no/fhir/StructureDefinition/sdf-endpoint',
    entryFormat = 'http://hl7.org/fhir/StructureDefinition/entryFormat',
    fhirPath = 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
    guidanceAction = 'http://helsenorge.no/fhir/StructureDefinition/sdf-guidanceaction',
    guidanceParam = 'http://helsenorge.no/fhir/StructureDefinition/sdf-guidanceparameter',
    hidden = 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
    itemControl = 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    itemControlValueSet = 'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
    markdown = 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
    maxDecimalPlaces = 'http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces',
    maxSize = 'http://hl7.org/fhir/StructureDefinition/maxSize',
    maxValue = 'http://hl7.org/fhir/StructureDefinition/maxValue',
    minValue = 'http://hl7.org/fhir/StructureDefinition/minValue',
    optionReference = 'http://ehelse.no/fhir/StructureDefinition/sdf-optionReference',
    presentationbuttons = 'http://helsenorge.no/fhir/StructureDefinition/sdf-presentationbuttons',
    presentationbuttonsValueSet = 'http://helsenorge.no/fhir/ValueSet/presentationbuttons',
    questionnaireUnit = 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
    regEx = 'http://hl7.org/fhir/StructureDefinition/regex',
    sotHeader = 'http://ehelse.no/fhir/ValueSet/SOTHeaders',
    validationtext = 'http://ehelse.no/fhir/StructureDefinition/validationtext',
    generatePDF = 'http://ehelse.no/fhir/StructureDefinition/sdf-generatepdf',
}
