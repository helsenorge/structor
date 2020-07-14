import React, { useContext, useState, useEffect } from 'react';
import { Checkbox, Input, Row, Col } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { INumber } from '../../types/IAnswer';
import './AnswerComponent.css';
import {
    validateNumber,
    validateText,
    checkErrorFields,
    setCheckedField,
    setValidateNumber,
    setVisitedField,
    setValidateText,
    IValidation,
} from '../../helpers/ValidationHelpers';

type NumberProps = {
    questionId: string;
};

function Number({ questionId }: NumberProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...state.questions[questionId].answer } as INumber;
    const [errorList, setErrorList] = useState([false, false, false, false]);
    const [validationObject, setValidationObject] = useState({
        checkedList: [localAnswer.hasDefault, localAnswer.hasUnit, localAnswer.hasMin, localAnswer.hasMax],
        visitedFields: [
            localAnswer.defaultValue !== undefined,
            localAnswer.unit !== undefined,
            localAnswer.minValue !== undefined,
            localAnswer.maxValue !== undefined,
        ],
        validationList: [
            validateNumber(localAnswer.defaultValue),
            validateText(localAnswer.unit),
            validateNumber(localAnswer.minValue),
            validateNumber(localAnswer.maxValue),
        ],
    } as IValidation);
    const inputStyle = {
        width: '100px',
        paddingTop: '8px',
    };

    function updateStore(attribute: {
        hasMax?: boolean;
        hasMin?: boolean;
        hasUnit?: boolean;
        hasDefault?: boolean;
        isDecimal?: boolean;
        maxValue?: string;
        minValue?: string;
        defaultValue?: string;
        unit?: string;
    }) {
        const temp = { ...localAnswer } as INumber;
        if (attribute.hasMax !== undefined) temp.hasMax = attribute.hasMax;
        if (attribute.hasMin !== undefined) temp.hasMin = attribute.hasMin;
        if (attribute.hasUnit !== undefined) temp.hasUnit = attribute.hasUnit;
        if (attribute.hasDefault !== undefined) temp.hasDefault = attribute.hasDefault;
        if (attribute.isDecimal !== undefined) temp.isDecimal = attribute.isDecimal;
        if (attribute.maxValue !== undefined)
            temp.maxValue = attribute.maxValue.length > 0 ? parseInt(attribute.maxValue) : undefined;
        if (attribute.unit !== undefined) temp.unit = attribute.unit;
        if (attribute.minValue !== undefined)
            temp.minValue = attribute.minValue.length > 0 ? parseInt(attribute.minValue) : undefined;
        if (attribute.defaultValue !== undefined)
            temp.defaultValue = attribute.defaultValue.length > 0 ? parseInt(attribute.defaultValue) : undefined;
        dispatch(updateAnswer(questionId, temp));
    }

    useEffect(() => {
        const tempAnswer = { ...state.questions[questionId].answer };
        checkErrorFields(state.validationFlag, validationObject, errorList, setErrorList);
        tempAnswer.valid = !validationObject.validationList.includes(false);
        dispatch(updateAnswer(questionId, tempAnswer));
    }, [validationObject, state.validationFlag]);

    return (
        <>
            <Row>
                <Col span={24} className="standard">
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
                <Col sm={14} xl={7} className="standard">
                    <Checkbox
                        checked={localAnswer.hasDefault}
                        onChange={(e) => {
                            updateStore({
                                hasDefault: e.target.checked,
                            });
                            setCheckedField(0, e.target.checked, validationObject, setValidationObject);
                            setValidateNumber(0, validationObject, setValidationObject, localAnswer.defaultValue);
                        }}
                    >
                        Forhåndsvelg en verdi:
                    </Checkbox>
                </Col>
                <Col span={10}>
                    <Input
                        type="number"
                        className={errorList[0] ? 'field-error' : ''}
                        defaultValue={localAnswer.defaultValue}
                        onBlur={(e) => {
                            updateStore({
                                defaultValue: e.currentTarget.value,
                            });
                            setVisitedField(0, validationObject, setValidationObject);
                            setValidateNumber(
                                0,
                                validationObject,
                                setValidationObject,
                                parseInt(e.currentTarget.value),
                            );
                        }}
                        disabled={!localAnswer.hasDefault}
                        style={inputStyle}
                    ></Input>
                    {errorList[0] && <p style={{ color: 'red' }}> Fyll inn standardverdi</p>}
                </Col>
            </Row>
            <Row>
                <Col sm={14} xl={7} className="standard">
                    <Checkbox
                        checked={localAnswer.hasUnit}
                        onChange={(e) => {
                            updateStore({
                                hasUnit: e.target.checked,
                            });
                            setCheckedField(1, e.target.checked, validationObject, setValidationObject);
                            setValidateText(1, validationObject, setValidationObject, localAnswer.unit);
                        }}
                    >
                        Enhet:
                    </Checkbox>
                </Col>
                <Col span={10}>
                    <Input
                        type="text"
                        className={errorList[1] ? 'field-error' : ''}
                        defaultValue={localAnswer.unit}
                        onBlur={(e) => {
                            updateStore({
                                unit: e.target.value,
                            });
                            setVisitedField(1, validationObject, setValidationObject);
                            setValidateText(1, validationObject, setValidationObject, e.currentTarget.value);
                        }}
                        disabled={!localAnswer.hasUnit}
                        style={inputStyle}
                    ></Input>
                    {errorList[1] && <p style={{ color: 'red' }}> Fyll inn enhet</p>}
                </Col>
            </Row>
            <Row>
                <Col className="standard" style={{ paddingBottom: '0' }}>
                    <p>Avgrens gyldige verdier:</p>
                </Col>
            </Row>
            <Row>
                <Col sm={10} xl={7} className="standard">
                    <Checkbox
                        checked={localAnswer.hasMin}
                        onChange={(e) => {
                            updateStore({
                                hasMin: e.target.checked,
                            });
                            setCheckedField(2, e.target.checked, validationObject, setValidationObject);
                            setValidateNumber(2, validationObject, setValidationObject, localAnswer.minValue);
                        }}
                    >
                        Minimum:
                    </Checkbox>
                </Col>
                <Col span={10}>
                    <Input
                        type="number"
                        className={errorList[2] ? 'field-error' : ''}
                        defaultValue={localAnswer.minValue}
                        onBlur={(e) => {
                            updateStore({
                                minValue: e.target.value,
                            });
                            setVisitedField(2, validationObject, setValidationObject);
                            setValidateNumber(
                                2,
                                validationObject,
                                setValidationObject,
                                parseInt(e.currentTarget.value),
                            );
                        }}
                        disabled={!localAnswer.hasMin}
                        style={inputStyle}
                    ></Input>
                    {errorList[2] && <p style={{ color: 'red' }}> Fyll inn minimum</p>}
                </Col>
            </Row>
            <Row>
                <Col sm={10} xl={7} className="standard">
                    <Checkbox
                        checked={localAnswer.hasMax}
                        onChange={(e) => {
                            updateStore({
                                hasMax: e.target.checked,
                            });
                            setCheckedField(3, e.target.checked, validationObject, setValidationObject);
                            setValidateNumber(3, validationObject, setValidationObject, localAnswer.maxValue);
                        }}
                    >
                        Maksimum:
                    </Checkbox>
                </Col>
                <Col span={12}>
                    <Input
                        type="number"
                        className={errorList[3] ? 'field-error' : ''}
                        defaultValue={localAnswer.maxValue}
                        onBlur={(e) => {
                            updateStore({
                                maxValue: e.target.value,
                            });
                            setVisitedField(3, validationObject, setValidationObject);
                            setValidateNumber(
                                3,
                                validationObject,
                                setValidationObject,
                                parseInt(e.currentTarget.value),
                            );
                        }}
                        disabled={!localAnswer.hasMax}
                        style={inputStyle}
                    ></Input>
                    {errorList[3] && <p style={{ color: 'red' }}> Fyll inn maksimum</p>}
                </Col>
            </Row>
        </>
    );
}

export default Number;
