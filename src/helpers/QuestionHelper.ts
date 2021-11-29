import { Coding, Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import { IExtentionType, IOperator, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { CodingSystemType } from './uriHelper';
import { Option, Options } from '../types/OptionTypes';
import { createItemControlExtension, isItemControlReceiverComponent, ItemControlType } from './itemControl';

export const ATTACHMENT_DEFAULT_MAX_SIZE = 5.0;

export const QUANTITY_UNIT_TYPE_NOT_SELECTED = 'QUANTITY_UNIT_TYPE_NOT_SELECTED';
export const QUANTITY_UNIT_TYPE_CUSTOM = 'QUANTITY_UNIT_TYPE_CUSTOM';
export const quantityUnitTypes = [
    {
        system: '',
        code: QUANTITY_UNIT_TYPE_NOT_SELECTED,
        display: 'No unit',
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
        display: 'year',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'mo',
        display: 'month',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'd',
        display: 'day',
    },
    {
        system: '',
        code: QUANTITY_UNIT_TYPE_CUSTOM,
        display: 'Custom',
    },
];

export const checkboxExtension = createItemControlExtension(ItemControlType.checkbox);
export const dropdownExtension = createItemControlExtension(ItemControlType.dropdown);

export const enableWhenOperatorBoolean: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
];

export const enableWhenOperatorChoice: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
];

export const enableWhenOperatorDate: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
    {
        code: IOperator.greaterThan,
        display: 'is later than',
    },
    {
        code: IOperator.lessThan,
        display: 'is earlier than',
    },
    {
        code: IOperator.greaterThanOrEqual,
        display: 'is later than or equal',
    },
    {
        code: IOperator.lessThanOrEqual,
        display: 'is earlier than or equal',
    },
];

export const enableWhenOperator: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
    {
        code: IOperator.greaterThan,
        display: 'is greater than',
    },
    {
        code: IOperator.lessThan,
        display: 'is less than',
    },
    {
        code: IOperator.greaterThanOrEqual,
        display: 'is greater than or equal',
    },
    {
        code: IOperator.lessThanOrEqual,
        display: 'is less than or equal',
    },
];

const makeOption = (display: string, code: string): Option => {
    return { display, code };
};

export const FhirpathAgeExpression =
    "Patient.extension.where(url = 'http://helsenorge.no/fhir/StructureDefinition/sdf-age').value";
export const FhirpathGenderExpression =
    "iif(%patient.gender.empty() or %patient.gender = 'other' or %patient.gender = 'unknown', 'Ukjent', iif(%patient.gender = 'female', 'Kvinne', 'Mann'))";

export const EnrichmentSet: Options = {
    options: [
        {
            display: 'Patient',
            options: [
                makeOption(
                    'National identity number',
                    "Patient.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
                ),
                makeOption('Full name', "Patient.name.where(use = 'official').select(given.join(' ') & ' ' & family)"),
                makeOption(
                    'First name',
                    "Patient.name.where(use = 'official').select(iif(given.count() > 1, given.take(count()-1), given).join(' '))",
                ),
                makeOption('Surname', "Patient.name.where(use = 'official').family"),
                makeOption('Age', FhirpathAgeExpression),
                makeOption('Gender', FhirpathGenderExpression),
                makeOption('Mobile phone number', "Patient.telecom.where(use = 'mobile' and system = 'phone').value"),
                makeOption('Email', "Patient.telecom.where(use = 'home' and system = 'email').value"),
                makeOption('Adress', "Patient.address.where(use = 'home').line.first()"),
                makeOption('Zip code', "Patient.address.where(use = 'home').postalCode"),
                makeOption('Postal adress', "Patient.address.where(use = 'home').city"),
                makeOption('Temporary c/o', "Patient.address.where(use = 'temp').line[0]"),
                makeOption('Temporary adress', "Patient.address.where(use = 'temp').line[1]"),
                makeOption('Temporary postal code', "Patient.address.where(use = 'temp').line[2]"),
                makeOption('Temporary postal adress', "Patient.address.where(use = 'temp').line[3]"),
            ],
        },
        {
            display: 'On behalf of citizen',
            options: [
                makeOption(
                    'On behalf of citizen (national identity number)',
                    "RelatedPerson.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
                ),
                makeOption(
                    'On behalf of citizen (name)',
                    "RelatedPerson.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
                ),
                makeOption(
                    'On behalf of citizen (phone number)',
                    "RelatedPerson.telecom.where(use = 'mobile' and system = 'phone').value",
                ),
                makeOption('On behalf of citizen (adress)', "RelatedPerson.address.where(use = 'home').line.first()"),
                makeOption(
                    'On behalf of citizen (postal code)',
                    "RelatedPerson.address.where(use = 'home').postalCode",
                ),
                makeOption('On behalf of citizen (postal adress)', "RelatedPerson.address.where(use = 'home').city"),
                makeOption('On behalf of citizen (temporary c/o)', "RelatedPerson.address.where(use = 'temp').line[0]"),
                makeOption(
                    'On behalf of citizen (temporary adress)',
                    "RelatedPerson.address.where(use = 'temp').line[1]",
                ),
                makeOption(
                    'On behalf of citizen (temporary postal code)',
                    "RelatedPerson.address.where(use = 'temp').line[2]",
                ),
                makeOption(
                    'On behalf of citizen (temporary postal adress)',
                    "RelatedPerson.address.where(use = 'temp').line[3]",
                ),
            ],
        },
        {
            display: 'Representative relation',
            options: [
                makeOption(
                    'Is questionnaire answered on behalf of someone else? (true/false)',
                    "iif(%representative.relationship.coding.where((system = 'http://hl7.org/fhir/v3/RoleCode' or system = 'urn:oid:2.16.578.1.12.4.1.1.7611') and (code = 'PRN' or code = 'GRANTEE' or code = 'FU' or code = 'TD' or code = 'FO' or code = 'VE')).count() > 0, true, false)",
                ),
                makeOption(
                    'Represented by power of attorney? (true/false)',
                    "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'FU').count() > 0, true, false)",
                ),
                makeOption(
                    'Represented by power of attorney for non-consent competent? (true/false)',
                    "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'TD').count() > 0, true, false)",
                ),
                makeOption(
                    'Represented by parent? (true/false)',
                    "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'FO').count() > 0, true, false)",
                ),
                makeOption(
                    'Represented by guardianship? (true/false)',
                    "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'VE').count() > 0, true, false)",
                ),
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

export const getPrefix = (item?: QuestionnaireItem): string => {
    return item?.prefix || '';
};

export const getSublabel = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtentionType.sublabel)?.valueMarkdown || '';
};

export const getRepeatsText = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtentionType.repeatstext)?.valueString || '';
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

export const isRecipientList = (item: QuestionnaireItem): boolean => {
    const isReceiverComponent = isItemControlReceiverComponent(item);
    return !isReceiverComponent && item.code?.find((x) => x.system === CodingSystemType.valueSetTqqc) !== undefined;
};
