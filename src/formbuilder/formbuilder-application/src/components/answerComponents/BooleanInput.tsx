import React, { useContext, useState, useEffect } from 'react';
import { Checkbox, Input, Row, Col, Form } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import './AnswerComponent.css';
import { IBoolean } from '../../types/IAnswer';
import { ValidateStatus } from 'antd/lib/form/FormItem';

type BooleanInputProps = {
    questionId: string;
};

function BooleanInput({ questionId }: BooleanInputProps): JSX.Element {
    const checkStyle = {
        marginBottom: '10px',
    };
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...(state.questions[questionId].answer as IBoolean) };
    const [validationList, setValidationList] = useState([true]);

    function localUpdate(attribute: { isChecked?: boolean; label?: string }) {
        const temp = { ...localAnswer } as IBoolean;
        if (attribute.isChecked !== undefined) temp.isChecked = attribute.isChecked;
        if (attribute.label !== undefined) temp.label = attribute.label as string;
        console.log();
        dispatch(updateAnswer(questionId, temp));
    }

    function validate(field: number, validity: ValidateStatus): ValidateStatus {
        const tempValid = [...validationList];
        if (validity === 'error' && validationList[field] !== false) {
            tempValid[field] = false;
            setValidationList(tempValid);
        } else if (validity === 'success' && validationList[field] !== true) {
            tempValid[field] = true;
            setValidationList(tempValid);
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
                <Checkbox key={'Boolean' + questionId} style={checkStyle} disabled checked={localAnswer.isChecked}>
                    <Form.Item
                        validateStatus={
                            String(localAnswer.label).length > 0
                                ? (validate(0, 'success') as ValidateStatus)
                                : (validate(0, 'error') as ValidateStatus)
                        }
                        help={String(localAnswer.label).length > 0 ? undefined : 'Fyll inn påstand'}
                    >
                        <Input
                            type="text"
                            defaultValue={localAnswer.label}
                            className="input-question"
                            placeholder={'Skriv inn påstand her.'}
                            style={{ width: '400px' }}
                            onBlur={(e) =>
                                localUpdate({
                                    label: e.currentTarget.value,
                                })
                            }
                        ></Input>
                    </Form.Item>
                    <Checkbox
                        checked={localAnswer.isChecked}
                        onChange={(e) =>
                            localUpdate({
                                isChecked: e.target.checked,
                            })
                        }
                    >
                        Skal være forhåndsvalgt.
                    </Checkbox>
                </Checkbox>
            </Form>
        </>
    );
}

export default BooleanInput;
