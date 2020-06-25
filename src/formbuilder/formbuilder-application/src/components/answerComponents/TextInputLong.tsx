import React, { ReactElement } from 'react';
import { Input } from 'antd';
import './AnswerComponent.css';

const { TextArea } = Input;

const TextInputLong: React.FC = (): ReactElement => {
    return (
        <TextArea
            placeholder="Mottaker skriver inn sitt svar her"
            rows={4}
            disabled={true}
            className="input-question"
        ></TextArea>
    );
};

export default TextInputLong;
