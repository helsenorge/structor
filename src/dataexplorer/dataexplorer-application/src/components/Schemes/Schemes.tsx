import React from 'react';
import { Collapse, Row, Popover, Button } from 'antd';
import './Schemes.style.scss';
import { IQuestionAndAnswer } from 'types/IQuestionAndAnswer';
import { ResourceContainer } from 'types/fhirTypes/fhir';
import { IConcept } from 'types/IQuestionnaireResources';

export interface SchemesProps {
    qAndA: IQuestionAndAnswer[];
    questionnaireResource: ResourceContainer[];
}

const Schemes = (props: SchemesProps) => {
    const { Panel } = Collapse;

    function setContent(data: IConcept[]) {
        if (data) {
            return data.map((line) => <li key={line.code}>{line.display}</li>);
        }
        return;
    }

    return (
        <>
            <Row justify="center">
                <div className="card">
                    <h1 className="title"> Tittel </h1>
                    <Collapse
                        bordered={false}
                        style={{ width: 1000 }}
                        className="site-collapse-custom-collapse"
                    >
                        {props.qAndA.map(
                            (section) =>
                                section.id.match('^[^.]*$') && (
                                    <Panel
                                        header={
                                            section.questions.questions.text
                                        }
                                        key={section.id}
                                        className="site-collapse-custom-panel"
                                    >
                                        {props.qAndA.map(
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
                                                                (props
                                                                    .questionnaireResource
                                                                    .length > 0
                                                                    ? qr.compose.include.map(
                                                                          (
                                                                              m,
                                                                          ) => (
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
                                        {props.qAndA.map(
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
                                                                (props
                                                                    .questionnaireResource
                                                                    .length > 0
                                                                    ? qr.compose.include.map(
                                                                          (
                                                                              m,
                                                                          ) => (
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
