import { useState, useEffect } from 'react';
import React from 'react';
import { InputNumber } from 'antd';
import './AnswerComponent.css';
type DecimalProps = {
    max: number;
    min: number;
};
function Decimal({ max, min }: DecimalProps): JSX.Element {
    // TODO: Implement min/max usage later
    //const [maxValue, setMaxValue] = useState(0);
    const [minValue, setMinValue] = useState(0);
    const answerType = 'decimal';
    useEffect(() => {
        console.log(minValue, answerType); // to not get warnings when deploying fb-dev
    });
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

export default Decimal;
