import React, { useContext, useState, useEffect } from 'react';
import { Checkbox, Form, Input, Row, Col } from 'antd';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IText } from '../../types/IAnswer';
import {
    setVisitedField,
    setValidateNumber,
    setCheckedField,
    IValidation,
    checkErrorFields,
    validateNumber,
} from '../../helpers/ValidationHelpers';
import moment from 'moment';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = state.questions[questionId].answer as IText;
    const [errorList, setErrorList] = useState([false]);
    const [validationObject, setValidationObject] = useState({
        checkedList: [localAnswer.isLong],
        visitedFields: [localAnswer.maxLength === undefined ? 0 : moment().valueOf()],
        validationList: [validateNumber(localAnswer.maxLength)],
    } as IValidation);

    function updateStore(attribute: { isLong?: boolean; maxLength?: string }) {
        const temp = { ...localAnswer } as IText;
        if (attribute.isLong !== undefined) temp.isLong = attribute.isLong;
        if (attribute.maxLength !== undefined)
            temp.maxLength = attribute.maxLength.length > 0 ? parseInt(attribute.maxLength) : undefined;
        dispatch(updateAnswer(questionId, temp));
    }

    useEffect(() => {
        const tempAnswer = { ...state.questions[questionId].answer };
        checkErrorFields(state.validationFlag, validationObject, errorList, setErrorList, false, setValidationObject);
        tempAnswer.valid = !validationObject.validationList.includes(false);
        dispatch(updateAnswer(questionId, tempAnswer));
    }, [validationObject]);

    useEffect(() => {
        checkErrorFields(state.validationFlag, validationObject, errorList, setErrorList, true, setValidationObject);
    }, [state.validationFlag]);

    return (
        <>
            <Row>
                <Col span={18}>
                    <Row>
                        <Col span={16}>
                            <Checkbox
                                checked={localAnswer.isLong}
                                onChange={(e) => {
                                    updateStore({
                                        isLong: e.target.checked,
                                    });
                                    setCheckedField(0, e.target.checked, validationObject, setValidationObject);
                                    setValidateNumber(0, validationObject, setValidationObject, localAnswer.maxLength);
                                }}
                            >
                                Langsvar med maks lengde:
                            </Checkbox>
                        </Col>
                        <Col span={8}>
                            <Input
                                type="number"
                                width="100px"
                                className={errorList[0] ? 'field-error' : ''}
                                disabled={!localAnswer.isLong}
                                defaultValue={localAnswer.maxLength}
                                min={0}
                                onBlur={(e) => {
                                    updateStore({
                                        maxLength: e.currentTarget.value,
                                    });
                                    setVisitedField(0, validationObject, setValidationObject);
                                    setValidateNumber(
                                        0,
                                        validationObject,
                                        setValidationObject,
                                        parseInt(e.currentTarget.value),
                                    );
                                }}
                            />
                            {errorList[0] && <p style={{ color: 'red' }}> Fyll inn antall karakterer</p>}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
export default TextInput;
