import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './QuestionComponents.css';
import AnswerComponent from '../answerComponent/AnswerComponent';
const { TextArea } = Input;

type QuestionProps = {
    id: number;
    removeQuestion: () => void;
};

function Question({ id, removeQuestion }: QuestionProps): JSX.Element {
    const [placeholder, setPlaceholder] = useState('Spørsmål 1...');
    useEffect(() => {
        findPlaceholder();
    });
    function findPlaceholder() {
        console.log(id + 1);
        setPlaceholder('Spørsmål ' + (id + 1) + '...');
    }
    return (
        <div>
            <Row>
                <Col
                    span={8}
                    className="controller"
                    style={{ padding: '0px 10px 10px' }}
                >
                    <h3>Alternativer</h3>
                </Col>
                <Col span={10} style={{ padding: '0 10px' }}>
                    <TextArea rows={1} placeholder={placeholder} />
                </Col>
                <Col span={2}></Col>
                <Col span={3}>
                    <Button
                        style={{ zIndex: 1, color: 'var(--primary-1)' }}
                        icon={<DeleteOutlined />}
                        type="default"
                        onClick={() => removeQuestion()}
                    >
                        Slett spørsmål
                    </Button>
                </Col>
                <Col span={1}>
                    <Tooltip title="Flytt spørsmål">
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
                </Col>
            </Row>

            <AnswerComponent />
        </div>
    );
}

export default Question;
