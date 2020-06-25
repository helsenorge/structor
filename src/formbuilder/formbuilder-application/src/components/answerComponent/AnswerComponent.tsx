import React, { useState } from 'react';
import { Button, Row, Col, Select, Input, Switch } from 'antd';
import './AnswerComponent.css';
import TextInputLong from './TextInputLong';
import TextInput from './TextInput';
import RadioButton from './RadioButton';
import Decimal from './Decimal';

const { TextArea } = Input;

function AnswerComponent(): JSX.Element {
    const [answerType, setAnswerType] = useState('Velg type spørsmål');
    const [answerBuilder, setAnswerBuilder] = useState(<div></div>);
    const { Option } = Select;
    const [desc, setDescState] = useState(false);
    const [obligatory, setObligatory] = useState(true);

    function answerPicker(value: string) {
        if (value === 'boolean') {
            setAnswerType('boolean');
            //TODO: Implement Boolean answerComponent, using RadioButtons for testing
            setAnswerBuilder(<RadioButton></RadioButton>);
        } else if (value === 'decimal') {
            setAnswerType('decimal');
            setAnswerBuilder(<Decimal></Decimal>);
        } else if (value === 'text') {
            setAnswerType('text');
            setAnswerBuilder(<TextInput></TextInput>);
        } else if (value === 'textArea') {
            setAnswerType('textArea');
            setAnswerBuilder(<TextInputLong></TextInputLong>);
        } else if (value === 'radio') {
            setAnswerType('radio');
            setAnswerBuilder(<RadioButton></RadioButton>);
        }
    }
    return (
        <Row>
            <Col span={8} className="controller">
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <div style={{ float: 'left' }}>
                            <Switch onChange={setDescState} />
                        </div>
                    </Col>
                    <Col span={21} style={{ padding: '0 10px' }}>
                        <div style={{ float: 'left' }}>
                            <p>Forklaring av spørsmål til mottaker</p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={3} style={{ padding: '0 10px' }}>
                        <div style={{ float: 'left' }}>
                            <Switch defaultChecked onChange={setObligatory} />
                        </div>
                    </Col>
                    <Col span={21} style={{ padding: '0 10px' }}>
                        <div style={{ float: 'left' }}>
                            <p>
                                Spørsmålet skal være obligatorisk å svare på for
                                mottaker
                            </p>
                        </div>
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
                                    setAnswerBuilder(<TextInput></TextInput>);
                                }}
                                {...(answerType === 'text'
                                    ? { type: 'primary' }
                                    : {})}
                            >
                                Tekst
                            </Option>
                            <Option
                                value="textArea"
                                onSelect={() => {
                                    setAnswerType('textArea');
                                    setAnswerBuilder(
                                        <TextInputLong></TextInputLong>,
                                    );
                                }}
                                {...(answerType === 'textArea'
                                    ? { type: 'primary' }
                                    : {})}
                            >
                                Lang tekst
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
                        />
                    </div>
                )}
                {answerBuilder}
            </Col>
        </Row>
    );
}

export default AnswerComponent;
