import React, { useContext, useState, useEffect } from 'react';
import { InputNumber, Checkbox, Form, Input, Row, Col } from 'antd';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IText } from '../../types/IAnswer';
import { ValidateStatus } from 'antd/lib/form/FormItem';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = state.questions[questionId].answer as IText;
    const [validationList, setValidationList] = useState([true]);

    function updateStore(attribute: { isLong?: boolean; maxLength?: number }) {
        const temp = { ...localAnswer } as IText;
        if (attribute.isLong !== undefined) temp.isLong = attribute.isLong;
        if (attribute.maxLength) temp.maxLength = attribute.maxLength;
        dispatch(updateAnswer(questionId, temp));
    }

    function validate(field: number, validity: ValidateStatus): ValidateStatus {
        const tempValid = [...validationList];
        const temp = { ...state.questions[questionId].answer };
        if (validity === 'error' && validationList[field] !== false) {
            tempValid[field] = false;
            setValidationList(tempValid);
            temp.valid = false;
            dispatch(updateAnswer(questionId, temp));
        } else if (validity === 'success' && validationList[field] !== true) {
            tempValid[field] = true;
            setValidationList(tempValid);
            temp.valid = true;
            dispatch(updateAnswer(questionId, temp));
        }
        return validity;
    }

    useEffect(() => {
        const temp = { ...state.questions[questionId].answer };
        temp.valid = true;
        dispatch(updateAnswer(questionId, temp));
    }, []);

    return (
        <>
            <Form>
                <Row>
                    <Col span={12}>
                        <Row>
                            <Col span={12}>
                                <Checkbox
                                    checked={localAnswer.isLong}
                                    onChange={(e) =>
                                        updateStore({
                                            isLong: e.target.checked,
                                        })
                                    }
                                >
                                    Langsvar av maks
                                </Checkbox>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    validateStatus={
                                        localAnswer.isLong === false ||
                                        (localAnswer.isLong === true &&
                                            localAnswer.maxLength !== undefined &&
                                            String(localAnswer.maxLength).length > 0)
                                            ? (validate(0, 'success') as ValidateStatus)
                                            : (validate(0, 'error') as ValidateStatus)
                                    }
                                    help={
                                        localAnswer.isLong === false ||
                                        (localAnswer.isLong === true &&
                                            localAnswer.maxLength !== undefined &&
                                            String(localAnswer.maxLength).length > 0)
                                            ? undefined
                                            : 'Fyll maks lengde'
                                    }
                                >
                                    <Input
                                        disabled={!localAnswer.isLong}
                                        defaultValue={localAnswer.maxLength}
                                        onBlur={(e) =>
                                            updateStore({
                                                maxLength: (e.target.value as unknown) as number,
                                            })
                                        }
                                        type="number"
                                        width="100px"
                                    ></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
export default TextInput;
