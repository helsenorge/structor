import React, { useContext, useState } from 'react';
import { InputNumber, Checkbox } from 'antd';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IText } from '../../types/IAnswer';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = state.questions[questionId].answer as IText;

    function updateStore(attribute: { isLong?: boolean; maxLength?: number }) {
        const temp = { ...localAnswer } as IText;
        if (attribute.isLong !== undefined) temp.isLong = attribute.isLong;
        if (attribute.maxLength) temp.maxLength = attribute.maxLength;
        dispatch(updateAnswer(questionId, temp));
    }

    return (
        <>
            <Checkbox
                checked={localAnswer.isLong}
                onChange={(e) => updateStore({ isLong: e.target.checked })}
            >
                Langsvar av maks
            </Checkbox>
            <InputNumber
                disabled={!localAnswer.isLong}
                defaultValue={localAnswer.maxLength}
                onBlur={(e) =>
                    updateStore({
                        maxLength: (e.target.value as unknown) as number,
                    })
                }
                type="number"
            ></InputNumber>
            {' karakterer'}
        </>
    );
}
export default TextInput;
