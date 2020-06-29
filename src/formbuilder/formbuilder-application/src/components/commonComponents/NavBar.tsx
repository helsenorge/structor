import React, { useContext, useState } from 'react';
import { Button, Tooltip, Row, Col, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
//import { convertQuestions } from '../../helpers/JSONConverter';
import { FormContext } from '../../store/FormStore';
import './NavBar.css';
import JSONQuestion from '../../types/JSONQuestion';
import JSONAnswer from '../../types/JSONAnswer';
import { Questionnaire, ResourceType, uri, code } from '../../types/fhir';

const { Title } = Typography;

function NavBar(): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    function convertQuestions(): Array<JSONQuestion> {
        const aux = [];
        for (const i in state.sectionOrder) {
            const sectionKey = state.sectionOrder[i];
            for (const j in state.sections[sectionKey].questionOrder) {
                const questionKey = state.sections[sectionKey].questionOrder[j];
                // Will be within 'item' and if in section another 'item' of type group
                aux.push({
                    linkId: state.questions[questionKey].sectionId, // sectionId.newId
                    text: state.questions[questionKey].questionText, // question text
                    type: state.questions[questionKey].answer.type, // TODO: display | boolean | decimal | integer | date | dateTime
                    required: true, // true | false TODO
                    repeats: false, // TODO
                    readOnly: false, // TODO
                    options: {
                        reference: '', // with a hashtag in front. TODO: Add valuesetID
                    },
                    // TODO: 'initialCoding' and 'extension'
                });
            }
        }
        return aux;
    }
    function convertAnswers(): Array<JSONAnswer> {
        const aux = [];
        for (const i in state.sectionOrder) {
            const sectionKey = state.sectionOrder[i];
            for (const j in state.sections[sectionKey].questionOrder) {
                const questionKey = state.sections[sectionKey].questionOrder[j];
                const choices = state.questions[questionKey].answer.choices;
                for (const k in choices) {
                    if (choices !== undefined && k !== undefined) {
                        aux.push({
                            code: parseInt(k) + 1,
                            display: choices[parseInt(k)],
                        });
                    }
                }
            }
        }
        return aux;
    }
    function converter() {
        const valueSets = convertAnswers();
        const questions = convertQuestions();
        const questionnaire: Questionnaire = {
            resourceType: "Questionnaire",
            meta: {
              profile: ["http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire"] as unknown as Array<uri>,
              tag: [
                { system: "urn:ietf:bcp:47", code: "nb-NO", display: "Norsk bokmål" },
              ],
            },
            language: "nb-NO" as unknown as code,
            contained: [
              {
                resourceType: 'ValueSet',
                id: "8459",
                version: "1.0",
                name: "urn:oid:8459",
                title: "Kjønn",
                status: "draft",
                publisher: "Direktoratet for e-helse",
                compose: {
                  include: [
                    {
                      system: "urn:oid:2.16.578.1.12.4.1.8459",
                      concept: [
                        valueSets
                      ],
                    },
                  ],
                },
              },
        };
    }
    return (
        <div className="nav-bar">
            <Row>
                <Col span={1}>
                    <Tooltip title="Tilbake">
                        <Button
                            style={{
                                margin: '5px',
                                float: 'left',
                                color: 'var(--color-base-1)',
                            }}
                            type="link"
                            shape="circle"
                            icon={<LeftOutlined />}
                            onClick={() => window.history.back()}
                        />
                    </Tooltip>
                </Col>
                <Col span={17}>
                    <Title
                        level={2}
                        style={{ color: 'var(--color-base-1)', float: 'left' }}
                    >
                        Skjemabygger
                    </Title>
                </Col>
                <Col span={6}>
                    <div style={{ float: 'right' }}>
                        <Button
                            className="nav-button"
                            type="link"
                            size="large"
                            style={{ margin: '2px' }}
                            key="previewForm"
                        >
                            Forhåndsvisning
                        </Button>
                        <Button
                            className="nav-button"
                            type="link"
                            size="large"
                            style={{ margin: '2px 10px' }}
                            key="saveForm"
                            onClick={convertQuestions}
                        >
                            Lagre
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default NavBar;
