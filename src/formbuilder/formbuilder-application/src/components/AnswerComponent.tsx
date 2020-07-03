import React, { useState, useContext } from 'react';
import { Row, Col, Select, Input, Checkbox, InputNumber, Button } from 'antd';
import './answerComponents/AnswerComponent.css';
import TextInput from './answerComponents/TextInput';
import RadioButton from './answerComponents/RadioButton';
import Decimal from './answerComponents/Decimal';
import DateTime from './answerComponents/DateTime';
import {
    AnswerTypes,
    INumber,
    IText,
    IChoice,
    IDateTime,
} from '../types/IAnswer';
import { FormContext, updateQuestion, updateAnswer } from '../store/FormStore';
import BooleanInput from './answerComponents/BooleanInput';
import IQuestion from '../types/IQuestion';
import { generateID } from '../helpers/IDGenerator';

const { TextArea } = Input;

const { Option } = Select;

type AnswerComponentProps = {
    questionId: string;
};

function AnswerComponent({ questionId }: AnswerComponentProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [question, setQuestion] = useState(state.questions[questionId]);
    const [answerMeta, setAnswerMeta] = useState(question.answer);

    function updateQuestionMeta(attribute: {
        answerType?: AnswerTypes;
        hasDescription?: boolean;
        isRequired?: boolean;
        description?: string;
    }) {
        const a = { ...question } as IQuestion;
        if (attribute.hasDescription !== undefined) {
            a.hasDescription = attribute.hasDescription;
        }
        if (attribute.isRequired !== undefined) {
            console.log('Check: ' + attribute.isRequired);
            a.isRequired = attribute.isRequired;
        }
        if (attribute.answerType) {
            a.answerType = attribute.answerType;
            if (attribute.answerType === AnswerTypes.radio) {
                a.answer = {
                    id: generateID(),
                    choices: [''],
                } as IChoice;
            } else if (attribute.answerType === AnswerTypes.text) {
                a.answer = {
                    id: generateID(),
                    maxLength: 100,
                } as IText;
            } else if (attribute.answerType === AnswerTypes.dateTime) {
                a.answer = {
                    id: generateID(),
                    isDate: true,
                    isTime: false,
                } as IDateTime;
            }
        }
        if (attribute.description) {
            a.description = attribute.description;
        } else {
            dispatch(updateQuestion(a));
        }
        setQuestion(a);
    }

    function updateNumbers(attribute: {
        minValue?: number;
        maxValue?: number;
        unit?: string;
        isDecimal?: boolean;
        hasUnit?: boolean;
        hasMax?: boolean;
        hasMin?: boolean;
    }) {
        const a = { ...answerMeta } as INumber;
        if (attribute.minValue !== undefined) {
            a.minValue = attribute.minValue;
        }
        if (attribute.maxValue !== undefined) {
            a.maxValue = attribute.maxValue;
        }
        if (attribute.isDecimal !== undefined) {
            a.isDecimal = attribute.isDecimal;
        }
        if (attribute.unit !== undefined) {
            a.unit = attribute.unit;
        }
        if (attribute.hasUnit !== undefined) {
            a.hasUnit = attribute.hasUnit;
        }
        if (attribute.hasMax !== undefined) {
            a.hasMax = attribute.hasMax;
        }
        if (attribute.hasMin !== undefined) {
            a.hasMin = attribute.hasMin;
        }
        setAnswerMeta(a);
    }

    function updateText(maxLength: number) {
        const a = { ...answerMeta } as IText;
        a.maxLength = maxLength;
        setAnswerMeta(a);
        dispatch(updateAnswer(question.id, a));
    }

    function updateDateTime(attribute: { isTime?: boolean; isDate?: boolean }) {
        const a = { ...answerMeta } as IDateTime;
        if (attribute.isTime !== undefined) {
            a.isTime = attribute.isTime;
        }
        if (attribute.isDate !== undefined) {
            a.isDate = attribute.isDate;
        }
        setAnswerMeta(a);
    }

    type answerList = { [key: string]: JSX.Element };

   /*  const propsController: answerList = {
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
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Checkbox
                            onChange={(e) =>
                                updateNumbers({ isDecimal: e.target.checked })
                            }
                            checked={(answerMeta as INumber).isDecimal}
                        ></Checkbox>
                    </Col>
                    <Col span={21} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>Tillat desimaltall</p>
                    </Col>
                </Row>
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Checkbox
                            onChange={(e) =>
                                e.target.checked
                                    ? updateNumbers({ hasUnit: true })
                                    : updateNumbers({ hasUnit: false })
                            }
                            checked={(answerMeta as INumber).hasUnit}
                        ></Checkbox>
                    </Col>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>Enhet:</p>
                    </Col>
                    <Col span={5} style={{ padding: '0 10px' }}>
                        <Input
                            value={(answerMeta as INumber).unit}
                            type="text"
                            disabled={!(answerMeta as INumber).hasUnit}
                            onBlur={() =>
                                dispatch(updateAnswer(question.id, answerMeta))
                            }
                            onChange={(e) =>
                                updateNumbers({ unit: e.target.value })
                            }
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={2} style={{ textAlign: 'right' }}>
                        <Checkbox
                            checked={(answerMeta as INumber).hasMin}
                            onChange={(e) =>
                                updateNumbers({ hasMin: e.target.checked })
                            }
                        ></Checkbox>
                    </Col>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>Min</p>
                    </Col>
                    <Col span={8} style={{ textAlign: 'left' }}>
                        <InputNumber
                            value={(answerMeta as INumber).minValue}
                            type="number"
                            disabled={!(answerMeta as INumber).hasMin}
                            onBlur={() =>
                                dispatch(updateAnswer(question.id, answerMeta))
                            }
                            onChange={(value) =>
                                updateNumbers({ minValue: value as number })
                            }
                        />
                    </Col>
                    <Col span={1}>
                        <Checkbox
                            checked={(answerMeta as INumber).hasMax}
                            onChange={(e) =>
                                updateNumbers({ hasMax: e.target.checked })
                            }
                        ></Checkbox>
                    </Col>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>Maks</p>
                    </Col>
                    <Col span={6} style={{ textAlign: 'left' }}>
                        <InputNumber
                            value={(answerMeta as INumber).maxValue}
                            type="number"
                            disabled={!(answerMeta as INumber).hasMax}
                            onBlur={() =>
                                dispatch(updateAnswer(question.id, answerMeta))
                            }
                            onChange={(value) =>
                                updateNumbers({ maxValue: value as number })
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
        [AnswerTypes.dateTime]: (
            <div>
                <Row>
                    <Col span={24} style={{ padding: '0 10px' }}>
                        <p>
                            Mottaker velger en dato, tid eller begge deler, helt
                            fritt. eller innenfor bestemte verdier når vi
                            implementerer det.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ padding: '0 10px' }}>
                        <Row>
                            <Col span={24} style={{ alignItems: 'center' }}>
                                <Button
                                    type={
                                        (answerMeta as IDateTime).isDate &&
                                        !(answerMeta as IDateTime).isTime
                                            ? 'primary'
                                            : undefined
                                    }
                                    onClick={() =>
                                        updateDateTime({
                                            isDate: true,
                                            isTime: false,
                                        })
                                    }
                                >
                                    Dato
                                </Button>
                                <Button
                                    type={
                                        !(answerMeta as IDateTime).isDate &&
                                        (answerMeta as IDateTime).isTime
                                            ? 'primary'
                                            : undefined
                                    }
                                    onClick={() =>
                                        updateDateTime({
                                            isDate: false,
                                            isTime: true,
                                        })
                                    }
                                >
                                    Tid
                                </Button>
                                <Button
                                    type={
                                        (answerMeta as IDateTime).isDate &&
                                        (answerMeta as IDateTime).isTime
                                            ? 'primary'
                                            : undefined
                                    }
                                    onClick={() =>
                                        updateDateTime({
                                            isDate: true,
                                            isTime: true,
                                        })
                                    }
                                >
                                    Dato og Tid
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        ),
    }; */

    const answerBuilder: answerList = {
        [AnswerTypes.choice]: (
            <Choice questionId={questionId}></Choice>
        ),
        [AnswerTypes.boolean]: <BooleanInput questionId={questionId}></BooleanInput>,
        [AnswerTypes.number]: <Number questionId={questionId}></Number>,
        [AnswerTypes.text]: (
            <Text
            questionId={questionId}
            ></Text>
        ),
        [AnswerTypes.time]: (
            <Time
                questionId={questionId}
            ></Time>
        ),
    };

    return (
        <Row>
            <Col span={7} className="controller">
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Checkbox
                            checked={question.hasDescription}
                            onChange={(e) =>
                                updateQuestionMeta({
                                    hasDescription: e.target.checked,
                                })
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
                            checked={question.isRequired}
                            onChange={(e) =>
                                updateQuestionMeta({
                                    isRequired: e.target.checked,
                                })
                            }
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
                            value={question.answerType}
                            style={{ width: '200px' }}
                            onSelect={(value) => {
                                updateQuestionMeta({ answerType: value });
                            }}
                            placeholder="Velg svartype"
                        >
                            <Option value={AnswerTypes.boolean}>Ja/nei</Option>
                            <Option value={AnswerTypes.decimal}>Tall</Option>
                            <Option value={AnswerTypes.text}>Tekst</Option>
                            <Option value={AnswerTypes.dateTime}>
                                Dato/tid
                            </Option>
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
                            onBlur={() => dispatch(updateQuestion(question))}
                            onChange={(e) => {
                                e.currentTarget.value
                                    ? updateQuestionMeta({
                                          description: e.currentTarget.value,
                                      })
                                    : updateQuestionMeta({
                                          description: undefined,
                                      });
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
