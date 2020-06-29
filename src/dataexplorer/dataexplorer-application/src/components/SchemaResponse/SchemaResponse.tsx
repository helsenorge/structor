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
import { IAnswer, IQuestion } from 'types/IQuestionnaireResponse';

const SchemaResponse = () => {
    const questionnaireResponseId = '10';
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
    const [answer, setAnswer] = useState<IAnswer[]>([]);

    const [question, setQuestion] = useState<IQuestion[]>([]);

    dayjs.locale('nb');
    const filledInDate = dayjs(schemaResponse.response?.authored).format(
        'DD/MM/YYYY HH:mm',
    );

    const updateAnswer = (update: QuestionnaireResponseItem) => {
        const answerObject: IAnswer = { id: update.linkId, answers: update };
        setAnswer((answer) => [...answer, answerObject]);
    };

    const updateQuestion = (update: any) => {
        const questionObject: IQuestion = {
            id: update.linkId,
            questions: update,
        };
        setQuestion((question) => [...question, questionObject]);
    };

    console.log(answer);
    console.log(question);
    useEffect(() => {
        const findAnswer = (list: QuestionnaireResponseItem) => {
            if (!list?.answer && !list.item) {
                return;
            }
            if (list.answer) {
                if (list.item) {
                    updateAnswer(list);
                    findAnswer(list);
                } else {
                    updateAnswer(list);
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
        console.log('inne2');
        const findQuestion = (list: any) => {
            if (!list?.text && !list.item) {
                return;
            }
            if (list.text) {
                if (list.item) {
                    console.log('if');
                    updateQuestion(list);
                    findQuestion(list.item);
                } else {
                    console.log('else');
                    updateQuestion(list);
                }
                return;
            } else {
                console.log('else 2');
                list.item.forEach((element: any) => findQuestion(element));
            }
        };
        if (questionnaire?.item) {
            console.log('if 2');
            for (let a = 0; a < questionnaire.item.length; a++) {
                findQuestion(questionnaire.item[a]);
            }
        }
        return;
    }, [questionnaire]);

    const displayQA = (answer: any) => {
        if (answer.answer[0].valueCoding) {
            return (
                answer.text,
                answer.answer.map((i: any) => i.valueCoding.display)
            );
        }
        return answer.text, answer.answer.map((i: any) => i.valueString);
    };

    return (
        <>
            {schemaResponse && questionnaire && answer.length > 0 ? (
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
                    {answer.map((i) => (
                        <div key={i.id}>
                            <h3>{i.answers.text}</h3>
                            <p>{displayQA(i.answers)} </p>
                        </div>
                    ))}
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
