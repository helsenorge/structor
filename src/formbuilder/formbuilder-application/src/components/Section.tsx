import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Tooltip, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Question from './Question';
import {
    FormContext,
    addNewQuestion,
    removeQuestion,
} from '../store/FormStore';

type SectionProps = {
    sectionId: number;
    removeSection: () => void;
};

function Section({ sectionId, removeSection }: SectionProps): JSX.Element {
    const [placeholder, setPlaceholder] = useState('Tittel...');
    const [isSection, setIsSection] = useState(false);
    const [count, setCount] = useState(0);

    const { state, dispatch } = useContext(FormContext);

    function findPlaceholder() {
        if (sectionId === 0) {
            setIsSection(false);
            setPlaceholder('Skjematittel...');
            return;
        }
        setIsSection(true);
        setPlaceholder('Seksjonstittel...');
    }

    useEffect(() => {
        findPlaceholder();
    });

    function dispatchAddQuestion() {
        dispatch(addNewQuestion(sectionId, count + 1));
        setCount(count + 1);
    }

    function dispatchRemoveQuestion(questionId: number) {
        dispatch(removeQuestion(sectionId, questionId));
    }

    return (
        <div
            style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: 'var(--color-base-1)',
                width: '95%',
                display: 'inline-block',
            }}
        >
            <Row>
                <Col span={6}></Col>
                <Col span={12}>
                    <Input
                        placeholder={placeholder}
                        className="input-question"
                        size="large"
                    />
                </Col>
                <Col span={2}></Col>
                <Col span={3}>
                    {isSection && (
                        <Button
                            style={{ zIndex: 1, color: 'var(--primary-1)' }}
                            size="large"
                            icon={<DeleteOutlined />}
                            type="default"
                            onClick={() => removeSection()}
                        >
                            Slett seksjon
                        </Button>
                    )}
                </Col>
                <Col span={1}>
                    {isSection && (
                        <Tooltip title="Flytt seksjon">
                            <Button
                                style={{ zIndex: 1, color: 'var(--primary-1)' }}
                                size="large"
                                type="link"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    width="24"
                                >
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path
                                        fill="var(--primary-1)"
                                        d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
                                    />
                                </svg>
                            </Button>
                        </Tooltip>
                    )}
                </Col>
            </Row>
            <Row>
                <hr
                    key="hrTitle"
                    style={{
                        color: 'black',
                        width: '100%',
                        border: '0.2px solid var(--color-base-2)',
                    }}
                />
            </Row>
            <Row>
                <Col span={24}>
                    {Object.keys(state.sections[sectionId].questions).map(
                        (questionId) => {
                            const question =
                                state.sections[sectionId].questions[
                                    parseInt(questionId)
                                ];
                            return [
                                <hr
                                    key={'questionhr' + sectionId + questionId}
                                    style={{
                                        color: 'black',
                                        width: '100%',
                                        border:
                                            '0.2px solid var(--color-base-2)',
                                    }}
                                />,
                                <Question
                                    key={'question' + sectionId + questionId}
                                    question={question}
                                    removeQuestion={() =>
                                        dispatchRemoveQuestion(
                                            parseInt(questionId),
                                        )
                                    }
                                />,
                            ];
                        },
                    )}
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ margin: '10px' }}>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary-1)',
                            borderColor: 'var(--primary-1)',
                        }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={dispatchAddQuestion}
                    >
                        Legg til nytt spørsmål
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default Section;
