import React, { useState, ReactElement } from 'react';
import { Button, Row, Col, Radio, Select } from 'antd';
import './AnswerComponent.css';

const AnswerComponent: React.FC = (): ReactElement => {
    const [answerType, setAnswerType] = useState('');

    const { Option } = Select;
    function answerPicker() {
        console.log(answerType);
        return (
            <div style={{ display: 'inline', marginBottom: '100px' }}>
                <Button
                    className="answerPickerButton"
                    {...(answerType === 'boolean' ? { type: 'primary' } : {})}
                    onClick={() => setAnswerType('boolean')}
                >
                    Ja/nei
                </Button>
                <Button
                    onClick={() => setAnswerType('decimal')}
                    {...(answerType === 'decimal' ? { type: 'primary' } : {})}
                >
                    Tall
                </Button>
                <Button
                    onClick={() => setAnswerType('text')}
                    {...(answerType === 'text' ? { type: 'primary' } : {})}
                >
                    Tekst
                </Button>
                <Button
                    onClick={() => setAnswerType('textArea')}
                    {...(answerType === 'textArea' ? { type: 'primary' } : {})}
                >
                    Lang tekst
                </Button>

                <Select
                    dropdownStyle={{ }}
                    defaultValue="ValueSet1"
                    style={{ width: '120px' }}
                >
                    <Option value="ValueSet1"> Value sett 1</Option>
                    <Option value="ValueSet2"> Value sett 2</Option>
                    <Option value="NyttSet"> Lag nytt set</Option>
                </Select>
            </div>
        );
    }

    switch (answerType) {
        case '':
            return <div>{answerPicker()}</div>;

        case 'boolean':
            return (
                <div
                    style={{
                        width: '100%',
                        display: 'inline-block',
                        marginBottom: '20px',
                    }}
                >
                    {answerPicker()}
                    <Row>
                        <Col span={23}>
                            <div style={{ width: '100%', display: 'inline' }}>
                                <Radio.Group>
                                    <Radio value={1}>Ja</Radio>
                                    <Radio value={0}>Nei</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col span={1}>
                            <div>
                                <Button onClick={() => setAnswerType('')}>
                                    X
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            );

        case 'text':
            return (
                <div
                    style={{
                        width: '100%',
                        display: 'inline-block',
                        marginBottom: '20px',
                    }}
                >
                    {answerPicker()}
                    <Row>
                        <Col span={23}>
                            <div style={{ width: '100%', display: 'inline' }}>
                                <Radio.Group>
                                    <Radio value={1}>Ja</Radio>
                                    <Radio value={0}>Nei</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col span={1}>
                            <div>
                                <Button onClick={() => setAnswerType('')}>
                                    X
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            );

        case 'textArea':
            return (
                <div
                    style={{
                        width: '100%',
                        display: 'inline-block',
                        marginBottom: '20px',
                    }}
                >
                    {answerPicker()}
                    <Row>
                        <Col span={23}>
                            <div style={{ width: '100%', display: 'inline' }}>
                                <Radio.Group>
                                    <Radio value={1}>Ja</Radio>
                                    <Radio value={0}>Nei</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col span={1}>
                            <div>
                                <Button onClick={() => setAnswerType('')}>
                                    X
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        default:
            return (
                <div
                    style={{
                        width: '100%',
                        display: 'inline-block',
                        marginBottom: '20px',
                    }}
                >
                    {answerPicker()}
                    <Row>
                        <Col span={23}>
                            <div style={{ width: '100%', display: 'inline' }}>
                                <h1>{answerType}</h1>
                            </div>
                        </Col>
                        <Col span={1}>
                            <div>
                                <Button onClick={() => setAnswerType('')}>
                                    X
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
    }
};

export default AnswerComponent;
