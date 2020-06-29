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

    return <InputNumber placeholder="Tallverdi" disabled={true}></InputNumber>;
}

export default Decimal;
