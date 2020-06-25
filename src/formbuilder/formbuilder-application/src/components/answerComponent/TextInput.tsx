import React from 'react';
import { Input } from 'antd';
import './AnswerComponent.css';

function TextInput(): JSX.Element {
    return (
        <div
            style={{
                marginTop: '20px',
                width: '60%',
                display: 'inline-block',
            }}
        >
            <Input placeholder="Kort tekst svar..." disabled={true}></Input>
        </div>
    );
}

export default TextInput;
