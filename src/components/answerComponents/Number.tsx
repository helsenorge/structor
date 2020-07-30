import React, { useContext } from 'react';
import { Checkbox, Input, Row, Col } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { INumber } from '../../types/IAnswer';
import './AnswerComponent.css';
import { useTranslation } from 'react-i18next';

type NumberProps = {
    questionId: string;
};

function Number({ questionId }: NumberProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...state.questions[questionId].answer } as INumber;
    const { t } = useTranslation();

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
                <Col sm={14} lg={14} className="standard">
                    <Checkbox
                        checked={localAnswer.hasDefault}
                        onChange={(e) => {
                            updateStore({
                                hasDefault: e.target.checked,
                            });
                        }}
                    >
                        {t('Set default value:')}
                        Forhåndsvelg en verdi:
                    </Checkbox>
                </Col>
                <Col span={10}>
                    <Input
                        type="number"
                        defaultValue={localAnswer.defaultValue}
                        onBlur={(e) => {
                            updateStore({
                                defaultValue: e.currentTarget.value,
                            });
                        }}
                        disabled={!localAnswer.hasDefault}
                        style={inputStyle}
                    ></Input>
                </Col>
            </Row>
            <Row>
                <Col sm={14} lg={14} className="standard">
                    <Checkbox
                        checked={localAnswer.hasUnit}
                        onChange={(e) => {
                            updateStore({
                                hasUnit: e.target.checked,
                            });
                        }}
                    >
                        Enhet:
                    </Checkbox>
                </Col>
                <Col span={10}>
                    <Input
                        type="text"
                        defaultValue={localAnswer.unit}
                        onBlur={(e) => {
                            updateStore({
                                unit: e.target.value,
                            });
                        }}
                        disabled={!localAnswer.hasUnit}
                        style={inputStyle}
                    ></Input>
                </Col>
            </Row>
            <Row>
                <Col className="standard" style={{ paddingBottom: '0' }}>
                    <p>{t('Define valid values:')}</p>
                </Col>
            </Row>
            <Row>
                <Col sm={10} lg={10} className="standard">
                    <Checkbox
                        checked={localAnswer.hasMin}
                        onChange={(e) => {
                            updateStore({
                                hasMin: e.target.checked,
                            });
                        }}
                    >
                        Minimum:
                    </Checkbox>
                </Col>
                <Col span={10}>
                    <Input
                        type="number"
                        defaultValue={localAnswer.minValue}
                        onBlur={(e) => {
                            updateStore({
                                minValue: e.target.value,
                            });
                        }}
                        disabled={!localAnswer.hasMin}
                        style={inputStyle}
                    ></Input>
                </Col>
            </Row>
            <Row>
                <Col sm={10} lg={10} className="standard">
                    <Checkbox
                        checked={localAnswer.hasMax}
                        onChange={(e) => {
                            updateStore({
                                hasMax: e.target.checked,
                            });
                        }}
                    >
                        Maksimum:
                    </Checkbox>
                </Col>
                <Col span={12}>
                    <Input
                        type="number"
                        defaultValue={localAnswer.maxValue}
                        onBlur={(e) => {
                            updateStore({
                                maxValue: e.target.value,
                            });
                        }}
                        disabled={!localAnswer.hasMax}
                        style={inputStyle}
                    ></Input>
                </Col>
            </Row>
        </>
    );
}

export default Number;
