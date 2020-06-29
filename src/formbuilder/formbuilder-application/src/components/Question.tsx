import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import { Input, Row, Col, Button, Tooltip } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import './answerComponents/AnswerComponent.css';
import AnswerComponent from './AnswerComponent';
import IQuestion from '../types/IQuestion';
import * as DND from 'react-beautiful-dnd';
import { FormContext, updateQuestion } from '../store/FormStore';

const { TextArea } = Input;

type QuestionProps = {
    question: IQuestion;
    duplicateQuestion: () => void;
    removeQuestion: () => void;
    provided: DND.DraggableProvided;
};

function Question({
    question,
    duplicateQuestion,
    removeQuestion,
    provided,
}: QuestionProps): JSX.Element {
    const { dispatch } = useContext(FormContext);
    const [placeholder, setPlaceholder] = useState('Spørsmål 1...');
    useEffect(() => {
        findPlaceholder();
    });
    function findPlaceholder() {
        setPlaceholder('Spørsmål ' + (question.id + 1) + '...');
    }

    function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
        setPlaceholder(e.target.value);
        if (question) {
            const temp = { ...question };
            temp.questionText = e.target.value;
            dispatch(updateQuestion(temp));
        }
    }
    return (
        <div style={{ backgroundColor: 'var(--color-base-1)' }}>
            <Row>
                <Col
                    span={7}
                    className="controller"
                    style={{ padding: '0px 10px 10px' }}
                >
                    <h3>Alternativer</h3>
                </Col>
                <Col span={10} style={{ padding: '0 10px' }}>
                    <TextArea
                        rows={1}
                        placeholder={placeholder}
                        className="input-question"
                        value={question.questionText}
                        onChange={(e): void => {
                            handleInput(e);
                        }}
                    />
                </Col>
                <Col span={3}>
                    <Button
                        style={{ zIndex: 1, color: 'var(--primary-1)' }}
                        icon={<CopyOutlined />}
                        type="default"
                        onClick={() => duplicateQuestion()}
                    >
                        Dupliser spørsmål
                    </Button>
                </Col>
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
                            {...provided.dragHandleProps}
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

            <AnswerComponent question={question} />
        </div>
    );
}

export default Question;
