import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import { Input, Row, Col, Button, Tooltip, Checkbox, Select } from 'antd';
import './answerComponents/AnswerComponent.css';
import { FormContext, updateQuestion } from '../store/FormStore';
import IQuestion from '../types/IQuestion';
import AnswerTypes from '../types/IAnswer';
const { TextArea } = Input;
const { Option } = Select;

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

    function handleInput(questionString: string) {
        setPlaceholder(questionString);
        if (question) {
            const temp = { ...question };
            temp.questionText = questionString;
            dispatch(updateQuestion(temp));
        }
    }

    const [localQuestion, setLocalQuestion] = useState(
        state.questions[questionId] as IQuestion,
    );

    function localUpdate(attribute: {
        answerType?: AnswerTypes;
        isRequired?: boolean;
        hasDescription?: boolean;
        description?: string;
        updateStore?: boolean;
    }) {
        const temp = { ...localQuestion };
        if (attribute.answerType) temp.answerType = attribute.answerType;
        if (attribute.isRequired !== undefined)
            temp.isRequired = attribute.isRequired;
        if (attribute.hasDescription !== undefined)
            temp.hasDescription = attribute.hasDescription;
        if (attribute.description) temp.description = attribute.description;
        setLocalQuestion(temp);
        if (attribute.updateStore) dispatch(updateQuestion(temp));
    }

    return (
        <div style={{ backgroundColor: 'var(--color-base-1)' }}>
            <Row style={{ padding: '0 23px 0 7px ' }}>
                <Col span={20}>
                    <Input
                        placeholder={placeholder}
                        className="input-question"
                        value={questionTitle}
                        onChange={(e): void => {
                            setQuestionTitle(e.target.value);
                        }}
                        onBlur={(e) => handleInput(e.target.value)}
                    />
                </Col>
            </Row>
            <Row className="standard">
                <Col span={10}>
                    <Checkbox
                        onChange={(e) =>
                            localUpdate({
                                isRequired: e.target.checked,
                                updateStore: true,
                            })
                        }
                    >
                        Spørsmålet skal være obligatorisk.
                    </Checkbox>
                </Col>
                <Col span={10}>
                    <Checkbox
                        onChange={(e) =>
                            localUpdate({
                                hasDescription: e.target.checked,
                                updateStore: true,
                            })
                        }
                    >
                        Spørsmålet skal ha forklarende tekst.
                    </Checkbox>
                </Col>
            </Row>
            {localQuestion.hasDescription && (
                <Row className="standard">
                    <Col span={20}>
                        <TextArea
                            rows={3}
                            className="input-question"
                            placeholder={
                                'Skriv inn beskrivelse av spørsmål her.'
                            }
                            onBlur={() => localUpdate({ updateStore: true })}
                            onChange={(value) =>
                                localUpdate({
                                    description: value.target.value,
                                    updateStore: false,
                                })
                            }
                        ></TextArea>
                    </Col>
                </Row>
            )}
            <Row className="standard">
                <Col span={20}>
                    {/* Answerdropdown*/}
                    <p style={{ float: 'left', padding: '5px 10px 0 0' }}>
                        Velg type spørsmål:{' '}
                    </p>
                    <Select
                        value={question.answerType}
                        style={{ width: '200px', float: 'left' }}
                        onSelect={(value) => {
                            localUpdate({
                                answerType: value,
                                updateStore: true,
                            });
                        }}
                        placeholder="Trykk for å velge"
                    >
                        <Option value={AnswerTypes.boolean}>Samtykke</Option>
                        <Option value={AnswerTypes.number}>Tall</Option>
                        <Option value={AnswerTypes.text}>Tekst</Option>
                        <Option value={AnswerTypes.time}>Dato/tid</Option>
                        <Option value={AnswerTypes.choice}>Flervalg</Option>
                    </Select>
                </Col>
            </Row>
        </div>
    );
}

export default QuestionBuilder;
