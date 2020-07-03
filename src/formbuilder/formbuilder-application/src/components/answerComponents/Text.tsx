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
    const [localAnswer, setLocalAnswer] = useState(
        state.questions[questionId].answer as IText,
    );

    function localUpdate(attribute: {
        isLong?: boolean;
        maxLength?: number;
        updateStore?: boolean;
    }) {
        const temp = { ...localAnswer };
        if (attribute.isLong !== undefined) temp.isLong = attribute.isLong;
        if (attribute.maxLength) temp.maxLength = attribute.maxLength;
        setLocalAnswer(temp);
        if (attribute.updateStore)
            dispatch(updateAnswer(questionId, temp));
    }

    return (
        <>
            <Checkbox
                checked={localAnswer.isLong}
                onChange={(e) =>
                    localUpdate({ updateStore: true, isLong: e.target.checked })
                }
            >
                Langsvar?:
            </Checkbox>
            {localAnswer.isLong && (
                <InputNumber
                    onBlur={() => localUpdate({ updateStore: true })}
                    onChange={(value) =>
                        localUpdate({
                            maxLength: value as number,
                            updateStore: false,
                        })
                    }
                >
                    Max length
                </InputNumber>
            )}
        </>
    );
}
export default TextInput;
