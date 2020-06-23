import React, { ReactElement } from 'react';
import { Input } from 'antd';
import './AnswerComponent.css';

const TextInput: React.FC = (): ReactElement => {
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
};

export default TextInput;
