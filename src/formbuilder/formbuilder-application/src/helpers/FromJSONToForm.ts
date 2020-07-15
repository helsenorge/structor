import ISection from '../types/ISection';
import IQuestion from '../types/IQuestion';
import { IAnswer, IChoice, IBoolean, IText, INumber, ITime, IInfo, TimeIntervalType } from '../types/IAnswer';
import AnswerTypes from '../types/IAnswer';
import moment from 'moment';
import { generateID } from '../helpers/IDGenerator';

function getChoices(currentQuestion: fhir.QuestionnaireItem, valueSets: fhir.ValueSet[]): IChoice {
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
        for (let extensionIndex = 0; extensionIndex < currentQuestion.extension.length; extensionIndex++) {
            for (let codingIndex = 0; codingIndex < currentQuestion.extension.length; codingIndex++) {
                if (
                    currentQuestion.extension[extensionIndex].valueCodeableConcept?.coding?.[codingIndex] !== undefined
                ) {
                    if (
                        currentQuestion.extension[extensionIndex].valueCodeableConcept?.coding?.[
                            codingIndex
                        ].hasOwnProperty('code') &&
                        currentQuestion.extension[extensionIndex].valueCodeableConcept?.coding?.[codingIndex].code ===
                            'check-box'
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
        if (valueSets[i].id === valueSetReference && valueSets[i].compose?.include?.length) {
            const valueSetLength = valueSets[i].compose?.include?.length as number;
            for (let j = 0; j < valueSetLength; j++) {
                if (valueSets[i].compose?.include[j].concept) {
                    const optionsLength = valueSets[i].compose?.include[j].concept?.length as number;
                    for (let k = 0; k < optionsLength; k++) {
                        answers.push(valueSets[i].compose?.include[j].concept?.[k].display as string);
                    }
                }
            }
        }
    }
    currentAnswer.choices = answers;

    // Find if has a default value
    if (currentQuestion.hasOwnProperty('initialCoding')) {
        currentAnswer.hasDefault = true;
        currentAnswer.defaultValue = parseInt(currentQuestion.initialCoding?.code as string);
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
            if (currentQuestion.extension[i].url === 'http://hl7.org/fhir/StructureDefinition/maxValue') {
                tempAnswer.hasMax = true;
                tempAnswer.maxValue = currentQuestion.extension[i].valueInteger;
            }
            if (currentQuestion.extension[i].url === 'http://hl7.org/fhir/StructureDefinition/minValue') {
                tempAnswer.hasMin = true;
                tempAnswer.minValue = currentQuestion.extension[i].valueInteger;
            }
            if (currentQuestion.extension[i].url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit') {
                tempAnswer.hasUnit = true;
                if (currentQuestion.extension[i].valueCoding)
                    tempAnswer.unit = currentQuestion.extension[i].valueCoding?.code;
            }
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
        hasInterval: false,
        timeIntervalType: TimeIntervalType.FIXED,
    };

    if (currentQuestion.type === 'date') {
        tempAnswer.isDate = true;
        if (currentQuestion.initialDate) {
            tempAnswer.hasDefaultTime = true;
            tempAnswer.defaultTime = convertFhirTimeToUnix(true, false, currentQuestion.initialDate as string);
        }
    } else if (currentQuestion.type === 'time') {
        tempAnswer.isTime = true;
        if (currentQuestion.initialTime) {
            tempAnswer.hasDefaultTime = true;
            tempAnswer.defaultTime = convertFhirTimeToUnix(false, true, currentQuestion.initialTime as string);
        }
    } else {
        tempAnswer.isDate = true;
        tempAnswer.isTime = true;
        if (currentQuestion.initialDateTime) {
            tempAnswer.hasDefaultTime = true;
            tempAnswer.defaultTime = convertFhirTimeToUnix(true, true, currentQuestion.initialDateTime as string);
        }
    }

    if (currentQuestion.extension) {
        for (let i = 0; i < currentQuestion.extension?.length; i++) {
            if (currentQuestion.extension[i].url === 'http://ehelse.no/fhir/StructureDefinition/sdf-maxvalue') {
                tempAnswer.hasEndTime = true;
                tempAnswer.hasInterval = true;
                tempAnswer.endTime = convertFhirTimeToUnix(
                    tempAnswer.isDate,
                    tempAnswer.isTime,
                    currentQuestion.extension[i].valueString as string,
                );
            }
            if (currentQuestion.extension[i].url === 'http://ehelse.no/fhir/StructureDefinition/sdf-minvalue') {
                tempAnswer.hasStartTime = true;
                tempAnswer.hasInterval = true;
                tempAnswer.startTime = convertFhirTimeToUnix(
                    tempAnswer.isDate,
                    tempAnswer.isTime,
                    currentQuestion.extension[i].valueString as string,
                );
            }
            if (currentQuestion.extension[i].valueString?.indexOf('today') !== -1) {
                tempAnswer.timeIntervalType = TimeIntervalType.FLOATING;
            }
        }
    }
    return tempAnswer;
}

function getDisplay(currentQuestion: fhir.QuestionnaireItem): IInfo {
    const tempAnswer: IInfo = {
        id: generateID(),
        info: currentQuestion.text as string,
        hasInfo: true,
    };
    return tempAnswer;
}

function convertFhirTimeToUnix(isDate: boolean, isTime: boolean, dateTime: string): number {
    console.log(isDate, isTime, dateTime);
    const indexDays = dateTime.indexOf('days');
    const indexHours = dateTime.indexOf('hours');
    const indexToday = dateTime.indexOf('today');
    if (isDate && isTime) {
        if (indexDays !== -1) return parseInt(dateTime.substr(indexDays - 2, 1));
        else if (indexToday !== -1) return 0;
        return moment(dateTime, 'YYYY-MM-DDTHH:mm:ss').valueOf();
    } else if (isDate) {
        if (indexDays !== -1) return parseInt(dateTime.substr(indexDays - 2, 1));
        else if (indexToday !== -1) return 0;
        return moment(dateTime, 'YYYY-MM-DD').valueOf();
    } else {
        if (indexHours !== -1) return parseInt(dateTime.substr(indexHours - 2, 1));
        else if (indexToday !== -1) return 0;
        return moment(dateTime, 'HH:mm').valueOf();
    }
}

function convertFromJSON(
    questionnaireObj: fhir.Questionnaire,
): {
    formMeta: { title: string; description?: string };
    sections: Array<ISection>;
    questions: Array<IQuestion>;
} {
    const questionList = [];
    const sectionList = [];
    const formMeta = {
        title: questionnaireObj.title as string,
        description: questionnaireObj.description as string,
    };
    console.log(questionnaireObj);
    if (questionnaireObj.item !== undefined) {
        for (let i = 0; i < questionnaireObj.item.length; i++) {
            if (questionnaireObj.item[i] !== undefined && questionnaireObj.item[i].type === 'group') {
                const currentSection = questionnaireObj.item[i];

                const tempSection: ISection = {
                    id: generateID(),
                    questionOrder: [],
                    sectionTitle: currentSection.text as string,
                    description: '',
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

                        let isSectionDescription = false;

                        if (currentQuestion.type === 'choice' || currentQuestion.type === 'open-choice') {
                            tempAnswer = getChoices(currentQuestion, questionnaireObj.contained as fhir.ValueSet[]);
                            tempQuestion.answerType = AnswerTypes.choice;
                        } else if (currentQuestion.type === 'boolean') {
                            tempAnswer = getBoolean(currentQuestion);
                            tempQuestion.answerType = AnswerTypes.boolean;
                        } else if (currentQuestion.type === 'text' || currentQuestion.type === 'string') {
                            tempAnswer = getText(currentQuestion);
                            tempQuestion.answerType = AnswerTypes.text;
                        } else if (
                            currentQuestion.type === 'decimal' ||
                            currentQuestion.type === 'integer' ||
                            currentQuestion.type === 'quantity'
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
                            if (currentQuestion.linkId.substr(dot + 1) === '101') {
                                isSectionDescription = true;
                                tempSection.description = currentQuestion.text ? currentQuestion.text : '';
                            } else {
                                tempAnswer = getDisplay(currentQuestion);
                                tempQuestion.answerType = AnswerTypes.info;
                            }
                        }
                        tempQuestion.answer = tempAnswer as IAnswer;
                        if (!isSectionDescription) {
                            tempSection.questionOrder.push(tempQuestion.id);
                            questionList.push(tempQuestion);
                        }
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
