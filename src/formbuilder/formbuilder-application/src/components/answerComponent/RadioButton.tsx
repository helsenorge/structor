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
        width: '90%',
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
                        placeholder={'Skriv inn alternativ her'}
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
                <Tooltip title="Fjern alternativ" placement="right">
                    <Button
                        type="text"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => deleteButton(id)}
                        value="Delete"
                    />
                </Tooltip>
            </Radio>
        );
    }

    return (
        <Radio.Group name="radiogroup">
            {buttonNames.map((name, id) => [createButton(id)])}
            <Button
                type="text"
                icon={<PlusCircleOutlined />}
                onClick={addButtonClick}
                value="Add"
            >
                Legg til alternativ
            </Button>
        </Radio.Group>
    );
}

export default RadioButton;
