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

export interface SchemaViewProps {
    questions: IQuestion[];
    answers: IAnswer[];
    questionnaireResource: fhir.ValueSet[];
    date: Dayjs;
    title: string;
}

const SchemaView = (props: SchemaViewProps) => {
    dayjs.locale('nb');
    const [qAndA, setQAndA] = useState<IQuestionAndAnswer[]>([]);
    const [qAndAIds, setQAndAIds] = useState<string[]>([]);

    useEffect(() => {
        let hasAddedId = false;
        setQAndA([]);
        setQAndAIds([]);
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
                setQAndAIds((qAndAIds) => [
                    ...qAndAIds,
                    q.id.split('.')[0].toString(),
                ]);
            hasAddedId = false;
        });
    }, [props]);

    const { Panel } = Collapse;

    return (
        <>
            {qAndAIds.length > 0 && (
                <Row justify="center">
                    <Col span={12}>
                        <div className="card">
                            <Row className="inner-schema-row">
                                <Col span={8} className="date-column">
                                    {props.date.format('DD/MM/YYYY HH:mm')}
                                </Col>
                                <Row justify="center">
                                    <Col span={21}>
                                        <h1 className="title">{props.title}</h1>
                                    </Col>
                                    <Col span={21}>
                                        <Collapse
                                            bordered={false}
                                            className="site-collapse-custom-collapse"
                                            defaultActiveKey={qAndAIds}
                                        >
                                            {qAndA.map(
                                                (section) =>
                                                    section.id.split('.')
                                                        .length === 1 && (
                                                        <Panel
                                                            header={
                                                                section
                                                                    .questions
                                                                    .questions
                                                                    .text
                                                            }
                                                            key={section.id}
                                                            className="site-collapse-custom-panel"
                                                        >
                                                            {qAndA.map(
                                                                (
                                                                    qa,
                                                                    qaIndex,
                                                                ) => (
                                                                    <>
                                                                        {qa.id.split(
                                                                            '.',
                                                                        )[0] ===
                                                                            section.id &&
                                                                            qa.id.split(
                                                                                '.',
                                                                            )
                                                                                .length ===
                                                                                2 &&
                                                                            qa
                                                                                .answers
                                                                                ?.answers
                                                                                .answer &&
                                                                            qa
                                                                                .answers
                                                                                ?.answers
                                                                                .answer[0] && (
                                                                                <div
                                                                                    className="qa-container"
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
                                                                                    {qAndA.map(
                                                                                        (
                                                                                            subqa,
                                                                                            subqaIndex,
                                                                                        ) =>
                                                                                            subqa.id.split(
                                                                                                '.',
                                                                                            )[0] ===
                                                                                                section.id &&
                                                                                            subqa.id.split(
                                                                                                '.',
                                                                                            )[1] ===
                                                                                                qa.id.split(
                                                                                                    '.',
                                                                                                )[1] &&
                                                                                            subqa.id.split(
                                                                                                '.',
                                                                                            )
                                                                                                .length ===
                                                                                                3 &&
                                                                                            subqa
                                                                                                .answers
                                                                                                ?.answers
                                                                                                .answer &&
                                                                                            subqa
                                                                                                .answers
                                                                                                ?.answers
                                                                                                .answer[0] && (
                                                                                                <QuestionsAndAnswersDisplay
                                                                                                    questionAndAnswer={
                                                                                                        subqa
                                                                                                    }
                                                                                                    questionnaireResource={
                                                                                                        props.questionnaireResource
                                                                                                    }
                                                                                                    questionAndAnswerIndex={
                                                                                                        subqaIndex
                                                                                                    }
                                                                                                />
                                                                                            ),
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                ),
                                                            )}
                                                        </Panel>
                                                    ),
                                            )}
                                        </Collapse>
                                    </Col>
                                </Row>
                            </Row>
                        </div>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default SchemaView;
