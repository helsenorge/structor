import React, { useState, useEffect } from 'react';
import { Collapse, Row, Col } from 'antd';
import './SchemaView.style.scss';
import {
    IQuestionAndAnswer,
    IQuestion,
    IAnswer,
} from 'types/IQuestionAndAnswer';
import dayjs, { Dayjs } from 'dayjs';
import QuestionsAndAnswersDisplay from './QuestionsAndAnswersDisplay/QuestionsAndAnswersDisplay';
import SubQuestionsAndAnswersDisplay from './SubQuestionsAndAnswersDisplay/SubQuestionsAndAnswersDisplay';

export interface SchemesProps {
    questions: IQuestion[];
    answers: IAnswer[];
    questionnaireResource: fhir.ValueSet[];
    date: Dayjs;
    title: string;
}

const Schemes = (props: SchemesProps) => {
    dayjs.locale('nb');
    const [qAndA, setQAndA] = useState<IQuestionAndAnswer[]>([]);
    const [qAndAIDs, setQAndAIDs] = useState<string[]>([]);
    const [defaultActive, setDefaultActive] = useState<string[]>();

    useEffect(() => {
        let hasAddedId = false;
        setQAndA([]);
        setQAndAIDs([]);
        props.questions.forEach((q) => {
            props.answers.forEach((a) => {
                if (q.id === a.id) {
                    hasAddedId = true;
                    setQAndA((qAndA) => [
                        ...qAndA,
                        { id: q.id, questions: q, answers: a },
                    ]);
                }
            });

            hasAddedId === false &&
                setQAndA((qAndA) => [...qAndA, { id: q.id, questions: q }]);
            q.id.split('.').length === 1 &&
                setQAndAIDs((qAndAIDs) => [
                    ...qAndAIDs,
                    q.id.split('.')[0].toString(),
                ]);
            hasAddedId = false;
        });
        if (qAndAIDs.length > 0) {
            setDefaultActive(qAndAIDs);
        }
    }, [props]);

    const { Panel } = Collapse;

    function callback(key: any) {
        console.log(key);
    }

    return (
        <>
            {defaultActive && (
                <Row justify="center">
                    <Col span={12}>
                        <div className="card">
                            <Col>
                                <h1 className="title">{props.title}</h1>
                            </Col>
                            <Col>
                                <p>{props.date.format('DD/MM/YYYY HH:mm')}</p>
                            </Col>
                            <Col span={18}>
                                <Collapse
                                    bordered={false}
                                    className="site-collapse-custom-collapse"
                                    defaultActiveKey={defaultActive}
                                    onChange={callback}
                                >
                                    {qAndA.map(
                                        (section) =>
                                            section.id.split('.').length ===
                                                1 && (
                                                <Panel
                                                    header={
                                                        section.questions
                                                            .questions.text
                                                    }
                                                    key={section.id}
                                                    className="site-collapse-custom-panel"
                                                >
                                                    {qAndA.map(
                                                        (qa, qaIndex) =>
                                                            qa.id.split('.')
                                                                .length === 2 &&
                                                            section.id ===
                                                                qa.id.split(
                                                                    '.',
                                                                )[0] &&
                                                            qa.answers?.answers
                                                                .answer &&
                                                            qa.answers?.answers
                                                                .answer[0] && (
                                                                <div
                                                                    key={
                                                                        qaIndex
                                                                    }
                                                                >
                                                                    <QuestionsAndAnswersDisplay
                                                                        questionAndAnswer={
                                                                            qa
                                                                        }
                                                                        questionnaireResource={
                                                                            props.questionnaireResource
                                                                        }
                                                                        questionAndAnswerIndex={
                                                                            qaIndex
                                                                        }
                                                                    />
                                                                </div>
                                                            ),
                                                    )}

                                                    {qAndA.map(
                                                        (qa, qaIndex) =>
                                                            qa.id.split('.')
                                                                .length === 3 &&
                                                            qa.id.split(
                                                                '.',
                                                            )[0] ===
                                                                section.id &&
                                                            qa.answers?.answers
                                                                .answer &&
                                                            qa.answers?.answers
                                                                .answer[0] && (
                                                                <div
                                                                    key={
                                                                        qaIndex
                                                                    }
                                                                >
                                                                    <SubQuestionsAndAnswersDisplay
                                                                        questionAndAnswer={
                                                                            qa
                                                                        }
                                                                        questionnaireResource={
                                                                            props.questionnaireResource
                                                                        }
                                                                        questionAndAnswerIndex={
                                                                            qaIndex
                                                                        }
                                                                    />
                                                                </div>
                                                            ),
                                                    )}
                                                </Panel>
                                            ),
                                    )}
                                </Collapse>
                            </Col>
                        </div>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default Schemes;
