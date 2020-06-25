import React, { useState } from 'react';
import { Checkbox, Button, Input, Tooltip } from 'antd';
import './AnswerComponent.css';
import { PlusSquareOutlined, CloseOutlined } from '@ant-design/icons';

function CheckBox(): JSX.Element {
    const checkStyle = {
        display: 'block',
        marginBottom: '10px',
    };

    const [buttonNames, setButtonNames] = useState(['']);

    function addButtonClick() {
        setButtonNames([...buttonNames, '']);
    }

    function deleteButton(id: number) {
        const res = [...buttonNames];
        res.splice(id, 1);
        setButtonNames(res);
    }

    function createButton(id: number) {
        return (
            <Checkbox key={'Check' + id} style={checkStyle} value={id}>
                <Tooltip
                    trigger={['focus']}
                    title={'Enter option'}
                    placement="topLeft"
                    overlayClassName="numeric-input"
                >
                    <Input
                        type="text"
                        className="input-question"
                        placeholder={'Enter option'}
                        style={{
                            width: '250px',
                        }}
                        value={buttonNames[id]}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                            const temp = buttonNames.slice();
                            temp[id] = e.target.value;
                            setButtonNames(temp);
                        }}
                    />
                </Tooltip>
                <Button
                    type="text"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => deleteButton(id)}
                    value="Delete"
                />
            </Checkbox>
        );
    }

    return (
        <div className="question-component" style={{ marginTop: '20px' }}>
            <h4>Answers:</h4>
            {buttonNames.map((_, id) => [createButton(id)])}
            <Button
                type="text"
                shape="circle"
                icon={<PlusSquareOutlined />}
                onClick={addButtonClick}
                value="Add"
            />
        </div>
    );
}

export default CheckBox;
