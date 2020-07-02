import React, { useState, useEffect } from 'react';
import { Collapse, Row, Popover, Button } from 'antd';
import './Schemes.style.scss';
import {
    IQuestionAndAnswer,
    IQuestion,
    IAnswer,
} from 'types/IQuestionAndAnswer';
import dayjs, { Dayjs } from 'dayjs';

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
        // eslint-disable-next-line
        props.questions.map((q) => {
            // eslint-disable-next-line
            props.answers.map((a) => {
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

    const setContent = (data: fhir.ValueSetComposeIncludeConcept[]) => {
        if (data) {
            return data.map((line) => <li key={line.code}>{line.display}</li>);
        }
        return;
    };

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
                                section.id.match('^[^.]*$') && (
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
                                                    <div
                                                        key={qaIndex}
                                                        className="boarder"
                                                    >
                                                        <br></br>
                                                        <p className="questions">
                                                            {
                                                                qa.questions
                                                                    .questions
                                                                    .text
                                                            }
                                                        </p>
                                                        <p className="inline">
                                                            Svar:
                                                        </p>
                                                        {props.questionnaireResource.map(
                                                            (qr) =>
                                                                qr.id ===
                                                                    qa.questions.questions.options?.reference?.slice(
                                                                        1,
                                                                    ) &&
                                                                qr.compose &&
                                                                (props
                                                                    .questionnaireResource
                                                                    .length > 0
                                                                    ? qr.compose.include.map(
                                                                          (m) =>
                                                                              m.concept && (
                                                                                  <Popover
                                                                                      key={
                                                                                          m.system
                                                                                      }
                                                                                      placement="rightTop"
                                                                                      trigger="click"
                                                                                      content={setContent(
                                                                                          m.concept,
                                                                                      )}
                                                                                  >
                                                                                      <Button
                                                                                          className="nopadding"
                                                                                          type="link"
                                                                                      >
                                                                                          (Vis
                                                                                          alternativer)
                                                                                      </Button>
                                                                                  </Popover>
                                                                              ),
                                                                      )
                                                                    : null),
                                                        )}
                                                        {qa.answers?.answers.answer?.map(
                                                            (item) => (
                                                                <p
                                                                    className="answers"
                                                                    key={
                                                                        item
                                                                            .valueCoding
                                                                            ?.display
                                                                            ? qa
                                                                                  .answers
                                                                                  ?.id +
                                                                              item
                                                                                  .valueCoding
                                                                                  .display
                                                                            : qa
                                                                                  .answers
                                                                                  ?.id
                                                                    }
                                                                >
                                                                    {
                                                                        item.valueBoolean
                                                                    }
                                                                    {
                                                                        item
                                                                            .valueCoding
                                                                            ?.display
                                                                    }
                                                                    {
                                                                        item.valueDate
                                                                    }
                                                                    {
                                                                        item.valueDecimal
                                                                    }
                                                                    {
                                                                        item.valueString
                                                                    }
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
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
                                                    <div key={qaIndex}>
                                                        <br></br>
                                                        <p className="questions">
                                                            {
                                                                qa.questions
                                                                    .questions
                                                                    .text
                                                            }
                                                        </p>
                                                        <p className="inline">
                                                            Subspørsmål Svar:
                                                        </p>
                                                        {props.questionnaireResource.map(
                                                            (qr) =>
                                                                qr.id ===
                                                                    qa.questions.questions.options?.reference?.slice(
                                                                        1,
                                                                    ) &&
                                                                qr.compose &&
                                                                (props
                                                                    .questionnaireResource
                                                                    .length > 0
                                                                    ? qr.compose.include.map(
                                                                          (m) =>
                                                                              m.concept && (
                                                                                  <Popover
                                                                                      key={
                                                                                          m.system
                                                                                      }
                                                                                      placement="rightTop"
                                                                                      trigger="click"
                                                                                      content={setContent(
                                                                                          m.concept,
                                                                                      )}
                                                                                  >
                                                                                      <Button
                                                                                          className="nopadding"
                                                                                          type="link"
                                                                                      >
                                                                                          (Vis
                                                                                          alternativer)
                                                                                      </Button>
                                                                                  </Popover>
                                                                              ),
                                                                      )
                                                                    : null),
                                                        )}
                                                        {qa.answers?.answers.answer?.map(
                                                            (item) => (
                                                                <p
                                                                    className="answers"
                                                                    key={
                                                                        item
                                                                            .valueCoding
                                                                            ?.display
                                                                            ? qa
                                                                                  .answers
                                                                                  ?.id +
                                                                              item
                                                                                  .valueCoding
                                                                                  .display
                                                                            : qa
                                                                                  .answers
                                                                                  ?.id
                                                                    }
                                                                >
                                                                    {
                                                                        item.valueBoolean
                                                                    }
                                                                    {
                                                                        item
                                                                            .valueCoding
                                                                            ?.display
                                                                    }
                                                                    {
                                                                        item.valueDate
                                                                    }
                                                                    {
                                                                        item.valueDecimal
                                                                    }
                                                                    {
                                                                        item.valueString
                                                                    }
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
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
