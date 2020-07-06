import React, { useContext, useState } from 'react';
import { InputNumber, Checkbox, Input, Row, Col } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { INumber } from '../../types/IAnswer';
import './AnswerComponent.css';

type NumberProps = {
    questionId: string;
};

function Number({ questionId }: NumberProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(
        state.questions[questionId].answer as INumber,
    );

    function localUpdate(attribute: {
        hasMax?: boolean;
        hasMin?: boolean;
        hasUnit?: boolean;
        hasDefault?: boolean;
        isDecimal?: boolean;
        maxValue?: number;
        minValue?: number;
        defaultValue?: number;
        unit?: string;
        updateStore?: boolean;
    }) {
        const temp = { ...localAnswer };
        if (attribute.hasMax !== undefined) temp.hasMax = attribute.hasMax;
        if (attribute.hasMin !== undefined) temp.hasMin = attribute.hasMin;
        if (attribute.hasUnit !== undefined) temp.hasUnit = attribute.hasUnit;
        if (attribute.hasDefault !== undefined)
            temp.hasDefault = attribute.hasDefault;
        if (attribute.isDecimal !== undefined)
            temp.isDecimal = attribute.isDecimal;
        if (attribute.maxValue !== undefined)
            temp.maxValue = attribute.maxValue;
        if (attribute.unit !== undefined) temp.unit = attribute.unit;
        if (attribute.minValue !== undefined)
            temp.minValue = attribute.minValue;
        if (attribute.defaultValue !== undefined)
            temp.defaultValue = attribute.defaultValue;
        setLocalAnswer(temp);
        if (attribute.updateStore !== undefined)
            dispatch(updateAnswer(questionId, temp));
    }

    return (
        <>
            <Row>
                <Col span={12} className="standard">
                    <Row>
                        <Col span={12} className="standard">
                            <Checkbox
                                checked={localAnswer.isDecimal}
                                onChange={(e) =>
                                    localUpdate({
                                        isDecimal: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Desimaltall
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="standard">
                            <Checkbox
                                checked={localAnswer.hasDefault}
                                onChange={(e) =>
                                    localUpdate({
                                        hasDefault: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Forhåndsvalgt verdi
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <InputNumber
                                value={localAnswer.defaultValue}
                                onChange={(value) =>
                                    localUpdate({
                                        updateStore: false,
                                        defaultValue: value as number,
                                    })
                                }
                                onBlur={() =>
                                    localUpdate({ updateStore: true })
                                }
                                disabled={!localAnswer.hasDefault}
                            ></InputNumber>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12} className="standard">
                            <Checkbox
                                checked={localAnswer.hasMin}
                                onChange={(e) =>
                                    localUpdate({
                                        hasMin: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Min
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <InputNumber
                                value={localAnswer.minValue}
                                onChange={(value) =>
                                    localUpdate({
                                        updateStore: false,
                                        minValue: value as number,
                                    })
                                }
                                onBlur={() =>
                                    localUpdate({ updateStore: true })
                                }
                                disabled={!localAnswer.hasMin}
                            ></InputNumber>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="standard">
                            <Checkbox
                                checked={localAnswer.hasMax}
                                onChange={(e) =>
                                    localUpdate({
                                        hasMax: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Max
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <InputNumber
                                value={localAnswer.maxValue}
                                onChange={(value) =>
                                    localUpdate({
                                        updateStore: false,
                                        maxValue: value as number,
                                    })
                                }
                                onBlur={() =>
                                    localUpdate({ updateStore: true })
                                }
                                disabled={!localAnswer.hasMax}
                            ></InputNumber>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="standard">
                            <Checkbox
                                checked={localAnswer.hasUnit}
                                onChange={(e) =>
                                    localUpdate({
                                        hasUnit: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Enhet
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <Input
                                style={{ width: '90px' }}
                                value={localAnswer.unit}
                                onChange={(e) =>
                                    localUpdate({
                                        updateStore: false,
                                        unit: e.target.value as string,
                                    })
                                }
                                onBlur={() =>
                                    localUpdate({ updateStore: true })
                                }
                                disabled={!localAnswer.hasUnit}
                            ></Input>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default Number;
