import React, { useState, useEffect } from 'react';
import { Collapse, Row } from 'antd';
import './Schemes.style.scss';
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
    useEffect(() => {
        let hasAddedId = false;
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
            hasAddedId = false;
        });
    }, [props]);

    const { Panel } = Collapse;

    return (
        <>
            <Row justify="center">
                <div className="card">
                    <h1 className="title">{props.title}</h1>
                    <Row justify="center">
                        {props.date.format('DD/MM/YYYY HH:mm')}
                    </Row>
                    <Collapse
                        bordered={false}
                        style={{ width: 1000 }}
                        className="site-collapse-custom-collapse"
                    >
                        {qAndA.map(
                            (section) =>
                                section.id.split('.').length === 1 && (
                                    <Panel
                                        header={
                                            section.questions.questions.text
                                        }
                                        key={section.id}
                                        className="site-collapse-custom-panel"
                                    >
                                        {qAndA.map(
                                            (qa, qaIndex) =>
                                                qa.id.split('.').length === 2 &&
                                                section.id ===
                                                    qa.id.split('.')[0] &&
                                                qa.answers?.answers.answer &&
                                                qa.answers?.answers
                                                    .answer[0] && (
                                                    <QuestionsAndAnswersDisplay
                                                        questionAndAnswer={qa}
                                                        questionnaireResource={
                                                            props.questionnaireResource
                                                        }
                                                        questionAndAnswerIndex={
                                                            qaIndex
                                                        }
                                                    />
                                                ),
                                        )}

                                        {qAndA.map(
                                            (qa, qaIndex) =>
                                                qa.id.split('.').length === 3 &&
                                                qa.id.split('.')[0] ===
                                                    section.id &&
                                                qa.answers?.answers.answer &&
                                                qa.answers?.answers
                                                    .answer[0] && (
                                                    <SubQuestionsAndAnswersDisplay
                                                        questionAndAnswer={qa}
                                                        questionnaireResource={
                                                            props.questionnaireResource
                                                        }
                                                        questionAndAnswerIndex={
                                                            qaIndex
                                                        }
                                                    />
                                                ),
                                        )}
                                    </Panel>
                                ),
                        )}
                    </Collapse>
                </div>
            </Row>
        </>
    );
};

export default Schemes;
