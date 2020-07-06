import { koronaSkjema } from '../questionnaires/koronaSkjema';
import ISection from '../types/ISection';
import IQuestion from '../types/IQuestion';
import { IAnswer, IChoice, IBoolean } from '../types/IAnswer';
import AnswerTypes from '../types/IAnswer';

function getQuestionnaire(): fhir.Questionnaire {
    const questionnaireObj = koronaSkjema;

    console.log('Test 1: ', questionnaireObj);
    return questionnaireObj;
}

function getChoices(
    currentQuestion: fhir.QuestionnaireItem,
    questionnaireObj: fhir.Questionnaire,
): IChoice {
    let valueSetReference = currentQuestion.options?.reference;
    let isOpenChoice = false;
    let isMultipleChoice = false;
    const valueSets = questionnaireObj.contained as fhir.ValueSet[];
    let hasDefaultValue = false;
    let defaultValue = 0;

    // Find id of value set (Answer)
    if (valueSetReference?.charAt(0) === '#') {
        valueSetReference = valueSetReference?.substr(1);
    }

    // Find if open-choice
    if (currentQuestion.type === 'open-choice') {
        isOpenChoice = true;
    }

    // Find if multiple-choice (if checkbox)
    if (currentQuestion.extension !== undefined) {
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
                        .valueCodeableConcept !== undefined &&
                    currentQuestion.extension[extensionIndex]
                        .valueCodeableConcept?.coding !== undefined &&
                    currentQuestion.extension[extensionIndex]
                        .valueCodeableConcept?.coding![codingIndex] !==
                        undefined
                ) {
                    if (
                        currentQuestion.extension[
                            extensionIndex
                        ].valueCodeableConcept?.coding![
                            codingIndex
                        ].hasOwnProperty('code') &&
                        currentQuestion.extension[extensionIndex]
                            .valueCodeableConcept?.coding![codingIndex].code ===
                            'check-box'
                    ) {
                        isMultipleChoice = true;
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
            valueSets[i].compose &&
            valueSets[i].compose?.include
        ) {
            for (let j = 0; j < valueSets[i].compose!.include.length; j++) {
                if (valueSets[i].compose!.include[j].concept !== undefined) {
                    for (
                        let k = 0;
                        k < valueSets[i].compose!.include[j].concept!.length;
                        k++
                    ) {
                        answers.push(
                            valueSets[i].compose!.include[j].concept![k]
                                .display as string,
                        );
                    }
                }
            }
        }
    }

    // Find if has a default value
    if (currentQuestion.hasOwnProperty('initialCoding')) {
        hasDefaultValue = true;
        defaultValue = parseInt(currentQuestion.initialCoding?.code as string);
    }

    const currentAnswer: IChoice = {
        id: valueSetReference as string,
        isMultiple: isMultipleChoice,
        isOpen: isOpenChoice,
        choices: answers,
        hasDefault: hasDefaultValue,
        defaultValue: defaultValue,
    };
    return currentAnswer;
}

function convertFromJSON(): void {
    const questionnaireObj = getQuestionnaire();
    let sectionLength = 0;
    const questionObjects = [];
    const answerList = Array<IAnswer>();
    if (questionnaireObj.item === undefined) return;
    for (let i = 0; i < questionnaireObj.item?.length; i++) {
        if (
            questionnaireObj.item[i].type === 'group' &&
            questionnaireObj.item[i] !== undefined &&
            questionnaireObj.item[i].item !== undefined
        ) {
            const currentSection = questionnaireObj.item[i];
            sectionLength = currentSection.item?.length as number;
            const tempSection: ISection = {
                id: currentSection.linkId,
                questionOrder: [],
                sectionTitle: currentSection.text as string,
            };

            if (currentSection.item !== undefined) {
                for (let j = 0; j < sectionLength; j++) {
                    const currentQuestion = currentSection.item[j];
                    tempSection.questionOrder.push(currentQuestion.linkId);
                    if (
                        currentQuestion.type === 'choice' ||
                        currentQuestion.type === 'open-choice'
                    ) {
                        const tempAnswer: IChoice = getChoices(
                            currentQuestion,
                            questionnaireObj,
                        );
                        answerList.push(tempAnswer);
                    } else if (currentQuestion.type === 'boolean') {
                        // TODO Find IsChecked in JSON.
                        const tempAnswer: IBoolean = {
                            id: currentQuestion.linkId,
                            isChecked: false, //TODO
                            label: currentQuestion.text as string,
                        };
                        answerList.push(tempAnswer);
                    } else if (currentQuestion.type === 'display') {

                    }
                }
            }
            console.log('Answers: ', answerList);
            /*const tempQuestion: IQuestion = {
                    id: currentSection.item![j].linkId,
                    sectionId: currentSection.linkId,
                    questionText: currentSection.item![j].text as string,
                    answerType: currentSection.item![j].type as AnswerTypes,
                    answer: {};
                    hasDescription: boolean;
                    isRequired: boolean;
                    description?: string;
                } */
        }
    }
}

export default convertFromJSON;
