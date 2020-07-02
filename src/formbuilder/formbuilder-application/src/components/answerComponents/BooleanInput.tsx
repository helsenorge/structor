import React from 'react';
import { Radio } from 'antd';
import './AnswerComponent.css';

function BooleanInput(): JSX.Element {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
        width: '90%',
    };

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
