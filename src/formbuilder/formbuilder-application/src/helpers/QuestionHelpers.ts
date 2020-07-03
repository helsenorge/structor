import IQuestion from '../types/IQuestion';
import AnswerTypes, { INumber } from '../types/IAnswer';
import { QuestionConverted } from './JSONGenerator';

export default function convertQuestion(
    question: IQuestion,
): QuestionConverted {
    switch (question.answerType) {
        case AnswerTypes.integer || AnswerTypes.decimal:
            return convertNumber(question);
        default:
            return {
                type: question.answerType,
                extension: new Array<fhir.Extension>(),
            };
    }
}

function convertNumber(question: IQuestion): QuestionConverted {
    const numberAnswer = question.answer as INumber;
    const type = numberAnswer.isDecimal
        ? AnswerTypes.decimal
        : AnswerTypes.integer;
    const extension = new Array<fhir.Extension>();
    console.log(numberAnswer);
    if (numberAnswer.hasMax && numberAnswer.hasMin) {
        extension.push({
            url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
            valueString:
                'Fyll ut feltet med et tall mellom ' +
                numberAnswer.minValue +
                ' og ' +
                numberAnswer.maxValue,
        });
        extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
            valueInteger: numberAnswer.maxValue,
        });
        extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/minValue',
            valueInteger: numberAnswer.minValue,
        });
    } else if (numberAnswer.hasMax) {
        extension.push({
            url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
            valueString:
                'Fyll ut feltet med et tall mindre enn ' +
                numberAnswer.maxValue,
        });
        extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
            valueInteger: numberAnswer.maxValue,
        });
    } else if (numberAnswer.hasMin) {
        extension.push({
            url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
            valueString:
                'Fyll ut feltet med et tall større enn ' +
                numberAnswer.minValue,
        });
        extension.push({
            url: 'http://hl7.org/fhir/StructureDefinition/minValue',
            valueInteger: numberAnswer.minValue,
        });
    }
    return { type: type, extension: extension };
}
