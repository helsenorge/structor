import { koronaSkjema } from '../questionnaires/koronaSkjema';
import ISection from '../types/ISection';
import IQuestion from '../types/IQuestion';
import {
    IAnswer,
    IChoice,
    IBoolean,
    IText,
    INumber,
    ITime,
    IInfo,
} from '../types/IAnswer';
import AnswerTypes from '../types/IAnswer';
import moment from 'moment';
import { generateID } from '../helpers/IDGenerator';

function getQuestionnaire(): fhir.Questionnaire {
    const questionnaireObj = koronaSkjema;

    console.log('Questionnaire object: ', questionnaireObj);
    return questionnaireObj;
}

function getChoices(
    currentQuestion: fhir.QuestionnaireItem,
    valueSets: fhir.ValueSet[],
): IChoice {
    let valueSetReference = currentQuestion.options?.reference;
    const currentAnswer: IChoice = {
        id: generateID(),
        isMultiple: false,
        isOpen: false,
        choices: [],
        hasDefault: false,
        defaultValue: 0,
    };

    // Find id of value set (Answer)
    if (valueSetReference?.charAt(0) === '#') {
        valueSetReference = valueSetReference.substr(1);
    }

    // Find if open-choice
    if (currentQuestion.type === 'open-choice') {
        currentAnswer.isOpen = true;
    }

    // Find if multiple-choice (if checkbox)
    if (currentQuestion.extension) {
        for (
            let extensionIndex = 0;
            extensionIndex < currentQuestion.extension.length;
            extensionIndex++
        ) {
            for (
                let codingIndex = 0;
                codingIndex < currentQuestion.extension.length;
                codingIndex++
            ) {
                if (
                    currentQuestion.extension[extensionIndex]
                        .valueCodeableConcept?.coding?.[codingIndex] !==
                    undefined
                ) {
                    if (
                        currentQuestion.extension[
                            extensionIndex
                        ].valueCodeableConcept?.coding?.[
                            codingIndex
                        ].hasOwnProperty('code') &&
                        currentQuestion.extension[extensionIndex]
                            .valueCodeableConcept?.coding?.[codingIndex]
                            .code === 'check-box'
                    ) {
                        currentAnswer.isMultiple = true;
                    }
                }
            }
        }
    }

    // Find array of answer options as strings
    const answers = [];
    for (let i = 0; i < valueSets?.length; i++) {
        if (
            valueSets[i].id === valueSetReference &&
            valueSets[i].compose?.include?.length
        ) {
            const valueSetLength = valueSets[i].compose?.include
                ?.length as number;
            for (let j = 0; j < valueSetLength; j++) {
                if (valueSets[i].compose?.include[j].concept) {
                    const optionsLength = valueSets[i].compose?.include[j]
                        .concept?.length as number;
                    for (let k = 0; k < optionsLength; k++) {
                        answers.push(
                            valueSets[i].compose?.include[j].concept?.[k]
                                .display as string,
                        );
                    }
                }
            }
        }
    }
    currentAnswer.choices = answers;

    // Find if has a default value
    if (currentQuestion.hasOwnProperty('initialCoding')) {
        currentAnswer.hasDefault = true;
        currentAnswer.defaultValue = parseInt(
            currentQuestion.initialCoding?.code as string,
        );
    }

    return currentAnswer;
}

function getText(currentQuestion: fhir.QuestionnaireItem): IText {
    const currentAnswer: IText = {
        id: generateID(),
        isLong: false,
        maxLength: currentQuestion.maxLength,
    };
    if (currentQuestion.type === 'text' && currentQuestion.maxLength) {
        currentAnswer.isLong = true;
        currentAnswer.maxLength = currentQuestion.maxLength;
        return currentAnswer;
    } else if (currentQuestion.type === 'text') {
        currentAnswer.isLong = true;
        currentAnswer.maxLength = 1000;
        return currentAnswer;
    } else if (currentQuestion.type === 'string' && currentQuestion.maxLength) {
        currentAnswer.isLong = false;
        currentAnswer.maxLength = currentQuestion.maxLength;
        return currentAnswer;
    } else if (currentQuestion.type === 'string') {
        currentAnswer.isLong = false;
        currentAnswer.maxLength = 100;
        return currentAnswer;
    }
    return currentAnswer;
}

