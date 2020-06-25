import React from 'react';
import { Input } from 'antd';
import './QuestionComponents.css';

type InputFieldProps = {
    placeholder: string;
    className?: string;
};

function InputField({ placeholder }: InputFieldProps) {
    return (
        <div style={{ width: '60%', display: 'inline-block', padding: '5px' }}>
            <Input
                className="input-question"
                size="large"
                placeholder={placeholder}
            />
        </div>
    );
}

export default InputField;
