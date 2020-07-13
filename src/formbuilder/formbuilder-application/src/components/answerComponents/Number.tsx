import React, { useContext, useState, useEffect } from 'react';
import { Checkbox, Input, Row, Col, Form } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { INumber } from '../../types/IAnswer';
import './AnswerComponent.css';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import { tmpdir } from 'os';

type NumberProps = {
    questionId: string;
};

function Number({ questionId }: NumberProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...state.questions[questionId].answer } as INumber;
    const [validationList, setValidationList] = useState([true, true, true, true]);

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
        if (attribute.hasDefault !== undefined) temp.hasDefault = attribute.hasDefault;
        if (attribute.isDecimal !== undefined) temp.isDecimal = attribute.isDecimal;
        if (attribute.maxValue !== undefined) temp.maxValue = attribute.maxValue;
        if (attribute.unit !== undefined) temp.unit = attribute.unit;
        if (attribute.minValue !== undefined) temp.minValue = attribute.minValue;
        if (attribute.defaultValue !== undefined) temp.defaultValue = attribute.defaultValue;
        dispatch(updateAnswer(questionId, temp));
    }

    function validate(field: number, validity: ValidateStatus): ValidateStatus {
        const tempValid = [...validationList];
        const temp = { ...state.questions[questionId].answer };
        if (validity === 'error' && validationList[field] !== false) {
            tempValid[field] = false;
            setValidationList(tempValid);
            temp.valid = false;
            // dispatch(updateAnswer(questionId, temp));
        } else if (validity === 'success' && validationList[field] !== true) {
            tempValid[field] = true;
            setValidationList(tempValid);
            temp.valid = true;
            // dispatch(updateAnswer(questionId, temp));
        }
        return validity;
    }

    useEffect(() => {
        const temp = { ...state.questions[questionId].answer };
        temp.valid = validationList.every((field) => field === true);
        dispatch(updateAnswer(questionId, temp));
    }, [validationList]);

    return (
        <>
            <Form>
                <Row>
                    <Col span={10} className="standard">
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
                    <Col span={10} className="standard">
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
                        <Form.Item
                            validateStatus={
                                localAnswer.hasDefault === false ||
                                (localAnswer.hasDefault === true &&
                                    localAnswer.defaultValue !== undefined &&
                                    String(localAnswer.defaultValue).length > 0)
                                    ? (validate(0, 'success') as ValidateStatus)
                                    : (validate(0, 'error') as ValidateStatus)
                            }
                            help={
                                localAnswer.hasDefault === false ||
                                (localAnswer.hasDefault === true &&
                                    localAnswer.defaultValue !== undefined &&
                                    String(localAnswer.defaultValue).length > 0)
                                    ? undefined
                                    : 'Fyll inn forhåndsvalgt verdi'
                            }
                        >
                            <Input
                                type="number"
                                defaultValue={localAnswer.defaultValue}
                                onBlur={(e) => {
                                    updateStore({
                                        defaultValue: (e.currentTarget.value as unknown) as number,
                                    });
                                }}
                                disabled={!localAnswer.hasDefault}
                            ></Input>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={10} className="standard">
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
                    <Col span={10} className="standard">
                        <Form.Item
                            validateStatus={
                                localAnswer.hasMin === false ||
                                (localAnswer.hasMin === true &&
                                    localAnswer.minValue !== undefined &&
                                    String(localAnswer.minValue).length > 0)
                                    ? (validate(1, 'success') as ValidateStatus)
                                    : (validate(1, 'error') as ValidateStatus)
                            }
                            help={
                                localAnswer.hasMin === false ||
                                (localAnswer.hasMin === true &&
                                    localAnswer.minValue !== undefined &&
                                    String(localAnswer.minValue).length > 0)
                                    ? undefined
                                    : 'Fyll inn min verdi'
                            }
                        >
                            <Input
                                type="number"
                                defaultValue={localAnswer.minValue}
                                onBlur={(e) =>
                                    updateStore({
                                        minValue: (e.target.value as unknown) as number,
                                    })
                                }
                                disabled={!localAnswer.hasMin}
                            ></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10} className="standard">
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
                    <Col span={10} className="standard">
                        <Form.Item
                            validateStatus={
                                localAnswer.hasMax === false ||
                                (localAnswer.hasMax === true &&
                                    localAnswer.maxValue !== undefined &&
                                    String(localAnswer.maxValue).length > 0)
                                    ? (validate(2, 'success') as ValidateStatus)
                                    : (validate(2, 'error') as ValidateStatus)
                            }
                            help={
                                localAnswer.hasMax === false ||
                                (localAnswer.hasMax === true &&
                                    localAnswer.maxValue !== undefined &&
                                    String(localAnswer.maxValue).length > 0)
                                    ? undefined
                                    : 'Fyll inn max verdi'
                            }
                        >
                            <Input
                                type="number"
                                defaultValue={localAnswer.maxValue}
                                onBlur={(e) =>
                                    updateStore({
                                        maxValue: (e.target.value as unknown) as number,
                                    })
                                }
                                disabled={!localAnswer.hasMax}
                            ></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10} className="standard">
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
                    <Col span={10} className="standard">
                        <Form.Item
                            validateStatus={
                                localAnswer.hasUnit === false ||
                                (localAnswer.hasUnit === true &&
                                    localAnswer.unit !== undefined &&
                                    String(localAnswer.unit).length > 0)
                                    ? (validate(3, 'success') as ValidateStatus)
                                    : (validate(3, 'error') as ValidateStatus)
                            }
                            help={
                                localAnswer.hasUnit === false ||
                                (localAnswer.hasUnit === true &&
                                    localAnswer.unit !== undefined &&
                                    String(localAnswer.unit).length > 0)
                                    ? undefined
                                    : 'Fyll inn enhet'
                            }
                        >
                            <Input
                                type="text"
                                style={{ width: '90px' }}
                                defaultValue={localAnswer.unit}
                                onBlur={(e) =>
                                    updateStore({
                                        unit: e.target.value,
                                    })
                                }
                                disabled={!localAnswer.hasUnit}
                            ></Input>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Number;
