import { Option, Options, OptionGroup } from '../types/OptionTypes';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';

const makeOption = (display: string, code: string): Option => {
    return { display, code };
};

export const FhirpathAgeExpression =
    "Patient.extension.where(url = 'http://helsenorge.no/fhir/StructureDefinition/sdf-age').value";
export const FhirpathGenderExpression =
    "iif(%patient.gender.empty() or %patient.gender = 'other' or %patient.gender = 'unknown', 'Ukjent', iif(%patient.gender = 'female', 'Kvinne', 'Mann'))";

export const CreateOptionSetForType = (questionnaireType: string): Options => {
    let filter = null;
    switch (questionnaireType) {
        case IQuestionnaireItemType.boolean:
            filter = (it: EnrichmentExpessionMetadata) => it.type === 'boolean';
            break;
        case IQuestionnaireItemType.decimal:
        case IQuestionnaireItemType.integer:
        case IQuestionnaireItemType.quantity:
            filter = (it: EnrichmentExpessionMetadata) => it.type === 'number';
            break;
        case IQuestionnaireItemType.date:
            filter = (it: EnrichmentExpessionMetadata) => it.type === 'date';
            break;
        case IQuestionnaireItemType.dateTime:
            filter = (it: EnrichmentExpessionMetadata) => it.type === 'date' || it.type === 'dateTime';
            break;
        case IQuestionnaireItemType.time:
            filter = (it: EnrichmentExpessionMetadata) => it.type === 'time';
            break;
        case IQuestionnaireItemType.string:
        case IQuestionnaireItemType.text:
            filter = () => true;
            break;
        default:
            filter = () => false;
            break;
    }

    const groups: Array<OptionGroup> = [];
    const groupMap: { [id: string]: OptionGroup } = {};
    for (const entry of EnrichmentSet) {
        if (!filter(entry)) continue;

        if (!groupMap[entry.group]) {
            groupMap[entry.group] = { display: entry.group, options: [] };
            groups.push(groupMap[entry.group]);
        }

        const group = groupMap[entry.group];
        group.options.push(makeOption(entry.name, entry.expression));
    }

    return { options: groups };
};

type EnrichmentExpessionMetadata = {
    name: string;
    expression: string;
    group: 'Patient' | 'On behalf of citizen' | 'Representative relation' | 'General Practitioner' | 'Miscellaneous';
    type: 'string' | 'number' | 'date' | 'dateTime' | 'time' | 'boolean';
};