function getBoolean(currentQuestion: fhir.QuestionnaireItem): IBoolean {
    const tempAnswer: IBoolean = {
        id: generateID(),
        isChecked: false,
        label: currentQuestion.text as string,
    };
    if (currentQuestion.initialBoolean) {
        tempAnswer.isChecked = currentQuestion.initialBoolean;
    }
    return tempAnswer;
}

function getNumber(currentQuestion: fhir.QuestionnaireItem): INumber {
    const tempAnswer: INumber = {
        id: generateID(),
        hasMax: false,
        hasMin: false,
        hasUnit: false,
        isDecimal: false,
        hasDefault: false,
    };

    // Check if decimal and set initial value if exists.
    if (currentQuestion.type === 'decimal') {
        tempAnswer.isDecimal = true;
        if (currentQuestion.initialDecimal) {
            tempAnswer.hasDefault = true;
            tempAnswer.defaultValue = currentQuestion.initialDecimal;
        }
    }

    // Check if integer and set initial value if exists.
    if (currentQuestion.type === 'integer') {
        tempAnswer.isDecimal = false;
        if (currentQuestion.initialInteger) {
            tempAnswer.hasDefault = true;
            tempAnswer.defaultValue = currentQuestion.initialInteger;
        }
    }

    // Find max and min values if exist
    if (currentQuestion.extension) {
        for (let i = 0; i < currentQuestion.extension?.length; i++) {
            if (
                currentQuestion.extension[i].url ===
                'http://hl7.org/fhir/StructureDefinition/maxValue'
            ) {
                tempAnswer.hasMax = true;
                tempAnswer.maxValue = currentQuestion.extension[i].valueInteger;
            }
            if (
                currentQuestion.extension[i].url ===
                'http://hl7.org/fhir/StructureDefinition/minValue'
            ) {
                tempAnswer.hasMin = true;
                tempAnswer.minValue = currentQuestion.extension[i].valueInteger;
            }
            // TODO unit
        }
    }

    return tempAnswer;
}

function getTime(currentQuestion: fhir.QuestionnaireItem): ITime {
    const tempAnswer: ITime = {
        id: generateID(),
        isTime: false,
        isDate: false,
        hasDefaultTime: false,
        hasStartTime: false,
        hasEndTime: false,
    };

    if (currentQuestion.type === 'date') {
        tempAnswer.isDate = true;
        if (currentQuestion.initialDate) {
            tempAnswer.hasDefaultTime = true;
            tempAnswer.defaultTime = convertFhirTimeToUnix(
                true,
                false,
                currentQuestion.initialDate as string,
            );
        }
    } else if (currentQuestion.type === 'time') {
        tempAnswer.isTime = true;
        if (currentQuestion.initialTime) {
            tempAnswer.hasDefaultTime = true;
            tempAnswer.defaultTime = convertFhirTimeToUnix(
                false,
                true,
                currentQuestion.initialTime as string,
            );
        }
    } else {
        tempAnswer.isDate = true;
        tempAnswer.isTime = true;
        if (currentQuestion.initialDateTime) {
            tempAnswer.hasDefaultTime = true;
            tempAnswer.defaultTime = convertFhirTimeToUnix(
                true,
                true,
                currentQuestion.initialDateTime as string,
            );
        }
    }

    if (currentQuestion.extension) {
        for (let i = 0; i < currentQuestion.extension?.length; i++) {
            if (
                currentQuestion.extension[i].url ===
                'http://ehelse.no/fhir/StructureDefinition/sdf-maxvalue'
            ) {
                tempAnswer.hasEndTime = true;
                tempAnswer.endTime = convertFhirTimeToUnix(
                    tempAnswer.isDate,
                    tempAnswer.isTime,
                    currentQuestion.extension[i].valueString as string,
                );
            }
            if (
                currentQuestion.extension[i].url ===
                'http://ehelse.no/fhir/StructureDefinition/sdf-minvalue'
            ) {
                tempAnswer.hasStartTime = true;
                tempAnswer.endTime = convertFhirTimeToUnix(
                    tempAnswer.isDate,
                    tempAnswer.isTime,
                    currentQuestion.extension[i].valueString as string,
                );
            }
        }
    }
    return tempAnswer;
}

