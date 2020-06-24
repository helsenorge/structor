import React, { useState } from 'react';
import { Radio, Button, Input, Tooltip } from 'antd';
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './AnswerComponent.css';

function RadioButton(): JSX.Element {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
    };

    const [buttonNames, setButtonNames] = useState(['']);

    function deleteButton(id: number) {
        const res = [...buttonNames];
        res.splice(id, 1);
        setButtonNames(res);
    }

    function createButton(id: number) {
        return (
            <Radio
                key={'Radio' + id}
                style={radioStyle}
                disabled={true}
                value={id}
            >
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
                        value={buttonNames[id]}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                            const temp = buttonNames.slice();
                            temp[id] = e.target.value;
                            setButtonNames(temp);
                        }}
                    />
                </Tooltip>{' '}
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
        setButtonNames([...buttonNames, '']);
    }

    return (
        <div className="question-component" style={{ marginTop: '20px' }}>
            <h4>Radio buttons</h4>
            <Radio.Group name="radiogroup" defaultValue={1}>
                {buttonNames.map((name, id) => [createButton(id)])}
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
