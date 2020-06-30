import React, { useState, useContext } from 'react';
import { Row, Col, Select, Input, Checkbox, InputNumber } from 'antd';
import './answerComponents/AnswerComponent.css';
import TextInput from './answerComponents/TextInput';
import RadioButton from './answerComponents/RadioButton';
import Decimal from './answerComponents/Decimal';
import IAnswer, {
    AnswerTypes,
    IExtremas,
    IText,
    IChoice,
} from '../types/IAnswer';
import { FormContext, updateQuestion, updateAnswer } from '../store/FormStore';
import BooleanInput from './answerComponents/BooleanInput';
import IQuestion from '../types/IQuestion';

const { TextArea } = Input;

type AnswerComponentProps = {
    questionId: string;
};

function AnswerComponent({ questionId }: AnswerComponentProps): JSX.Element {
    const { Option } = Select;
    const { state, dispatch } = useContext(FormContext);

    const question = state.questions[questionId];
    console.log(question);

    const [questionMeta, setQuestionMeta] = useState(question);

    const [answerMeta, setAnswerMeta] = useState(question.answer);

    function updateQuestionMeta(
        answerType?: AnswerTypes,
        hasDescription?: boolean,
        isRequired?: boolean,
        description?: string,
    ) {
        const a = { ...question } as IQuestion;
        console.log(answerType);
        console.log(a);
        if (hasDescription) {
            a.hasDescription = hasDescription;
        }
        if (isRequired) {
            a.isRequired = isRequired;
        }
        if (description) {
            a.description = description;
        }
        if (answerType) {
            a.answerType = answerType;
            if (answerType === AnswerTypes.radio) {
                a.answer = { type: answerType, choices: [''] } as IChoice;
                console.log(a);
            } else if (answerType === AnswerTypes.text) {
                a.answer = { type: answerType, maxLength: 100 } as IText;
            } else if (answerType === AnswerTypes.decimal) {
                a.answer = {
                    type: answerType,
                    maxValue: 0,
                    minValue: 200,
                } as IExtremas;
            } else {
                a.answer = { type: answerType } as IAnswer;
            }
        }
        setQuestionMeta(a);
        dispatch(updateQuestion(questionMeta));
    }

    function updateExtremas(minValue?: number, maxValue?: number) {
        const a = { ...answerMeta } as IExtremas;
        if (minValue) {
            a.minValue = minValue;
        }
        if (maxValue) {
            a.maxValue = maxValue;
        }
        setAnswerMeta(a);
        dispatch(updateAnswer(question.id, a));
    }

    function updateText(maxLength: number) {
        const a = { ...answerMeta } as IText;
        a.maxLength = maxLength;
        setAnswerMeta(a);
        dispatch(updateAnswer(question.id, a));
    }

    type answerList = { [key: string]: JSX.Element };

    const propsController: answerList = {
        [AnswerTypes.radio]: <div></div>,
        [AnswerTypes.boolean]: <div></div>,
        [AnswerTypes.decimal]: (
            <div>
                <Row>
                    <Col span={24} style={{ padding: '0 10px' }}>
                        <p>
                            Mottaker fyller ut en tallverdi, enten fritt eller
                            innenfor bestemte verdier.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Checkbox
                            onChange={(e) =>
                                e.target.checked
                                    ? updateExtremas(0 as number, undefined)
                                    : updateExtremas(undefined, undefined)
                            }
                        >
                            Min
                        </Checkbox>
                    </Col>
                    <Col span={14}>
                        <InputNumber
                            type="number"
                            defaultValue={0}
                            disabled={!(answerMeta as IExtremas).minValue}
                            onChange={(value) =>
                                updateExtremas(value as number, undefined)
                            }
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Checkbox
                            onChange={(e) =>
                                e.target.checked
                                    ? updateExtremas(undefined, 0 as number)
                                    : updateExtremas(undefined, undefined)
                            }
                        >
                            Max
                        </Checkbox>
                    </Col>
                    <Col span={14}>
                        <InputNumber
                            type="number"
                            defaultValue={100}
                            disabled={!(answerMeta as IExtremas).maxValue}
                            onChange={(value) =>
                                updateExtremas(undefined, value as number)
                            }
                        />
                    </Col>
                </Row>
            </div>
        ),
        [AnswerTypes.text]: (
            <div>
                <Row>
                    <Col span={24} style={{ padding: '0 10px' }}>
                        <p>
                            Mottaker fyller ut et skriftlig svar i en tekstboks,
                            enten i form av et kortsvar eller et langsvar
                            begrenset av et satt antall karakterer.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Checkbox
                            onChange={(e) =>
                                e.target.checked
                                    ? updateText(0 as number)
                                    : updateText(NaN)
                            }
                        />
                    </Col>
                    <Col span={14} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>
                            Langsvar. Maks antall karakterer:{' '}
                        </p>
                    </Col>
                    <Col span={5} style={{ padding: '0 10px' }}>
                        <InputNumber
                            min={1}
                            max={5000}
                            size="small"
                            defaultValue={(answerMeta as IText).maxLength}
                            disabled={!(answerMeta as IText).maxLength}
                            onChange={(value) => updateText(value as number)}
                        />
                    </Col>
                </Row>
            </div>
        ),
    };

    const answerBuilder: answerList = {
        [AnswerTypes.radio]: (
            <RadioButton questionId={questionId}></RadioButton>
        ),
        [AnswerTypes.boolean]: <BooleanInput></BooleanInput>,
        [AnswerTypes.decimal]: (
            <Decimal
                max={(answerMeta as IExtremas).maxValue}
                min={(answerMeta as IExtremas).minValue}
            ></Decimal>
        ),
        [AnswerTypes.text]: (
            <TextInput
                longAnswer={(answerMeta as IText).maxLength ? true : false}
                maxLength={(answerMeta as IText).maxLength}
                placeholder="Mottaker skriver svar her"
            ></TextInput>
        ),
    };

    return (
        <Row>
            <Col span={7} className="controller">
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Checkbox
                            value={question.hasDescription}
                            onChange={(e) =>
                                e.target.checked
                                    ? updateQuestionMeta(
                                          undefined,
                                          true,
                                          undefined,
                                          undefined,
                                      )
                                    : updateQuestionMeta(
                                          undefined,
                                          false,
                                          undefined,
                                          undefined,
                                      )
                            }
                        />
                    </Col>
                    <Col span={21} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>
                            Forklaring av spørsmål til mottaker
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Checkbox
                            value={question.isRequired}
                            onChange={(e) => {
                                e.target.checked
                                    ? updateQuestionMeta(
                                          undefined,
                                          undefined,
                                          true,
                                          undefined,
                                      )
                                    : updateQuestionMeta(
                                          undefined,
                                          undefined,
                                          false,
                                          undefined,
                                      );
                            }}
                        />
                    </Col>
                    <Col span={21} style={{ padding: '0 10px' }}>
                        <p>Spørsmålet skal være obligatorisk</p>
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={24}
                        style={{ alignItems: 'center', padding: '10px' }}
                    >
                        {/* Answerdropdown*/}
                        <Select
                            value={state.questions[questionId].answerType}
                            style={{ width: '200px' }}
                            onSelect={(value) => {
                                updateQuestionMeta(
                                    value,
                                    undefined,
                                    undefined,
                                    undefined,
                                );
                            }}
                            placeholder="Velg svartype"
                        >
                            <Option value={AnswerTypes.boolean}>Ja/nei</Option>
                            <Option value={AnswerTypes.decimal}>Tall</Option>
                            <Option value={AnswerTypes.text}>Tekst</Option>
                            <Option value={AnswerTypes.radio}>Flervalg</Option>
                        </Select>
                    </Col>
                </Row>
                {propsController[question.answerType]}
            </Col>

            <Col span={10} style={{ padding: '10px' }}>
                {question.hasDescription && (
                    <div style={{ paddingBottom: '10px' }}>
                        <TextArea
                            rows={4}
                            placeholder="Fyll inn beskrivelse av spørsmål eller mer informasjon til mottaker av skjema..."
                            className="input-question"
                            value={question.description}
                            onBlur={() =>
                                dispatch(updateQuestion(questionMeta))
                            }
                            onChange={(e) => {
                                e.currentTarget.value
                                    ? updateQuestionMeta(
                                          undefined,
                                          undefined,
                                          undefined,
                                          e.currentTarget.value,
                                      )
                                    : updateQuestionMeta(
                                          undefined,
                                          undefined,
                                          undefined,
                                          undefined,
                                      );
                            }}
                        />
                    </div>
                )}
                {answerBuilder[question.answerType]}
            </Col>
        </Row>
    );
}

export default AnswerComponent;
