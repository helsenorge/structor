import React, { useState, useContext } from 'react';
import { Row, Col, Select, Input, Checkbox, InputNumber } from 'antd';
import './answerComponents/AnswerComponent.css';
import TextInput from './answerComponents/TextInput';
import RadioButton from './answerComponents/RadioButton';
import Decimal from './answerComponents/Decimal';
import { AnswerTypes } from '../types/IAnswer';
import { FormContext } from '../store/FormStore';

const { TextArea } = Input;

type AnswerComponentProps = {
    questionId: string;
};

function AnswerComponent({ questionId }: AnswerComponentProps): JSX.Element {
    const [answerType, setAnswerType] = useState(AnswerTypes.bool);
    const [answerBuilder, setAnswerBuilder] = useState(<div></div>);
    const { Option } = Select;
    const { state, dispatch } = useContext(FormContext);
    const answer = state.questions[questionId].answer;

    // TODO: send all of the below to context
    // General form restrictions
    const [ifDesc, setDescState] = useState(false);
    const [obligatory, setObligatory] = useState(true);

    // Radio button restrictions
    const [defaultChoice, setDefaultChoice] = useState(-1);
    const [ifDefault, setIfDefault] = useState(false);

    // Text restrictions
    const [ifLongText, setIfLongText] = useState(false);
    const [maxLengthText, setMaxLengthText] = useState(100);

    // Decimal restrictions
    const [max, setMax] = useState(false);
    const [min, setMin] = useState(false);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);

    // Answer and controller components to be rendered
    const [propsController, setPropController] = useState(<div></div>);

    function answerPicker(value: AnswerTypes) {
        if (value === AnswerTypes.choice) {
            setAnswerType(AnswerTypes.choice);
            //TODO: Implement Boolean answerComponent, using RadioButtons for testing
            setAnswerBuilder(<div></div>);
        } else if (value === AnswerTypes.decimal) {
            setAnswerType(AnswerTypes.decimal);
            setAnswerBuilder(<Decimal max={maxValue} min={minValue}></Decimal>);
            setPropController(
                <div>
                    <Row>
                        <Col span={24} style={{ padding: '0 10px' }}>
                            <p>
                                Mottaker fyller ut en tallverdi, enten fritt
                                eller innenfor bestemte verdier.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Checkbox
                                onChange={(e) => setMin(e.target.checked)}
                            >
                                Min
                            </Checkbox>
                        </Col>
                        <Col span={14}>
                            <InputNumber
                                type="number"
                                defaultValue={0}
                                disabled={!min}
                                onChange={(value) =>
                                    value
                                        ? setMinValue(value as number)
                                        : setMinValue(0)
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Checkbox
                                onChange={(e) => setMax(e.target.checked)}
                            >
                                Max
                            </Checkbox>
                        </Col>
                        <Col span={14}>
                            <InputNumber
                                type="number"
                                defaultValue={100}
                                disabled={!max}
                                onChange={(value) =>
                                    value
                                        ? setMaxValue(value as number)
                                        : setMaxValue(0)
                                }
                            />
                        </Col>
                    </Row>
                </div>,
            );
        } else if (value === AnswerTypes.text) {
            setAnswerType(AnswerTypes.text);
            setAnswerBuilder(
                <TextInput
                    maxLength={maxLengthText}
                    longAnswer={ifLongText}
                    placeholder="Mottaker skriver svar her"
                ></TextInput>,
            );
            setPropController(
                <div>
                    <Row>
                        <Col span={24} style={{ padding: '0 10px' }}>
                            <p>
                                Mottaker fyller ut et skriftlig svar i en
                                tekstboks, enten i form av et kortsvar eller et
                                langsvar begrenset av et satt antall karakterer.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} style={{ padding: '0 10px' }}>
                            <Checkbox
                                onChange={(e) =>
                                    changeToLongText(e.target.checked)
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
                                defaultValue={maxLengthText}
                                disabled={!ifLongText}
                                onChange={(value) =>
                                    setMaxLengthText(value as number)
                                }
                            />
                        </Col>
                    </Row>
                </div>,
            );
        } else if (value === AnswerTypes.bool) {
            setAnswerType(AnswerTypes.bool);
            setPropController(
                <div>
                    <Row>
                        <Col span={24} style={{ padding: '0 10px' }}>
                            <p>
                                Mottaker har flere svaralternativer, men kan
                                bare velge ett alternativ.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} style={{ padding: '0 10px' }}>
                            <Checkbox
                                onChange={(e) => setIfDefault(e.target.checked)}
                            />
                        </Col>
                        <Col span={10} style={{ padding: '0 10px' }}>
                            <p style={{ textAlign: 'left' }}>
                                Sett standardalternativ:
                            </p>
                        </Col>
                        <Col span={5} style={{ padding: '0 10px' }}>
                            <InputNumber
                                min={1}
                                max={20}
                                size="small"
                                defaultValue={1}
                                disabled={!ifDefault}
                                onChange={(value) =>
                                    setDefaultChoice(value as number)
                                }
                            />
                        </Col>
                    </Row>
                </div>,
            );
            setAnswerBuilder(
                <RadioButton
                    key={'radio' + answer.id}
                    questionId={questionId}
                ></RadioButton>,
            );
        }
    }
    function changeToLongText(value: boolean) {
        console.log(maxLengthText);

        setIfLongText(value);
        if (!value) {
            setAnswerBuilder(
                <TextInput
                    maxLength={100}
                    longAnswer={value}
                    placeholder="Mottaker skriver svar her"
                ></TextInput>,
            );
            return;
        }
        setAnswerBuilder(
            <TextInput
                maxLength={maxLengthText}
                longAnswer={value}
                placeholder="Mottaker skriver svar her"
            ></TextInput>,
        );
    }

    return (
        <Row>
            <Col span={7} className="controller">
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Checkbox
                            onChange={(e) => setDescState(e.target.checked)}
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
                            defaultChecked
                            onChange={(e) => setObligatory(e.target.checked)}
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
                            value={answerType}
                            style={{ width: '200px' }}
                            onSelect={(value) => answerPicker(value)}
                        >
                            <Option
                                value={AnswerTypes.bool}
                                onSelect={() => {
                                    answerPicker(AnswerTypes.bool);
                                }}
                            >
                                Ja/nei
                            </Option>
                            <Option
                                value={AnswerTypes.decimal}
                                onSelect={() => {
                                    answerPicker(AnswerTypes.decimal);
                                }}
                            >
                                Tall
                            </Option>
                            <Option
                                value={AnswerTypes.text}
                                onSelect={() => {
                                    answerPicker(AnswerTypes.text);
                                }}
                            >
                                Tekst
                            </Option>
                            <Option
                                value={AnswerTypes.choice}
                                onSelect={() => {
                                    answerPicker(AnswerTypes.choice);
                                }}
                            >
                                Flervalg
                            </Option>
                        </Select>
                    </Col>
                </Row>
                {propsController}
            </Col>

            <Col span={10} style={{ padding: '10px' }}>
                {ifDesc && (
                    <div style={{ paddingBottom: '10px' }}>
                        <TextArea
                            rows={4}
                            placeholder="Fyll inn beskrivelse av spørsmål eller mer informasjon til mottaker av skjema..."
                            className="input-question"
                        />
                    </div>
                )}
                {answerBuilder}
            </Col>
        </Row>
    );
}

export default AnswerComponent;
