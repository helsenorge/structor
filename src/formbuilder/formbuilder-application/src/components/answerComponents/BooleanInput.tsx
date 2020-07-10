import React, { useState, useContext } from 'react';
import { Checkbox, Input } from 'antd';
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
    const [localAnswer, setLocalAnswer] = useState(state.questions[questionId].answer as IBoolean);

    function localUpdate(attribute: { isChecked?: boolean; label?: string; updateStore?: boolean }) {
        const temp = { ...localAnswer };
        if (attribute.isChecked !== undefined) temp.isChecked = attribute.isChecked;
        if (attribute.label) temp.label = attribute.label;
        setLocalAnswer(temp);
        if (attribute.updateStore) dispatch(updateAnswer(questionId, temp));
    }

    return (
        <div>
            <Checkbox key={'Boolean' + questionId} style={checkStyle} disabled defaultChecked={localAnswer.isChecked}>
                <Input
                    type="text"
                    defaultValue={localAnswer.label}
                    className="input-question"
                    placeholder={'Skriv inn påstand her.'}
                    style={{
                        width: '250px',
                    }}
                    onBlur={() => localUpdate({ updateStore: true })}
                    onChange={(e) =>
                        localUpdate({
                            label: e.target.value,
                            updateStore: false,
                        })
                    }
                ></Input>
            </Checkbox>
            <Checkbox
                defaultChecked={localAnswer.isChecked}
                onChange={(e) =>
                    localUpdate({
                        isChecked: e.target.checked,
                        updateStore: true,
                    })
                }
            >
                Skal være forhåndsvalgt.
            </Checkbox>
        </div>
    );
}

export default BooleanInput;
