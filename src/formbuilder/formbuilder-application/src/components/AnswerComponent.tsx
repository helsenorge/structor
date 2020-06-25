import React, { useState } from 'react';
import { Row, Col, Select, Input, Switch } from 'antd';
import './answerComponents/AnswerComponent.css';
import TextInput from './answerComponents/TextInput';
import RadioButton from './answerComponents/RadioButton';
import Decimal from './answerComponents/Decimal';

const { TextArea } = Input;

function AnswerComponent(): JSX.Element {
    const [answerType, setAnswerType] = useState('Velg type spørsmål');
    const [answerBuilder, setAnswerBuilder] = useState(<div></div>);
    const { Option } = Select;
    const [desc, setDescState] = useState(false);
    const [obligatory, setObligatory] = useState(true);

    function answerPicker(value: string) {
        console.log(obligatory); // to not get warnings when deploying
        if (value === 'boolean') {
            setAnswerType('boolean');
            //TODO: Implement Boolean answerComponent, using RadioButtons for testing
            setAnswerBuilder(<RadioButton></RadioButton>);
        } else if (value === 'decimal') {
            setAnswerType('decimal');
            setAnswerBuilder(<Decimal></Decimal>);
        } else if (value === 'text') {
            setAnswerType('text');
            setAnswerBuilder(
                <TextInput
                    maxLength={100}
                    longAnswer={true}
                    placeholder="Mottaker skriver svar her"
                ></TextInput>,
            );
        } else if (value === 'radio') {
            setAnswerType('radio');
            setAnswerBuilder(<RadioButton></RadioButton>);
        }
    }
    return (
        <Row>
            <Col span={7} className="controller">
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Switch onChange={setDescState} />
                    </Col>
                    <Col span={21} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>
                            Forklaring av spørsmål til mottaker
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <Switch defaultChecked onChange={setObligatory} />
                    </Col>
                    <Col span={21} style={{ padding: '0 10px' }}>
                        <p style={{ textAlign: 'left' }}>
                            Spørsmålet skal være obligatorisk
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ alignItems: 'center' }}>
                        <Select
                            value={answerType}
                            style={{ width: '200px' }}
                            onSelect={(value) => answerPicker(value)}
                        >
                            <Option
                                value="boolean"
                                onSelect={() => {
                                    setAnswerType('boolean');
                                    //TODO: Implement Boolean answerComponent, using RadioButtons for testing
                                    setAnswerBuilder(
                                        <RadioButton></RadioButton>,
                                    );
                                }}
                            >
                                Ja/nei spørsmål
                            </Option>
                            <Option
                                value="decimal"
                                onSelect={() => {
                                    setAnswerType('decimal');
                                    setAnswerBuilder(<Decimal></Decimal>);
                                }}
                            >
                                Tall
                            </Option>
                            <Option
                                value="text"
                                onSelect={() => {
                                    setAnswerType('text');
                                    setAnswerBuilder(
                                        <TextInput
                                            maxLength={100}
                                            longAnswer={true}
                                            placeholder="Mottaker skriver svar her"
                                        ></TextInput>,
                                    );
                                }}
                                {...(answerType === 'text'
                                    ? { type: 'primary' }
                                    : {})}
                            >
                                Tekst
                            </Option>
                            <Option
                                value="radio"
                                onSelect={() => {
                                    setAnswerType('radio');
                                    setAnswerBuilder(
                                        <RadioButton></RadioButton>,
                                    );
                                }}
                                {...(answerType === 'radio'
                                    ? { type: 'primary' }
                                    : {})}
                            >
                                Radio button
                            </Option>
                        </Select>
                    </Col>
                </Row>
            </Col>

            <Col span={10} style={{ padding: '10px' }}>
                {desc && (
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
