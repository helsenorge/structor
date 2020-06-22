import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Tooltip } from 'antd';
import InputField from '../questionComponent/InputField';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Question from '../questionComponent/Question';

type SectionProps = {
    id: number;
    removeSection: () => void;
};

function Section({ id, removeSection }: SectionProps): JSX.Element {
    const [placeholder, setPlaceholder] = useState('Tittel...');
    const [isSection, setIsSection] = useState(false);
    const [questions, setQuestions] = useState([0]);
    const [count, setCount] = useState(0);

    function findPlaceholder() {
        if (id === 0) {
            setIsSection(false);
            setPlaceholder('Tittel...');
            return;
        }
        setIsSection(true);
        setPlaceholder('Seksjonstittel...');
    }

    useEffect(() => {
        findPlaceholder();
    });

    function addQuestion() {
        questions.push(count + 1);
        setQuestions(questions);
        setCount(count + 1);
    }

    function removeQuestion(questionId: number) {
        setQuestions(questions.filter((index) => index !== questionId));
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
                <Col span={22}>
                    <div style={{ display: 'inline' }}>
                        <InputField placeholder={placeholder} />
                    </div>
                </Col>
                <Col span={2}>
                    {isSection && (
                        <Tooltip title="Slett seksjon">
                            <Button
                                style={{ zIndex: 1, color: 'var(--primary-1)' }}
                                size="large"
                                icon={<DeleteOutlined />}
                                type="link"
                                onClick={() => removeSection()}
                            />
                        </Tooltip>
                    )}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {questions.map((question, index) => [
                        <hr
                            key={'hr' + index}
                            style={{
                                color: 'black',
                                width: '100%',
                                border: '0.2px solid var(--color-base-2)',
                            }}
                        />,
                        <Question
                            key={question}
                            id={index}
                            removeQuestion={() => removeQuestion(question)}
                        />,
                    ])}
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ margin: '10px' }}>
                    <Tooltip title="Legg til nytt spørsmål">
                        <Button
                            style={{
                                backgroundColor: 'var(--primary-1)',
                                borderColor: 'var(--primary-1)',
                            }}
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={addQuestion}
                        />
                    </Tooltip>
                </Col>
            </Row>
        </div>
    );
}

export default Section;
