import React, { useState, useEffect } from 'react';
import { Collapse, Row, Col, Button } from 'antd';
import './SchemaView.style.scss';
import { IQuestionAndAnswer, IQuestion, IAnswer } from 'types/IQuestionAndAnswer';
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
    const [sectionDescription, setSectionDescription] = useState<string[]>([]);
    const [containsDescription, setContainsDescription] = useState<string[]>([]);

    useEffect(() => {
        let hasAddedId = false;
        setQAndA([]);
        setQAndAIds([]);
        props.questions.forEach((q) => {
            props.answers.forEach((a) => {
                if (q.id === a.id) {
                    hasAddedId = true;
                    setQAndA((qAndA) => [...qAndA, { id: q.id, questions: q, answers: a }]);
                }
            });

            hasAddedId === false && setQAndA((qAndA) => [...qAndA, { id: q.id, questions: q }]);
            q.id.split('.').length === 1 && setQAndAIds((qAndAIds) => [...qAndAIds, q.id.split('.')[0].toString()]);
            hasAddedId = false;
        });
    }, [props]);

    useEffect(() => {
        qAndA.map(
            (i) =>
                i.questions.questions.type === 'display' &&
                i.id.split('.')[1] !== '101' &&
                setContainsDescription((containsDescription) => [...containsDescription, i.id.split('.')[0]]),
        );
    }, [qAndA]);

    const { Panel } = Collapse;

    return (
        <>
            {qAndAIds.length > 0 && (
                <Row justify="center">
                    <Col>
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
                                                    section.id.split('.').length === 1 && (
                                                        <Panel
                                                            header={section.questions.questions.text}
                                                            key={section.id}
                                                            className="site-collapse-custom-panel"
                                                        >
                                                            <div className="description-container">
                                                                {qAndA.map(
                                                                    (display) =>
                                                                        display.id.split('.')[0] === section.id &&
                                                                        display.id.split('.')[1] === '101' && (
                                                                            <p
                                                                                key={display.id}
                                                                                className="section-description"
                                                                            >
                                                                                {display.questions.questions.text}
                                                                            </p>
                                                                        ),
                                                                )}
                                                                <span className="counteract-onlychild"></span>
                                                                {containsDescription.includes(
                                                                    section.id.split('.')[0],
                                                                ) && (
                                                                    <>
                                                                        <span className="counteract-onlychild"></span>
                                                                        {!sectionDescription.includes(
                                                                            section.id.split('.')[0],
                                                                        ) && (
                                                                            <Button
                                                                                type="primary"
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    setSectionDescription(
                                                                                        (sectionDescription) => [
                                                                                            ...sectionDescription,
                                                                                            section.id.split('.')[0],
                                                                                        ],
                                                                                    )
                                                                                }
                                                                            >
                                                                                <p className="information">
                                                                                    Vis informasjon
                                                                                </p>
                                                                                <span className="counteract-onlychild"></span>
                                                                            </Button>
                                                                        )}
                                                                        {sectionDescription.includes(
                                                                            section.id.split('.')[0],
                                                                        ) && (
                                                                            <Button
                                                                                type="primary"
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    setSectionDescription(
                                                                                        sectionDescription.filter(
                                                                                            (list) =>
                                                                                                list.replace(
                                                                                                    section.id.split(
                                                                                                        '.',
                                                                                                    )[0],
                                                                                                    '',
                                                                                                ),
                                                                                        ),
                                                                                    )
                                                                                }
                                                                            >
                                                                                <p className="information">
                                                                                    Skjul Informasjon
                                                                                </p>
                                                                                <span className="counteract-onlychild"></span>
                                                                            </Button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                            {qAndA.map(
                                                                (qa, qaIndex) =>
                                                                    qa.id.split('.')[0] === section.id &&
                                                                    qa.id.split('.').length === 2 && (
                                                                        <React.Fragment key={qa.id}>
                                                                            {qa.questions.questions.type ===
                                                                                'display' &&
                                                                                qa.id.split('.')[1] !== '101' &&
                                                                                sectionDescription.includes(
                                                                                    qa.id.split('.')[0],
                                                                                ) && (
                                                                                    <div className="description-container">
                                                                                        <p className="section-description">
                                                                                            {
                                                                                                qa.questions.questions
                                                                                                    .text
                                                                                            }
                                                                                        </p>
                                                                                        <span className="counteract-onlychild"></span>
                                                                                    </div>
                                                                                )}
                                                                            {qa.answers?.answers.answer &&
                                                                                qa.answers?.answers.answer[0] && (
                                                                                    <div className="qa-container">
                                                                                        <QuestionsAndAnswersDisplay
                                                                                            questionAndAnswer={qa}
                                                                                            questionnaireResource={
                                                                                                props.questionnaireResource
                                                                                            }
                                                                                            questionAndAnswerIndex={
                                                                                                qaIndex
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            {qAndA.map(
                                                                                (subqa, subqaIndex) =>
                                                                                    subqa.id.split('.')[0] ===
                                                                                        section.id &&
                                                                                    subqa.id.split('.')[1] ===
                                                                                        qa.id.split('.')[1] &&
                                                                                    subqa.id.split('.').length === 3 &&
                                                                                    subqa.answers?.answers.answer &&
                                                                                    subqa.answers?.answers
                                                                                        .answer[0] && (
                                                                                        <QuestionsAndAnswersDisplay
                                                                                            questionAndAnswer={subqa}
                                                                                            questionnaireResource={
                                                                                                props.questionnaireResource
                                                                                            }
                                                                                            questionAndAnswerIndex={
                                                                                                subqaIndex
                                                                                            }
                                                                                        />
                                                                                    ),
                                                                            )}
                                                                        </React.Fragment>
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
