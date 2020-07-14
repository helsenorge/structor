import React, { useContext, useState, useEffect } from 'react';
import { Checkbox, Input, Row, Col, Form } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import './AnswerComponent.css';
import { IBoolean } from '../../types/IAnswer';

type BooleanInputProps = {
    questionId: string;
};

function BooleanInput({ questionId }: BooleanInputProps): JSX.Element {
    const checkStyle = {
        marginBottom: '10px',
    };
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...(state.questions[questionId].answer as IBoolean) };
    const [validationList, setValidationList] = useState([false]);
    const [visitedfields, setVisitedField] = useState([false]);

    function localUpdate(attribute: { isChecked?: boolean; label?: string }) {
        const temp = { ...localAnswer } as IBoolean;
        if (attribute.isChecked !== undefined) temp.isChecked = attribute.isChecked;
        if (attribute.label !== undefined) temp.label = attribute.label as string;
        console.log();
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
        console.log('Running validation on JSON');
        const temp = { ...(state.questions[questionId].answer as IBoolean) };
        const validation = [...validationList];
        if (temp.label.length > 0) validation[0] = true;
        setValidationList(validation);
        !validation.includes(false) ? (temp.valid = true) : (temp.valid = false);
        console.log(temp.valid);
        console.log(validation);
    }, []);

    useEffect(() => {
        const temp = { ...state.questions[questionId].answer };
        temp.valid = validationList.every((field) => field === true);
        dispatch(updateAnswer(questionId, temp));
    }, [validationList]);

    return (
        <>
            <Form>
                <Checkbox key={'Boolean' + questionId} style={checkStyle} disabled checked={localAnswer.isChecked}>
                    <Input
                        type="text"
                        className={showError(0) ? 'field-error' : 'input-question'}
                        defaultValue={localAnswer.label}
                        placeholder={'Skriv inn påstand her.'}
                        style={{ width: '400px' }}
                        onBlur={(e) => {
                            localUpdate({
                                label: e.currentTarget.value,
                            });
                            validate(0, e.currentTarget.value);
                        }}
                    ></Input>
                    {validationList.includes(false) && state.validationFlag && (
                        <p style={{ color: 'red' }}> Skriv inn påstand her</p>
                    )}
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
