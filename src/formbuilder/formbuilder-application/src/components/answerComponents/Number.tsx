import React from 'react';
import { InputNumber } from 'antd';
import './AnswerComponent.css';

type NumberProps = {
    questionId: string;
};
function Number({ questionId }: NumberProps): JSX.Element {
    return (
        <div
            style={{
                marginTop: '20px',
                width: '60%',
                display: 'inline-block',
            }}
        >
            <InputNumber placeholder="Tallverdi" disabled={true}></InputNumber>
        </div>
    );
}

export default Number;