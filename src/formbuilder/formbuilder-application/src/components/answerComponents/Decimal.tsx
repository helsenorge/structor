import { useState, useEffect } from 'react';
import React from 'react';
import { InputNumber, Checkbox } from 'antd';
import './AnswerComponent.css';

function Decimal(): JSX.Element {
    const [max, setMax] = useState(false);
    const [min, setMin] = useState(false);
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
            <InputNumber placeholder="Tall svar" disabled={true}></InputNumber>
            <Checkbox onChange={(e) => setMax(e.target.checked)}>Max</Checkbox>
            {max ? <InputNumber></InputNumber> : ''}
            <Checkbox onChange={(e) => setMin(e.target.checked)}>Min</Checkbox>
            {min ? (
                <InputNumber
                    type="number"
                    onChange={(value) =>
                        value ? setMinValue(value as number) : setMinValue(0)
                    }
                ></InputNumber>
            ) : (
                ''
            )}
        </div>
    );
}

export default Decimal;
