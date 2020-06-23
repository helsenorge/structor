import React, { ReactElement } from 'react';
import { Input } from 'antd';
import './AnswerComponent.css';

const { TextArea } = Input;

const TextInputLong: React.FC = (): ReactElement => {
    return (
        <div
            style={{
                marginTop: '20px',
                width: '60%',
                display: 'inline-block',
            }}
        >
            <TextArea
                placeholder="Lang tekst svar..."
                rows={4}
                disabled={true}
            ></TextArea>
        </div>
    );
};

export default TextInputLong;
