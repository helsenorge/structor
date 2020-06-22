import React, { useState } from 'react';
import { Radio, Button, Input, Tooltip } from 'antd';
import './AnswerComponent.css';
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';

function RadioButton() {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
    };

    const buttonText = (
        <Tooltip
            trigger={['focus']}
            title={'Enter option'}
            placement="topLeft"
            overlayClassName="numeric-input"
        >
            <Input className="input-question" placeholder={'Enter option'} />
        </Tooltip>
    );

    const [i, setI] = useState(0);
    const [buttonIndexes, setButtonIndexes] = useState(Array(0));

    function deleteButton(id: number) {
        setButtonIndexes(buttonIndexes.filter((index) => index !== id));
    }

    function createButton(id: number) {
        return (
            <Radio key={'radio' + id} style={radioStyle} value={id}>
                {' '}
                {buttonText}{' '}
                <Button
                    type="text"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => deleteButton(id)}
                    value="Delete"
                />
            </Radio>
        );
    }

    function addButtonClick() {
        setI(i + 1);
        buttonIndexes.push(i + 1);
        setButtonIndexes(buttonIndexes);
    }

    return (
        <div className="question-component">
            <h4>Radio buttons</h4>
            <Radio.Group name="radiogroup">
                {buttonIndexes.map((id) => [createButton(id)])}
                <Button
                    type="text"
                    shape="circle"
                    icon={<PlusCircleOutlined />}
                    onClick={addButtonClick}
                    value="Add"
                />
            </Radio.Group>
        </div>
    );
}

export default RadioButton;
