import React from 'react';
import { Input } from 'antd';
import './AnswerComponent.css';

function TextInput(): JSX.Element {
    return (
        <Input
            placeholder="Mottaker skriver inn sitt svar her"
            disabled={true}
        ></Input>
    );
}

export default TextInput;
