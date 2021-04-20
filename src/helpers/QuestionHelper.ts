import { Coding, Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import { IExtentionType, IOperator, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { CodingSystemType } from './systemHelper';
import { Options } from '../types/OptionTypes';

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
        display: 'Alternativer',
        code: IQuestionnaireItemType.choice,
    },
    {
        display: 'Alternativer med åpent svar',
        code: IQuestionnaireItemType.openChoice,
    },
    {
        display: 'Forhåndsdefinerte alternativer',
        code: IQuestionnaireItemType.predefined,
    },
    {
        display: 'Mottakerliste',
        code: IQuestionnaireItemType.address,
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
    {
        display: 'Vedlegg',
        code: IQuestionnaireItemType.attachment,
    },
    {
        display: 'Utvidbar info',
        code: IQuestionnaireItemType.inline,
    },
];

export const ATTACHMENT_DEFAULT_MAX_SIZE = 5.0;

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
        display: 'Er besvart',
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
        display: 'Er besvart',
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
        display: 'Er besvart',
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
        display: 'Er besvart',
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
        IQuestionnaireItemType.attachment,
        IQuestionnaireItemType.number,
        IQuestionnaireItemType.quantity,
        IQuestionnaireItemType.text,
        IQuestionnaireItemType.string,
        IQuestionnaireItemType.date,
    ];

    return validTypes.includes(type);
};

export const EnrichmentSet: Options = {
    options: [
        {
            display: 'Pasient',
            options: [
                {
                    code:
                        "Patient.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
                    display: 'Fødselsnummer',
                },
                {
                    code: "Patient.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
                    display: 'Fullt navn',
                },
                {
                    code:
                        "Patient.name.where(use = 'official').select(iif(given.count() > 1, given.take(count()-1), given).join(' '))",
                    display: 'Fornavn',
                },
                {
                    code: "Patient.name.where(use = 'official').family",
                    display: 'Etternavn',
                },
                {
                    code: "Patient.telecom.where(use = 'mobile' and system = 'phone').value",
                    display: 'Mobiltelefonnummer',
                },
                {
                    code: "Patient.telecom.where(use = 'home' and system = 'email').value",
                    display: 'Epost',
                },
                {
                    code: "Patient.address.where(use = 'home').line.first()",
                    display: 'Adresse',
                },
                {
                    code: "Patient.address.where(use = 'home').postalCode",
                    display: 'Postnummer',
                },
                {
                    code: "Patient.address.where(use = 'home').city",
                    display: 'Poststed',
                },
                {
                    code: "Patient.address.where(use = 'temp').line[0]",
                    display: 'Midlertidig c/o',
                },
                {
                    code: "Patient.address.where(use = 'temp').line[1]",
                    display: 'Midlertidig adresse',
                },
                {
                    code: "Patient.address.where(use = 'temp').line[2]",
                    display: 'Midlertidig postnummer',
                },
                {
                    code: "Patient.address.where(use = 'temp').line[3]",
                    display: 'Midlertidig poststed',
                },
            ],
        },
        {
            display: 'På vegne av innbygger',
            options: [
                {
                    code:
                        "RelatedPerson.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
                    display: 'På vegne av innbygger (Fødselsnummer)',
                },
                {
                    code: "RelatedPerson.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
                    display: 'På vegne av innbygger (Navn)',
                },
                {
                    code: "RelatedPerson.telecom.where(use = 'mobile' and system = 'phone').value",
                    display: 'På vegne av innbygger (Mobiltelefonnummer)',
                },
                {
                    code: "RelatedPerson.address.where(use = 'home').line.first()",
                    display: 'På vegne av innbygger (Adresse)',
                },
                {
                    code: "RelatedPerson.address.where(use = 'home').postalCode",
                    display: 'På vegne av innbygger (Postnummer)',
                },
                {
                    code: "RelatedPerson.address.where(use = 'home').city",
                    display: 'På vegne av innbygger (Poststed)',
                },
                {
                    code: "RelatedPerson.address.where(use = 'temp').line[0]",
                    display: 'På vegne av innbygger (Midlertidig c/o)',
                },
                {
                    code: "RelatedPerson.address.where(use = 'temp').line[1]",
                    display: 'På vegne av innbygger (Midlertidig adresse)',
                },
                {
                    code: "RelatedPerson.address.where(use = 'temp').line[2]",
                    display: 'På vegne av innbygger (Midlertidig postnummer)',
                },
                {
                    code: "RelatedPerson.address.where(use = 'temp').line[3]",
                    display: 'På vegne av innbygger (Midlertidig poststed)',
                },
            ],
        },
    ],
};

export const getInitialText = (item?: QuestionnaireItem): string => {
    if (
        (item?.type === IQuestionnaireItemType.text || item?.type === IQuestionnaireItemType.string) &&
        item?.initial &&
        item.initial[0]
    ) {
        return item.initial[0].valueString || '';
    }
    return '';
};

export const getValidationMessage = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtentionType.validationtext)?.valueString || '';
};

export const getPlaceHolderText = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtentionType.entryFormat)?.valueString || '';
};

export const getMarkdownText = (extensions?: Extension[]): string => {
    return extensions?.find((extension) => extension.url === IExtentionType.markdown)?.valueMarkdown || '';
};

export const getGuidanceAction = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtentionType.guidanceAction)?.valueString || '';
};

export const getGuidanceParameterName = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtentionType.guidanceParam)?.valueString || '';
};

export const isValidGuidanceParameterName = (name: string): boolean => {
    const regExp = /^[A-Za-z0-9_]{1,254}$/;
    return regExp.test(name);
};

export const valueSetTqqcCoding: Coding = {
    system: CodingSystemType.valueSetTqqc,
    code: '1',
    display: 'Technical endpoint for receiving QuestionnaireResponse',
};

export const isRecipientList = (item?: QuestionnaireItem): boolean => {
    return (item?.code && item.code[0].system === CodingSystemType.valueSetTqqc) || false;
};

export default itemType;
