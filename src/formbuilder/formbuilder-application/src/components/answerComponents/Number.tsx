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
    // const [localAnswer, setLocalAnswer] = useState(
    //     state.questions[questionId].answer as INumber,
    // );
    const localAnswer = { ...state.questions[questionId].answer } as INumber;

    function updateStore(attribute: {
        hasMax?: boolean;
        hasMin?: boolean;
        hasUnit?: boolean;
        hasDefault?: boolean;
        isDecimal?: boolean;
        maxValue?: number;
        minValue?: number;
        defaultValue?: number;
        unit?: string;
    }) {
        const temp = { ...localAnswer } as INumber;
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
                                    updateStore({
                                        isDecimal: e.target.checked,
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
                                    updateStore({
                                        hasDefault: e.target.checked,
                                    })
                                }
                            >
                                Forhåndsvalgt verdi
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <InputNumber
                                type="number"
                                value={localAnswer.defaultValue}
                                // onChange={(value) =>
                                //     localUpdate({
                                //         updateStore: false,
                                //         defaultValue: value as number,
                                //     })
                                // }
                                onBlur={(e) =>
                                    updateStore({
                                        defaultValue: (e.target
                                            .value as unknown) as number,
                                    })
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
                                    updateStore({
                                        hasMin: e.target.checked,
                                    })
                                }
                            >
                                Min
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <InputNumber
                                type="number"
                                value={localAnswer.minValue}
                                // onChange={(value) =>
                                //     localUpdate({
                                //         updateStore: false,
                                //         minValue: value as number,
                                //     })
                                // }
                                onBlur={(e) =>
                                    updateStore({
                                        minValue: (e.target
                                            .value as unknown) as number,
                                    })
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
                                    updateStore({
                                        hasMax: e.target.checked,
                                    })
                                }
                            >
                                Max
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <InputNumber
                                type="number"
                                value={localAnswer.maxValue}
                                // onChange={(value) =>
                                //     localUpdate({
                                //         updateStore: false,
                                //         maxValue: value as number,
                                //     })
                                // }
                                onBlur={(e) =>
                                    updateStore({
                                        maxValue: (e.target
                                            .value as unknown) as number,
                                    })
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
                                    updateStore({
                                        hasUnit: e.target.checked,
                                    })
                                }
                            >
                                Enhet
                            </Checkbox>
                        </Col>
                        <Col span={12} className="standard">
                            <Input
                                type="text"
                                style={{ width: '90px' }}
                                value={localAnswer.unit}
                                // onChange={(e) =>
                                //     localUpdate({
                                //         updateStore: false,
                                //         unit: e.target.value as string,
                                //     })
                                // }
                                onBlur={(e) =>
                                    updateStore({
                                        unit: e.target.value,
                                    })
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
