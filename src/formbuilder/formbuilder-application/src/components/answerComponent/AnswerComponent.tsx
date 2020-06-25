import React, { useState } from 'react';
import { Button, Row, Col, Select } from 'antd';
import './AnswerComponent.css';
import TextInputLong from './TextInputLong';
import TextInput from './TextInput';
import RadioButton from './RadioButton';
import Decimal from './Decimal';

function AnswerComponent(): JSX.Element {
    const [answerType, setAnswerType] = useState('');
    const [answerBuilder, setAnswerBuilder] = useState(<div></div>);
    const { Option } = Select;

    function answerPicker() {
        return (
            <div style={{ display: 'inline', marginBottom: '100px' }}>
                <Button
                    className="answerPickerButton"
                    {...(answerType === 'boolean' ? { type: 'primary' } : {})}
                    onClick={() => {
                        setAnswerType('boolean');
                        //TODO: Implement Boolean answerComponent, using RadioButtons for testing
                        setAnswerBuilder(<RadioButton></RadioButton>);
                    }}
                >
                    Ja/nei
                </Button>
                <Button
                    {...(answerType === 'decimal' ? { type: 'primary' } : {})}
                    onClick={() => {
                        setAnswerType('decimal');
                        setAnswerBuilder(<Decimal></Decimal>);
                    }}
                >
                    Tall
                </Button>
                <Button
                    onClick={() => {
                        setAnswerType('text');
                        setAnswerBuilder(<TextInput></TextInput>);
                    }}
                    {...(answerType === 'text' ? { type: 'primary' } : {})}
                >
                    Tekst
                </Button>
                <Button
                    onClick={() => {
                        setAnswerType('textArea');
                        setAnswerBuilder(<TextInputLong></TextInputLong>);
                    }}
                    {...(answerType === 'textArea' ? { type: 'primary' } : {})}
                >
                    Lang tekst
                </Button>

                <Button
                    onClick={() => {
                        setAnswerType('radio');
                        setAnswerBuilder(<RadioButton></RadioButton>);
                    }}
                    {...(answerType === 'radio' ? { type: 'primary' } : {})}
                >
                    Radio button
                </Button>

                <Select defaultValue="ValueSet1" style={{ width: '120px' }}>
                    <Option value="ValueSet1"> Value sett 1</Option>
                    <Option value="ValueSet2"> Value sett 2</Option>
                    <Option value="NyttSet"> Lag nytt set</Option>
                </Select>
            </div>
        );
    }
    return (
        <div
            style={{
                width: '100%',
                display: 'inline-block',
                marginBottom: '20px',
            }}
        >
            <Row>
                <Col span={22}>{answerPicker()}</Col>
            </Row>
            <Row>
                <Col span={22}>{answerBuilder}</Col>
            </Row>
        </div>
    );
};

export default AnswerComponent;
