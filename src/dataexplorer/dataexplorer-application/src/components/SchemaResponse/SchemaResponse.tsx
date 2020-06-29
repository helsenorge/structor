import React, { useState, useEffect } from 'react';
import { Row, Spin } from 'antd';
import 'dayjs/locale/nb';
import Title from 'antd/lib/typography/Title';
import useFetch from 'utils/hooks/useFetch';
import dayjs from 'dayjs';
import {
    QuestionnaireResponse,
    Questionnaire,
    QuestionnaireResponseItem,
    QuestionnaireItem,
} from 'types/fhirTypes/fhir';
import { IAnswer, IQuestion, IQA } from 'types/IQuestionnaireResponse';
import SchemaView from './SchemaView/SchemaView';

const SchemaResponse = () => {
    const questionnaireResponseId = '13';
    const schemaResponse = useFetch<QuestionnaireResponse>(
        'fhir/QuestionnaireResponse/' + questionnaireResponseId,
    );
    const questionnaireUrl = schemaResponse.response?.questionnaire?.reference?.substr(
        schemaResponse.response?.questionnaire?.reference?.indexOf(
            'Questionnaire/',
        ),
    );
    const { response: questionnaire } = useFetch<Questionnaire>(
        'fhir/' + questionnaireUrl,
    );
    const [answers, setAnswers] = useState<IAnswer[]>([]);

    const [questions, setQuestions] = useState<IQuestion[]>([]);

    dayjs.locale('nb');
    const filledInDate = dayjs(schemaResponse.response?.authored).format(
        'DD/MM/YYYY HH:mm',
    );

    const updateAnswer = (update: QuestionnaireResponseItem) => {
        const answerObject: IAnswer = { id: update.linkId, answers: update };
        setAnswers((answer) => [...answer, answerObject]);
    };

    const updateQuestion = (update: QuestionnaireItem) => {
        const questionObject: IQuestion = {
            id: update.linkId,
            questions: update,
        };
        setQuestions((question) => [...question, questionObject]);
    };

    console.log(answers);
    console.log(questions);
    useEffect(() => {
        const findAnswer = (list: QuestionnaireResponseItem) => {
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
        const findQuestion = (list: QuestionnaireItem) => {
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
        return;
    }, [questionnaire]);

    /*     const displayQA = (answer: any) => {
        if (answer.answer[0].valueCoding) {
            return (
                answer.text,
                answer.answer.map((i: any) => i.valueCoding.display)
            );
        }
        return answer.text, answer.answer.map((i: any) => i.valueString);
    }; */

    return (
        <>
            {schemaResponse && questionnaire ? (
                <div style={{ marginBottom: '5rem' }}>
                    <Row gutter={40} justify="center">
                        <Title level={3}>{questionnaire.name}</Title>
                    </Row>
                    <Row justify="center">
                        <Title level={3}>
                            id - {schemaResponse.response?.id}
                        </Title>
                    </Row>
                    <Row justify="center">
                        Skjemaet ble fyllt ut: {filledInDate}
                    </Row>
                    <SchemaView questions={questions} answers={answers} />
                </div>
            ) : (
                <Row justify="center">
                    <Spin size="large" />
                </Row>
            )}
        </>
    );
};

export default SchemaResponse;