function getDisplay(currentQuestion: fhir.QuestionnaireItem): IInfo {
    console.log('komhit');
    const tempAnswer: IInfo = {
        id: generateID(),
        info: currentQuestion.text as string,
        hasInfo: true,
    };
    return tempAnswer;
}

function convertFhirTimeToUnix(
    isDate: boolean,
    isTime: boolean,
    dateTime: string,
): number {
    if (isDate && isTime) {
        return moment(dateTime, 'YYYY-MM-DDTHH:mm:ss').valueOf();
    } else if (isDate) {
        return moment(dateTime, 'YYYY-MM-DD').valueOf();
    } else return moment(dateTime, 'HH:mm').valueOf();
}

function convertFromJSON(): {
    formMeta: { title: string; description?: string };
    sections: Array<ISection>;
    questions: Array<IQuestion>;
} {
    const questionnaireObj = getQuestionnaire();
    const questionList = [];
    const sectionList = [];
    const formMeta = {
        title: questionnaireObj.title as string,
        description: questionnaireObj.description as string,
    };
    if (questionnaireObj.item !== undefined) {
        for (let i = 0; i < questionnaireObj.item.length; i++) {
            if (
                questionnaireObj.item[i] !== undefined &&
                questionnaireObj.item[i].type === 'group'
            ) {
                const currentSection = questionnaireObj.item[i];

                const tempSection: ISection = {
                    id: generateID(),
                    questionOrder: [],
                    sectionTitle: currentSection.text as string,
                };

                if (currentSection.item !== undefined) {
                    for (let j = 0; j < currentSection.item.length; j++) {
                        const currentQuestion = currentSection.item[j];

                        let tempAnswer: IAnswer = {
                            id: generateID(),
                        };

                        const tempQuestion: IQuestion = {
                            id: generateID(),
                            collapsed: false,
                            isDependent: false,
                            sectionId: tempSection.id,
                            questionText: currentQuestion.text as string,
                            answerType: currentQuestion.type as AnswerTypes,
                            answer: tempAnswer as IAnswer,
                            isRequired: currentQuestion.required as boolean,
                        };

                        tempSection.questionOrder.push(tempQuestion.id);

                        if (
                            currentQuestion.type === 'choice' ||
                            currentQuestion.type === 'open-choice'
                        ) {
                            tempAnswer = getChoices(
                                currentQuestion,
                                questionnaireObj.contained as fhir.ValueSet[],
                            );
                            tempQuestion.answerType = AnswerTypes.choice;
                        } else if (currentQuestion.type === 'boolean') {
                            tempAnswer = getBoolean(currentQuestion);
                            tempQuestion.answerType = AnswerTypes.boolean;
                        } else if (
                            currentQuestion.type === 'text' ||
                            currentQuestion.type === 'string'
                        ) {
                            tempAnswer = getText(currentQuestion);
                            tempQuestion.answerType = AnswerTypes.text;
                        } else if (
                            currentQuestion.type === 'decimal' ||
                            currentQuestion.type === 'integer'
                        ) {
                            tempAnswer = getNumber(currentQuestion);
                            tempQuestion.answerType = AnswerTypes.number;
                        } else if (
                            currentQuestion.type === 'date' ||
                            currentQuestion.type === 'dateTime' ||
                            currentQuestion.type === 'time'
                        ) {
                            tempAnswer = getTime(currentQuestion);
                            tempQuestion.answerType = AnswerTypes.time;
                        } else if (currentQuestion.type === 'display') {
                            const dot = currentQuestion.linkId.indexOf('.');
                            console.log('dot is at ', dot);
                            console.log(
                                'linkId before: ',
                                currentQuestion.linkId,
                                '. linkId after',
                                currentQuestion.linkId.substr(dot + 1),
                            );
                            if (
                                currentQuestion.linkId.substr(dot + 1) === '101'
                            ) {
                                tempSection.description = currentQuestion.text;
                            } else {
                                tempAnswer = getDisplay(currentQuestion);
                                tempQuestion.answerType = AnswerTypes.info;
                            }
                        }
                        tempQuestion.answer = tempAnswer as IAnswer;
                        questionList.push(tempQuestion);
                    }
                }
                sectionList.push(tempSection);
            }
        }
    }
    return {
        formMeta: formMeta,
        sections: sectionList,
        questions: questionList,
    };
}

export default convertFromJSON;
