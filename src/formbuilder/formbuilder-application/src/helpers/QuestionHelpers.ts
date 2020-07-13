import IQuestion from '../types/IQuestion';
import AnswerTypes, {
    INumber,
    FhirAnswerTypes,
    IText,
    IChoice,
    IBoolean,
    ITime,
    IInfo,
    TimeIntervalType,
} from '../types/IAnswer';
import { ValueSetMap } from './JSONGenerator';
import moment from 'moment';

const standardValidationTextUrl = 'http://ehelse.no/fhir/StructureDefinition/validationtext';

export default function convertQuestion(
    question: IQuestion,
    linkId: string,
    valueSetMap: ValueSetMap,
): fhir.QuestionnaireItem {
    const subItem: fhir.QuestionnaireItem = {
        linkId: linkId,
        type: FhirAnswerTypes.text,
        text: question.questionText,
        required: question.isRequired,
        repeats: false, // TODO
        readOnly: false, // TODO
        extension: [],
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
        case AnswerTypes.info:
            return convertInfo(question, subItem);
        default:
            return subItem;
    }
}

function convertNumber(question: IQuestion, subItem: fhir.QuestionnaireItem): fhir.QuestionnaireItem {
    const answer = question.answer as INumber;
    subItem.type = answer.isDecimal ? FhirAnswerTypes.decimal : FhirAnswerTypes.integer;
    subItem.extension = new Array<fhir.Extension>();

    if (answer.hasMax && answer.hasMin) {
        if (question.isRequired)
            subItem.extension.push({
                url: standardValidationTextUrl,
                valueString: 'Fyll ut feltet med et tall mellom ' + answer.minValue + ' og ' + answer.maxValue,
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
                valueString: 'Fyll ut feltet med et tall mindre enn ' + answer.maxValue,
            });
        subItem.extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
            valueInteger: answer.maxValue,
        });
    } else if (answer.hasMin) {
        if (question.isRequired)
            subItem.extension.push({
                url: standardValidationTextUrl,
                valueString: 'Fyll ut feltet med et tall større enn ' + answer.minValue,
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
    if (answer.hasUnit && answer.unit !== undefined) {
        subItem.extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
            valueCoding: {
                system: 'http://unitsofmeasure.org',
                code: answer.unit,
                display: answer.unit,
            },
        });
        subItem.type = FhirAnswerTypes.quantity;
    }
    return subItem;
}

function convertText(question: IQuestion, subItem: fhir.QuestionnaireItem): fhir.QuestionnaireItem {
    const answer = question.answer as IText;
    subItem.maxLength = answer.maxLength !== undefined ? answer.maxLength : 100;
    subItem.type = answer.isLong ? FhirAnswerTypes.text : FhirAnswerTypes.string;
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
    subItem.type = answer.isOpen ? FhirAnswerTypes.openChoice : FhirAnswerTypes.choice;
    if (subItem.extension) {
        if (question.isRequired)
            subItem.extension.push({
                url: standardValidationTextUrl,
                valueString: answer.isMultiple ? 'Velg minst én' : 'Velg en',
            });
        if (answer.hasDefault)
            subItem.initialCoding = {
                system: valueSetMap[answer.id],
                code: String(answer.defaultValue ? answer.defaultValue + 1 : 1),
            };
        subItem.extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
            valueCodeableConcept: {
                coding: [
                    {
                        system: 'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
                        code: answer.isMultiple ? 'check-box' : 'radio-button',
                    },
                ],
            },
        });
    }
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

