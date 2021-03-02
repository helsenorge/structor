import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import { IExtentionType, IOperator, IQuestionnaireItemType } from '../types/IQuestionnareItemType';

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
        display: 'Predefinerte alternativer',
        code: IQuestionnaireItemType.predefined,
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
        // Used for itemTypes integer and decimal
        display: 'Tall',
        code: IQuestionnaireItemType.number,
    },
    {
        display: 'Antall med enhet',
        code: IQuestionnaireItemType.quantity,
    },
];

export const QUANTITY_UNIT_TYPE_NOT_SELECTED = 'QUANTITY_UNIT_TYPE_NOT_SELECTED';
export const quantityUnitTypes = [
    {
        system: '',
        code: QUANTITY_UNIT_TYPE_NOT_SELECTED,
        display: 'Velg enhet',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'cm',
        display: 'centimeter',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'kg',
        display: 'kilo',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'a',
        display: 'år',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'mo',
        display: 'måned',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'd',
        display: 'dag',
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

export const enableWhenOperatorBoolean: ValueSetComposeIncludeConcept[] = [
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
        display: 'Ikke er lik',
    },
];

export const enableWhenOperatorChoice: ValueSetComposeIncludeConcept[] = [
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
        display: 'Ikke er lik',
    },
];

export const enableWhenOperatorDate: ValueSetComposeIncludeConcept[] = [
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
        display: 'Ikke er lik',
    },
    {
        code: IOperator.greaterThan,
        display: 'Er etter',
    },
    {
        code: IOperator.lessThan,
        display: 'Er før',
    },
    {
        code: IOperator.greaterThanOrEqual,
        display: 'Er etter eller lik',
    },
    {
        code: IOperator.lessThanOrEqual,
        display: 'Er før eller lik',
    },
];

export const enableWhenOperator: ValueSetComposeIncludeConcept[] = [
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
        display: 'Ikke er lik',
    },
    {
        code: IOperator.greaterThan,
        display: 'Er større enn',
    },
    {
        code: IOperator.lessThan,
        display: 'Er mindre enn',
    },
    {
        code: IOperator.greaterThanOrEqual,
        display: 'Er større enn eller lik',
    },
    {
        code: IOperator.lessThanOrEqual,
        display: 'Er mindre enn eller lik',
    },
];

export const typeIsSupportingValidation = (type: IQuestionnaireItemType): boolean => {
    const validTypes = [
        IQuestionnaireItemType.integer,
        IQuestionnaireItemType.decimal,
        IQuestionnaireItemType.quantity,
        IQuestionnaireItemType.text,
        IQuestionnaireItemType.string,
        IQuestionnaireItemType.date,
    ];

    return validTypes.includes(type);
};

export const EnrichmentSet: ValueSetComposeIncludeConcept[] = [
    {
        code: "Patient.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
        display: 'Navn',
    },
    {
        code:
            "Patient.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
        display: 'Fødselsnummer',
    },
    {
        code: "Patient.telecom.where(use = 'home' and system = 'email').value",
        display: 'Epost',
    },
    {
        code:
            "RelatedPerson.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
        display: 'På vegne av innbygger (Fødselsnummer)',
    },
    {
        code: "RelatedPerson.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
        display: 'På vegne av innbygger (Navn)',
    },
];

export const getValidationMessage = (item: QuestionnaireItem): string => {
    return item.extension?.find((extension) => extension.url === IExtentionType.validationtext)?.valueString || '';
};

export const getPlaceHolderText = (item: QuestionnaireItem): string => {
    return item.extension?.find((extension) => extension.url === IExtentionType.entryFormat)?.valueString || '';
};

export default itemType;
