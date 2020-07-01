import React, { useContext, useEffect } from 'react';
import { Radio } from 'antd';
import './AnswerComponent.css';
import IAnswer, { AnswerTypes } from '../../types/IAnswer';
import { FormContext, updateAnswer } from '../../store/FormStore';
 
type booleanProps = {
    questionId: string;
};
 
function BooleanInput({ questionId }: booleanProps): JSX.Element {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
        width: '90%',
    };
 
    const { state, dispatch } = useContext(FormContext);

    return (
        <Radio.Group name="radiogroup">
            <Radio
                key={'bool_true'}
                style={radioStyle}
                disabled={true}
                value={true}
            >
                Ja
            </Radio>
            <Radio
                key={'bool_false'}
                style={radioStyle}
                disabled={true}
                value={false}
            >
                Nei
            </Radio>
        </Radio.Group>
    );
}
 
export default BooleanInput;