function convertDate(question: IQuestion, subItem: fhir.QuestionnaireItem): fhir.QuestionnaireItem {
    // TODO: Possibility for dynamic time
    const answer = question.answer as ITime;
    if (question.isRequired) {
        subItem.extension?.push({
            url: standardValidationTextUrl,
            valueString: 'Velg dato, eller skriv dato på denne måten: dd.mm.åååå.',
        });
        subItem.extension?.push({
            url: 'http://hl7.org/fhir/StructureDefinition/entryFormat',
            valueString: 'dd.mm.åååå.',
        });
    }
    let addValidationText = true;
    if (answer.hasEndTime && answer.endTime && answer.hasStartTime && answer.startTime) {
        addValidationText = false;
        if (answer.timeIntervalType === TimeIntervalType.FLOATING) {
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                valueString:
                    'Du kan velge en ' +
                    convertTimeString(answer, false, false) +
                    ' som er ' +
                    answer.startTime +
                    ' ' +
                    convertTimeString(answer, true, false) +
                    ' tilbake i tid, og ' +
                    answer.endTime +
                    ' ' +
                    convertTimeString(answer, true, false) +
                    ' fram i tid',
            });
        } else {
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                valueString:
                    'Du kan velge en ' +
                    convertTimeString(answer, false, false) +
                    ' som er fra ' +
                    convertUnixToFhirTime(answer.isDate, answer.isTime, answer.startTime) +
                    ' til ' +
                    convertUnixToFhirTime(answer.isDate, answer.isTime, answer.endTime) +
                    ' fram i tid. Dato skal ha format dd.mm.åååå.',
            });
        }
    }
    if (answer.hasEndTime && answer.endTime !== undefined) {
        if (answer.timeIntervalType === TimeIntervalType.FLOATING) {
            if (addValidationText) {
                subItem.extension?.push({
                    url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                    valueString:
                        'Du kan velge en ' +
                        convertTimeString(answer, false, false) +
                        ' som er maksimum ' +
                        answer.endTime +
                        ' ' +
                        convertTimeString(answer, true, false) +
                        ' fram i tid',
                });
            }
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpathvalidation',
                valueString: 'this.value <= today() + ' + answer.endTime + ' ' + convertTimeString(answer, true, true),
            });
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-maxvalue',
                valueString: 'today() + ' + answer.endTime + ' ' + convertTimeString(answer, true, true),
            });
        } else {
            const convertedEndTimeToISO = convertUnixToFhirTime(answer.isDate, answer.isTime, answer.endTime);
            if (addValidationText) {
                subItem.extension?.push({
                    url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                    valueString:
                        'Du kan velge en ' +
                        convertTimeString(answer, false, false) +
                        ' som er tidligere enn ' +
                        convertedEndTimeToISO,
                });
            }
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpathvalidation',
                valueString: 'this.value <= ' + convertedEndTimeToISO,
            });
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-maxvalue',
                valueString: convertedEndTimeToISO,
            });
        }
    }
    if (answer.hasStartTime && answer.startTime !== undefined) {
        if (answer.timeIntervalType === TimeIntervalType.FLOATING) {
            if (addValidationText) {
                subItem.extension?.push({
                    url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                    valueString:
                        'Du kan velge en ' +
                        convertTimeString(answer, false, false) +
                        ' som er maksimum ' +
                        answer.startTime +
                        ' ' +
                        convertTimeString(answer, true, false) +
                        ' tilbake i tid',
                });
            }
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpathvalidation',
                valueString:
                    'this.value >= today() - ' + answer.startTime + ' ' + convertTimeString(answer, true, true),
            });
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-minvalue',
                valueString: 'today() - ' + answer.startTime + ' ' + convertTimeString(answer, true, true),
            });
        } else {
            const convertedStartTimeToISO = convertUnixToFhirTime(answer.isDate, answer.isTime, answer.startTime);
            if (addValidationText) {
                subItem.extension?.push({
                    url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                    valueString:
                        'Du kan velge en ' +
                        convertTimeString(answer, false, false) +
                        ' som er senere enn ' +
                        convertedStartTimeToISO,
                });
            }
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpathvalidation',
                valueString: 'this.value >= ' + convertedStartTimeToISO,
            });
            subItem.extension?.push({
                url: 'http://ehelse.no/fhir/StructureDefinition/sdf-minvalue',
                valueString: convertedStartTimeToISO,
            });
        }
    }
    subItem.type =
        answer.isDate && answer.isTime
            ? FhirAnswerTypes.dateTime
            : answer.isDate
            ? FhirAnswerTypes.date
            : FhirAnswerTypes.time;

    if (answer.defaultTime) {
        const dateTime = convertUnixToFhirTime(answer.isDate, answer.isTime, answer.defaultTime);
        if (answer.isDate && answer.isTime) subItem.initialDateTime = dateTime;
        else if (answer.isDate) subItem.initialDate = dateTime;
        else subItem.initialTime = dateTime;
    }
    return subItem;
}

function convertInfo(question: IQuestion, subItem: fhir.QuestionnaireItem): fhir.QuestionnaireItem {
    subItem.readOnly = true;
    subItem.type = FhirAnswerTypes.display;

    const answer = question.answer as IInfo;

    subItem.text = answer.info;
    subItem._text = {
        extension: [
            {
                url: 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                valueMarkdown: answer.info,
            },
        ],
    };

    return subItem;
}

function convertUnixToFhirTime(isDate: boolean, isTime: boolean, dateTime: number): string {
    if (isDate && isTime) {
        const date = moment(dateTime).format('YYYY-MM-DD');
        const time = moment(dateTime).format('HH:mm:ss');
        return date + 'T' + time;
    } else if (isDate) {
        return moment(dateTime).format('YYYY-MM-DD');
    } else return moment(dateTime).format('HH:mm:ss');
}

function convertTimeString(localAnswer: ITime, plural: boolean, english: boolean) {
    if (english) {
        if (plural) return localAnswer.isTime && localAnswer.isDate ? 'days' : localAnswer.isTime ? 'hours' : 'days';
        return localAnswer.isTime && localAnswer.isDate ? 'time' : localAnswer.isTime ? 'hour' : 'date';
    } else {
        if (plural)
            return localAnswer.isTime && localAnswer.isDate ? 'dag(er)' : localAnswer.isTime ? 'timer' : 'dag(er)';
        return localAnswer.isTime && localAnswer.isDate ? 'tid' : localAnswer.isTime ? 'time' : 'dato';
    }
}
