import IQuestion from '../types/IQuestion';
import AnswerTypes, {
    INumber,
    FhirAnswerTypes,
    IText,
    IChoice,
    IBoolean,
    ITime,
} from '../types/IAnswer';
import { ValueSetMap } from './JSONGenerator';
import moment from 'moment';

const standardValidationTextUrl =
    'http://ehelse.no/fhir/StructureDefinition/validationtext';

export default function convertQuestion(
    question: IQuestion,
    linkId: string,
    valueSetMap: ValueSetMap,
): fhir.QuestionnaireItem {
    const subItem: fhir.QuestionnaireItem = {
        linkId: linkId,
        type: FhirAnswerTypes.text,
        text: question.questionText,
        required: question.isRequired, // TODO: true | false
        repeats: false, // TODO
        readOnly: false, // TODO
    };
    switch (question.answerType) {
        case AnswerTypes.number:
            return convertNumber(question, subItem);
        case AnswerTypes.text:
            return convertText(question, subItem);
        case AnswerTypes.choice:
            return convertChoice(question, subItem, valueSetMap);
        case AnswerTypes.boolean:
            return convertBoolean(question, subItem);
        case AnswerTypes.time:
            return convertDate(question, subItem);
        default:
            return subItem;
    }
}

function convertNumber(
    question: IQuestion,
    subItem: fhir.QuestionnaireItem,
): fhir.QuestionnaireItem {
    const answer = question.answer as INumber;
    subItem.type = answer.isDecimal
        ? FhirAnswerTypes.decimal
        : FhirAnswerTypes.integer;
    subItem.extension = new Array<fhir.Extension>();

    if (answer.hasMax && answer.hasMin) {
        if (question.isRequired)
            subItem.extension.push({
                url: standardValidationTextUrl,
                valueString:
                    'Fyll ut feltet med et tall mellom ' +
                    answer.minValue +
                    ' og ' +
                    answer.maxValue,
            });
        subItem.extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
            valueInteger: answer.maxValue,
        });
        subItem.extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/minValue',
            valueInteger: answer.minValue,
        });
    } else if (answer.hasMax) {
        if (question.isRequired)
            subItem.extension.push({
                url: standardValidationTextUrl,
                valueString:
                    'Fyll ut feltet med et tall mindre enn ' + answer.maxValue,
            });
        subItem.extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
            valueInteger: answer.maxValue,
        });
    } else if (answer.hasMin) {
        if (question.isRequired)
            subItem.extension.push({
                url: standardValidationTextUrl,
                valueString:
                    'Fyll ut feltet med et tall større enn ' + answer.minValue,
            });
        subItem.extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/minValue',
            valueInteger: answer.minValue,
        });
    }
    if (answer.hasDefault) {
        answer.isDecimal
            ? (subItem.initialDecimal = answer.defaultValue)
            : (subItem.initialInteger = answer.defaultValue);
    }
    return subItem;
}

function convertText(
    question: IQuestion,
    subItem: fhir.QuestionnaireItem,
): fhir.QuestionnaireItem {
    const answer = question.answer as IText;
    subItem.maxLength = answer.maxLength; // TODO: CHeck if we need to write 100 as maxLength here or if we do it earlier
    subItem.type = FhirAnswerTypes.text;
    if (question.isRequired)
        subItem.extension?.push({
            url: standardValidationTextUrl,
            valueString: 'Fyll ut feltet.',
        });
    return subItem;
}

function convertChoice(
    question: IQuestion,
    subItem: fhir.QuestionnaireItem,
    valueSetMap: ValueSetMap,
): fhir.QuestionnaireItem {
    const answer = question.answer as IChoice;
    subItem.type = answer.isOpen
        ? FhirAnswerTypes.openChoice
        : FhirAnswerTypes.choice;
    if (question.isRequired)
        subItem.extension?.push({
            url: standardValidationTextUrl,
            valueString: answer.isMultiple ? 'Velg minst én' : 'Velg en',
        });
    if (answer.hasDefault)
        subItem.initialCoding = {
            system: valueSetMap[answer.id],
            code: String(answer.defaultValue ? answer.defaultValue : 1),
        };
    subItem.extension?.push({
        url:
            'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
        valueCodeableConcept: {
            coding: [
                {
                    system:
                        'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
                    code: answer.isMultiple ? 'check-box' : 'radio-button',
                },
            ],
        },
    });
    return subItem;
}

function convertBoolean(question: IQuestion, subItem: fhir.QuestionnaireItem) {
    const answer = question.answer as IBoolean;
    if (question.isRequired)
        subItem.extension?.push({
            url: standardValidationTextUrl,
            valueString: 'Må hukes av',
        });
    subItem.text = answer.label;
    subItem.type = FhirAnswerTypes.boolean;
    if (answer.isChecked) subItem.initialBoolean = true;
    return subItem;
}

function convertDate(
    question: IQuestion,
    subItem: fhir.QuestionnaireItem,
): fhir.QuestionnaireItem {
    // TODO: Possibility for dynamic time
    const answer = question.answer as ITime;
    if (question.isRequired) {
        subItem.extension?.push({
            url: standardValidationTextUrl,
            valueString:
                'Velg dato, eller skriv dato på denne måten: dd.mm.åååå.',
        });
        subItem.extension?.push({
            url: 'http://hl7.org/fhir/StructureDefinition/entryFormat',
            valueString: 'dd.mm.åååå.',
        });
    }
    if (answer.hasEndTime && answer.endTime) {
        const endTime = convertUnixToFhirTime(
            answer.isDate,
            answer.isTime,
            answer.endTime,
        );
        subItem.extension?.push({
            url:
                'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpathvalidation',
            valueString: 'this.value <= ' + endTime,
        });
        subItem.extension?.push({
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-maxvalue',
            valueString: endTime,
        });
    }
    if (answer.hasStartTime && answer.startTime) {
        const startTime = convertUnixToFhirTime(
            answer.isDate,
            answer.isTime,
            answer.startTime,
        );
        subItem.extension?.push({
            url:
                'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpathvalidation',
            valueString: 'this.value >= ' + startTime,
        });
        subItem.extension?.push({
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-minvalue',
            valueString: startTime,
        });
    }
    subItem.type =
        answer.isDate && answer.isTime
            ? FhirAnswerTypes.dateTime
            : answer.isDate
            ? FhirAnswerTypes.date
            : FhirAnswerTypes.time;
    if (answer.defaultTime) {
        const dateTime = convertUnixToFhirTime(
            answer.isDate,
            answer.isTime,
            answer.defaultTime,
        );
        console.log(dateTime);
        if (answer.isDate && answer.isTime) subItem.initialDateTime = dateTime;
        else if (answer.isDate) subItem.initialDate = dateTime;
        else subItem.initialTime = dateTime;
    }
    return subItem;
}

function convertUnixToFhirTime(
    isDate: boolean,
    isTime: boolean,
    dateTime: number,
): string {
    if (isDate && isTime) {
        const date = moment(dateTime).format('YYYY-MM-DD');
        const time = moment(dateTime).format('HH:mm:ss');
        return date + 'T' + time;
    } else if (isDate) {
        return moment(dateTime).format('YYYY-MM-DD');
    } else return moment(dateTime).format('HH:mm:ss');
}
