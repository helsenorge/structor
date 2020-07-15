import React, { useState, useEffect } from 'react';
import 'dayjs/locale/nb';
import useFetch from 'utils/hooks/useFetch';
import dayjs from 'dayjs';
import { IAnswer, IQuestion } from 'types/IQuestionAndAnswer';
import SchemaView from './SchemaView/SchemaView';

const QuestionnaireResponseProcessing = (props: {
    questionnaireUrl: string;
    schemaResponse: fhir.QuestionnaireResponse;
}) => {
    const { response: questionnaire } = useFetch<fhir.Questionnaire>('fhir/' + props.questionnaireUrl);

    const [answers, setAnswers] = useState<IAnswer[]>([]);

    const [questions, setQuestions] = useState<IQuestion[]>([]);

    const [questionnaireResource, setQuestionnaireResource] = useState<fhir.ValueSet[]>([]);

    const updateAnswer = (update: fhir.QuestionnaireResponseItem) => {
        const answerObject: IAnswer = {
            id: update.linkId,
            answers: update,
        };
        setAnswers((answer) => [...answer, answerObject]);
    };

    const updateQuestion = (update: fhir.QuestionnaireItem) => {
        const questionObject: IQuestion = {
            id: update.linkId,
            questions: update,
        };
        setQuestions((question) => [...question, questionObject]);
    };

    useEffect(() => {
        const findAnswer = (list: fhir.QuestionnaireResponseItem) => {
            if (!list?.answer && !list.item) {
                return;
            }
            if (list.answer) {
                if (list.item) {
                    list.item.map((i) => updateAnswer(i));
                    list.item.map((i) => findAnswer(i));
                } else {
                    updateAnswer(list);
                    list.answer.map((i) => i.item && i.item.map((a) => updateAnswer(a)));
                }
                return;
            } else {
                list.item && list.item.forEach((element) => findAnswer(element));
            }
        };
        if (props.schemaResponse.item) {
            for (let a = 0; a < props.schemaResponse.item.length; a++) {
                findAnswer(props.schemaResponse.item[a]);
            }
        }
        return;
    }, [props]);

    useEffect(() => {
        const findQuestion = (list: fhir.QuestionnaireItem) => {
            if (!list?.text && !list.item) {
                return;
            }
            if (list.text) {
                if (list.item) {
                    updateQuestion(list);
                    list.item.map((i) => findQuestion(i));
                } else {
                    updateQuestion(list);
                }
                return;
            } else {
                list.item && list.item.forEach((element) => findQuestion(element));
            }
        };
        if (questionnaire?.item) {
            for (let a = 0; a < questionnaire.item.length; a++) {
                findQuestion(questionnaire.item[a]);
            }
        }
        questionnaire?.contained && setQuestionnaireResource(questionnaire.contained as fhir.ValueSet[]);
        return;
    }, [questionnaire]);

    return (
        <>
            {questionnaire && (
                <div>
                    <SchemaView
                        questions={questions}
                        answers={answers}
                        questionnaireResource={questionnaireResource}
                        date={dayjs(props.schemaResponse.meta?.lastUpdated)}
                        title={questionnaire.title ? questionnaire.title : 'Tittel mangler'}
                    />
                </div>
            )}
        </>
    );
};

export default QuestionnaireResponseProcessing;