const EnrichmentSet: Array<EnrichmentExpessionMetadata> = [
    {
        name: 'National identity number',
        expression:
            "Patient.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Full name',
        expression: "Patient.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'First name',
        expression:
            "Patient.name.where(use = 'official').select(iif(given.count() > 1, given.take(count()-1), given).join(' '))",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Surname',
        expression: "Patient.name.where(use = 'official').family",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Birth date',
        expression: 'Patient.birthDate',
        group: 'Patient',
        type: 'date',
    },
    {
        name: 'Age',
        expression: "Patient.extension.where(url = 'http://helsenorge.no/fhir/StructureDefinition/sdf-age').value",
        group: 'Patient',
        type: 'number',
    },
    {
        name: 'Gender',
        expression:
            "iif(%patient.gender.empty() or %patient.gender = 'other' or %patient.gender = 'unknown', 'Ukjent', iif(%patient.gender = 'female', 'Kvinne', 'Mann'))",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Mobile phone number',
        expression: "Patient.telecom.where(use = 'mobile' and system = 'phone').value",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Email',
        expression: "Patient.telecom.where(use = 'home' and system = 'email').value",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Address',
        expression: "Patient.address.where(use = 'home').line.first()",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Zip code',
        expression: "Patient.address.where(use = 'home').postalCode",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Postal address',
        expression: "Patient.address.where(use = 'home').city",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Temporary c/o',
        expression: "Patient.address.where(use = 'temp').line[0]",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Temporary address',
        expression: "Patient.address.where(use = 'temp').line[1]",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Temporary postal code',
        expression: "Patient.address.where(use = 'temp').line[2]",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'Temporary postal address',
        expression: "Patient.address.where(use = 'temp').line[3]",
        group: 'Patient',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (national identity number)',
        expression:
            "RelatedPerson.identifier.where(use = 'official' and (system = 'urn:oid:2.16.578.1.12.4.1.4.1' or system = 'urn:oid:2.16.578.1.12.4.1.4.2')).value",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (name)',
        expression: "RelatedPerson.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (birth date)',
        expression: 'RelatedPerson.birthDate',
        group: 'On behalf of citizen',
        type: 'date',
    },
    {
        name: 'On behalf of citizen (age)',
        expression:
            "RelatedPerson.extension.where(url = 'http://helsenorge.no/fhir/StructureDefinition/sdf-age').value",
        group: 'On behalf of citizen',
        type: 'number',
    },
    {
        name: 'On behalf of citizen (gender)',
        expression:
            "iif(RelatedPerson.gender.empty() or RelatedPerson.gender = 'other' or RelatedPerson.gender = 'unknown', 'Ukjent', iif(RelatedPerson.gender = 'female', 'Kvinne', 'Mann'))",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (phone number)',
        expression: "RelatedPerson.telecom.where(use = 'mobile' and system = 'phone').value",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (address)',
        expression: "RelatedPerson.address.where(use = 'home').line.first()",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (postal code)',
        expression: "RelatedPerson.address.where(use = 'home').postalCode",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (postal address)',
        expression: "RelatedPerson.address.where(use = 'home').city",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (temporary c/o)',
        expression: "RelatedPerson.address.where(use = 'temp').line[0]",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (temporary address)',
        expression: "RelatedPerson.address.where(use = 'temp').line[1]",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (temporary postal code)',
        expression: "RelatedPerson.address.where(use = 'temp').line[2]",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'On behalf of citizen (temporary postal address)',
        expression: "RelatedPerson.address.where(use = 'temp').line[3]",
        group: 'On behalf of citizen',
        type: 'string',
    },
    {
        name: 'General Practitioner (full name)',
        expression: "Practitioner.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (first name)',
        expression:
            "Practitioner.name.where(use = 'official').select(iif(given.count() > 1, given.take(count()-1), given).join(' '))",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (surname)',
        expression: "Practitioner.name.where(use = 'official').family",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (business name)',
        expression: 'Practitioner.contained.first().name',
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (business phone number)',
        expression: "Practitioner.contained.first().telecom.where(use = 'work' and system = 'phone').value",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (address 1)',
        expression: "Practitioner.contained.first().address.where(use = 'work').line.first()",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (address 2)',
        expression: "Practitioner.contained.first().address.where(use = 'work').line.skip(1).first()",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (address 3)',
        expression: "Practitioner.contained.first().address.where(use = 'work').line.skip(2).first()",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (postal code)',
        expression: "Practitioner.contained.first().address.where(use = 'work').postalCode",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (postal address)',
        expression: "Practitioner.contained.first().address.where(use = 'work').city",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'General Practitioner (country)',
        expression: "Practitioner.contained.first().address.where(use = 'work').country",
        group: 'General Practitioner',
        type: 'string',
    },
    {
        name: 'Is questionnaire answered on behalf of someone else? (true/false)',
        expression:
            "iif(%representative.relationship.coding.where((system = 'http://hl7.org/fhir/v3/RoleCode' or system = 'urn:oid:2.16.578.1.12.4.1.1.7611') and (code = 'PRN' or code = 'GRANTEE' or code = 'FU' or code = 'TD' or code = 'FO' or code = 'VE')).count() > 0, true, false)",
        group: 'Representative relation',
        type: 'boolean',
    },
    {
        name: 'Represented by power of attorney? (true/false)',
        expression:
            "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'FU').count() > 0, true, false)",
        group: 'Representative relation',
        type: 'boolean',
    },
    {
        name: 'Represented by power of attorney for non-consent competent? (true/false)',
        expression:
            "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'TD').count() > 0, true, false)",
        group: 'Representative relation',
        type: 'boolean',
    },
    {
        name: 'Represented by parent? (true/false)',
        expression:
            "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'FO').count() > 0, true, false)",
        group: 'Representative relation',
        type: 'boolean',
    },
    {
        name: 'Represented by guardianship? (true/false)',
        expression:
            "iif(%representative.relationship.coding.where(system = 'urn:oid:2.16.578.1.12.4.1.1.7611' and code = 'VE').count() > 0, true, false)",
        group: 'Representative relation',
        type: 'boolean',
    },
    {
        name: 'Todays date',
        expression: 'today()',
        group: 'Miscellaneous',
        type: 'date',
    },
];
