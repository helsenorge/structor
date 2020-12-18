import { IOperator, IQuestionnaireItemType } from '../types/IQuestionnareItemType';

const itemType = [
    {
        display: 'Gruppe',
        code: IQuestionnaireItemType.group,
    },
    {
        display: 'Beskjed',
        code: IQuestionnaireItemType.display,
    },
    {
        display: 'Kortsvar',
        code: IQuestionnaireItemType.string,
    },
    {
        display: 'Langsvar',
        code: IQuestionnaireItemType.text,
    },
    {
        display: 'Flere alternativer',
        code: IQuestionnaireItemType.choice,
    },
    {
        display: 'Flere alternativer med åpent svar',
        code: IQuestionnaireItemType.openChoice,
    },
    {
        display: 'Dato',
        code: IQuestionnaireItemType.date,
    },
    {
        display: 'Tid',
        code: IQuestionnaireItemType.time,
    },
    {
        display: 'Tid og dato',
        code: IQuestionnaireItemType.dateTime,
    },
    {
        display: 'Bekreftelse',
        code: IQuestionnaireItemType.boolean,
    },
    {
        display: 'Tall',
        code: IQuestionnaireItemType.integer,
    },
];

export const checkboxExtension = [
    {
        url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
        valueString: 'Velg ett eller flere av alternativene.',
    },
    {
        url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
        valueCodeableConcept: {
            coding: [
                {
                    system: 'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
                    code: 'check-box',
                },
            ],
        },
    },
];

export const operator = [
    {
        code: IOperator.exists,
        display: 'Eksisterer',
    },
    {
        code: IOperator.equal,
        display: 'Er lik',
    },
    {
        code: IOperator.notEqual,
        display: 'Ikke lik',
    },
    {
        code: IOperator.greaterThan,
        display: 'Større enn',
    },
    {
        code: IOperator.lessThan,
        display: 'Mindre enn',
    },
    {
        code: IOperator.greaterThanOrEqual,
        display: 'Større enn eller lik',
    },
    {
        code: IOperator.lessThanOrEqual,
        display: 'Mindre enn eller lik',
    },
];

export const typeIsSupportingValidation = (type: IQuestionnaireItemType): boolean => {
    const validTypes = [
        IQuestionnaireItemType.integer,
        IQuestionnaireItemType.text,
        IQuestionnaireItemType.string,
        IQuestionnaireItemType.date,
    ];

    return validTypes.includes(type);
};

export default itemType;
