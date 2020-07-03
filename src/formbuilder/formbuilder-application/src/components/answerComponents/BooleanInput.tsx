import React, { useState, useContext } from 'react';
import { Radio, Checkbox, Input } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import './AnswerComponent.css';
import { IBoolean } from '../../types/IAnswer';
/* 
export interface IBoolean extends IAnswer {
    isChecked: boolean;
    label: string;
}
*/
type BooleanInputProps = {
    questionId: string;
};

function BooleanInput({ questionId }: BooleanInputProps): JSX.Element {
    const checkStyle = {
        display: 'block',
        marginBottom: '10px',
    };
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(
        state.questions[questionId].answer as IBoolean,
    );

    function localUpdate(attribute: {
        isChecked?: boolean;
        label?: string;
        updateStore?: boolean;
    }) {
        const temp = { ...localAnswer };
        if (attribute.isChecked) temp.isChecked = attribute.isChecked;
        if (attribute.label) temp.label = attribute.label;
        setLocalAnswer(temp);
        if (attribute.updateStore)
            dispatch(updateAnswer(questionId, localAnswer));
    }

    return (
        <div>
            <Checkbox
                key={'Boolean' + questionId}
                style={checkStyle}
                value={() => localUpdate({ isChecked: true })}
                disabled
            >
                <Input
                    type="text"
                    className="input-question"
                    placeholder={'Skriv inn påstand her.'}
                    style={{
                        width: '250px',
                    }}
                    onBlur={() => localUpdate({ updateStore: true })}
                    onChange={(value) =>
                        localUpdate({
                            label: value.target.value,
                            updateStore: false,
                        })
                    }
                ></Input>
            </Checkbox>
            <Checkbox value={() => localUpdate({ updateStore: true })}>Skal være forhåndsvalgt.</Checkbox>
        </div>
    );
}

export default BooleanInput;
