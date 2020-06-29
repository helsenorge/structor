import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import { Input, Row, Col, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './answerComponents/AnswerComponent.css';
import AnswerComponent from './AnswerComponent';
import * as DND from 'react-beautiful-dnd';
import { FormContext, updateQuestion } from '../store/FormStore';

const { TextArea } = Input;

type QuestionProps = {
    // question: IQuestion;
    key: string;
    questionId: string;
    removeQuestion: () => void;
    provided: DND.DraggableProvided;
};

function Question({
    questionId,
    removeQuestion,
    provided,
    key,
}: QuestionProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const question = state.questions[questionId];
    const [placeholder, setPlaceholder] = useState('Spørsmål 1...');
    const [questionTitle, setQuestionTitle] = useState(question.questionText);
    useEffect(() => {
        findPlaceholder();
    });
    function findPlaceholder() {
        setPlaceholder('Spørsmål ' + (questionId + 1) + '...');
    }

    function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
        setPlaceholder(e.currentTarget.value);
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
                        value={questionTitle}
                        onChange={(e): void => {
                            setQuestionTitle(e.target.value);
                        }}
                        onBlur={(e) => handleInput(e)}
                    />
                </Col>
                <Col span={3}></Col>
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

            <AnswerComponent questionId={questionId} key={'answer'+questionId} />
        </div>
    );
}

export default Question;
