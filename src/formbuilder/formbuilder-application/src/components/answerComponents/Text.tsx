import React, { useContext, useState, useEffect } from 'react';
import { Checkbox, Form, Input, Row, Col } from 'antd';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IText } from '../../types/IAnswer';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = state.questions[questionId].answer as IText;
    const [validationList, setValidationList] = useState([false]);
    const [visitedfields, setVisitedField] = useState([false]);

    function updateStore(attribute: { isLong?: boolean; maxLength?: number }) {
        const temp = { ...localAnswer } as IText;
        if (attribute.isLong !== undefined) temp.isLong = attribute.isLong;
        if (attribute.maxLength !== undefined) temp.maxLength = attribute.maxLength;
        dispatch(updateAnswer(questionId, temp));
    }

    function validate(field: number, value: string): void {
        const tempValid = [...validationList];
        const tempVisited = [...visitedfields];
        value.length > 0 ? (tempValid[field] = true) : (tempValid[field] = false);
        tempVisited[field] = true;
        setVisitedField(tempVisited);
        setValidationList(tempValid);
    }

    function showError(field: number): boolean {
        return (state.validationFlag && !validationList[field]) || (!validationList[field] && visitedfields[field]);
    }

    useEffect(() => {
        const temp = { ...state.questions[questionId].answer } as IText;
        const validation = [temp.isLong ? (temp.maxLength && temp.maxLength > 0 ? true : false) : true];
        setValidationList(validation);
        temp.valid = !validation.includes(false);
        dispatch(updateAnswer(questionId, temp));
    }, []);

    useEffect(() => {
        const temp = { ...state.questions[questionId].answer };
        temp.valid = validationList.every((field) => field === true);
        dispatch(updateAnswer(questionId, temp));
    }, [validationList]);

    return (
        <>
            <Row>
                <Col span={12}>
                    <Row>
                        <Col span={12}>
                            <Checkbox
                                checked={localAnswer.isLong}
                                onChange={(e) => {
                                    updateStore({
                                        isLong: e.target.checked,
                                    });
                                    updateCheckedList(0, e.target.checked);
                                }}
                            >
                                Langsvar av maks
                            </Checkbox>
                        </Col>
                        <Col span={12}>
                            <Input
                                type="number"
                                width="100px"
                                className={showError(0) ? 'field-error' : ''}
                                disabled={!localAnswer.isLong}
                                defaultValue={localAnswer.maxLength}
                                min={0}
                                onBlur={(e) => {
                                    updateStore({
                                        maxLength: (e.currentTarget.value as unknown) as number,
                                    });
                                    validate(0, e.target.value);
                                }}
                            />
                            {showError(0) && <p style={{ color: 'red' }}> Fyll inn antall karakterer</p>}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
export default TextInput;
