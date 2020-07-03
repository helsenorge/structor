import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import { Input, Row, Col, Button, Tooltip } from 'antd';
import './answerComponents/AnswerComponent.css';
import { FormContext, updateQuestion } from '../store/FormStore';

const { TextArea } = Input;

type QuestionProps = {
    questionId: string;
};

function QuestionBuilder({ questionId }: QuestionProps): JSX.Element {
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
            <Row justify="center">
                <Col span={20} style={{ padding: '0 10px' }}>
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
            </Row>
        </div>
    );
}

export default QuestionBuilder;
