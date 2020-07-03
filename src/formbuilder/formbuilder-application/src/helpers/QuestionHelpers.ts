import IQuestion from '../types/IQuestion';
import AnswerTypes, {
    INumber,
    FhirAnswerTypes,
    IText,
    IChoice,
    IBoolean,
} from '../types/IAnswer';
import { ValueSetMap } from './JSONGenerator';

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
    if (answer.isMultiple) {
        subItem.extension?.push({
            url:
                'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
            valueCodeableConcept: {
                coding: [
                    {
                        system:
                            'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
                        code: 'check-box',
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
    return subItem;
}
