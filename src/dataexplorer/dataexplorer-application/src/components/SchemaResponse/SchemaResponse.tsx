import React, { useState, useEffect } from 'react';
import { Row, Spin } from 'antd';
import 'dayjs/locale/nb';
import useFetch from 'utils/hooks/useFetch';
import dayjs from 'dayjs';
import { IAnswer, IQuestion } from 'types/IQuestionAndAnswer';
import Schemes from './Schemes/Schemes';

const SchemaResponse = (props: { questionnaireResponseId: string }) => {
    const schemaResponse = useFetch<fhir.QuestionnaireResponse>(
        'fhir/QuestionnaireResponse/' + props.questionnaireResponseId,
    );

    const questionnaireUrl = schemaResponse.response?.questionnaire?.reference?.substr(
        schemaResponse.response?.questionnaire?.reference?.indexOf(
            'Questionnaire/',
        ),
    );

    const { response: questionnaire } = useFetch<fhir.Questionnaire>(
        'fhir/' + questionnaireUrl,
    );

    const [answers, setAnswers] = useState<IAnswer[]>([]);

    const [questions, setQuestions] = useState<IQuestion[]>([]);

    const [questionnaireResource, setQuestionnaireResource] = useState<
        fhir.ValueSet[]
    >([]);

    const updateAnswer = (update: fhir.QuestionnaireResponseItem) => {
        const answerObject: IAnswer = { id: update.linkId, answers: update };
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
                    list.answer.map(
                        (i) => i.item && i.item.map((a) => updateAnswer(a)),
                    );
                }
                return;
            } else {
                list.item &&
                    list.item.forEach((element) => findAnswer(element));
            }
        };
        if (schemaResponse.response?.item) {
            for (let a = 0; a < schemaResponse.response.item.length; a++) {
                findAnswer(schemaResponse.response.item[a]);
            }
        }
        return;
    }, [schemaResponse.response]);

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
                list.item &&
                    list.item.forEach((element) => findQuestion(element));
            }
        };
        if (questionnaire?.item) {
            for (let a = 0; a < questionnaire.item.length; a++) {
                findQuestion(questionnaire.item[a]);
            }
        }
        questionnaire?.contained &&
            setQuestionnaireResource(
                questionnaire.contained as fhir.ValueSet[],
            );
        return;
    }, [questionnaire]);

    console.log(schemaResponse);

    return (
        <>
            {schemaResponse && questionnaire && questionnaire.name && (
                <div>
                    <Schemes
                        questions={questions}
                        answers={answers}
                        questionnaireResource={questionnaireResource}
                        date={dayjs(schemaResponse.response?.authored)}
                        title={questionnaire.name}
                    />
                </div>
            )}
            {!schemaResponse.response && schemaResponse.error.length === 0 && (
                <Row justify="space-around" align="middle">
                    <Spin size="large" />
                </Row>
            )}
            {schemaResponse.error.length > 0 && (
                <Row justify="center">
                    Feil ved lasting av skjema: {schemaResponse.error}
                </Row>
            )}
        </>
    );
};

export default SchemaResponse;
