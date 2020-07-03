import React, { useState, useContext } from 'react';
import { Radio, Button, Input, Tooltip, Checkbox } from 'antd';
import {
    PlusCircleOutlined,
    PlusSquareOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import './AnswerComponent.css';
import { IChoice } from '../../types/IAnswer';
import { FormContext, updateAnswer } from '../../store/FormStore';

type choiceProps = {
    questionId: string;
};

function Choice({ questionId }: choiceProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(
        state.questions[questionId].answer as IChoice,
    );

    function localUpdate(attribute: {
        isMultiple?: boolean;
        isOpen?: boolean;
        updateStore?: boolean;
        choices?: Array<string>;
        defaultValue?: number;
    }) {
        const temp = { ...localAnswer };
        if (attribute.isMultiple !== undefined)
            temp.isMultiple = attribute.isMultiple;
        if (attribute.isOpen !== undefined) temp.isOpen = attribute.isOpen;
        if (attribute.choices !== undefined) temp.choices = attribute.choices;
        if (attribute.defaultValue !== undefined)
            temp.defaultValue = attribute.defaultValue;

        setLocalAnswer(temp);
        if (attribute.updateStore)
            dispatch(updateAnswer(questionId, localAnswer));
    }

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
        width: '90%',
    };
    const checkStyle = {
        display: 'block',
        marginBottom: '10px',
    };

    function addButtonClick() {
        let tempChoices = { ...localAnswer.choices };
        tempChoices = [...tempChoices, ''];
        localUpdate({ choices: tempChoices });
    }

    function deleteButton(id: number) {
        const tempChoices = { ...localAnswer.choices };
        tempChoices.splice(id, 1);
        localUpdate({ choices: tempChoices });
    }

    function alterChoiceText(id: number, value: string) {
        const tempChoices = { ...localAnswer.choices };
        tempChoices[id] = value;
        localUpdate({ choices: tempChoices });
    }

    function createRadioButton(id: number) {
        return (
            <Radio
                key={'Radio' + questionId + id}
                style={radioStyle}
                disabled={true}
                value={id}
            >
                <Input
                    type="text"
                    className="input-question"
                    placeholder={'Skriv inn alternativ her'}
                    value={localAnswer.choices[id]}
                    onChange={(e) => alterChoiceText(id, e.target.value)}
                    onBlur={() => localUpdate({ updateStore: true })}
                />

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

    function createCheckbox(id: number) {
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
                        value={localAnswer.choices[id]}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                        ): void => {
                            alterChoiceText(id, e.target.value);
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
        <>
            <Checkbox
                checked={localAnswer.isMultiple}
                onChange={(e) =>
                    localUpdate({
                        updateStore: true,
                        isMultiple: e.target.checked,
                    })
                }
            >
                Langsvar?:
            </Checkbox>
            {localAnswer.isMultiple ? (
                <Radio.Group name="radiogroup">
                    {localAnswer.choices.map((name, id) => [
                        createRadioButton(id),
                    ])}
                    {
                        <Button
                            type="text"
                            icon={<PlusCircleOutlined />}
                            onClick={addButtonClick}
                            value="Add"
                        >
                            Legg til alternativ
                        </Button>
                    }
                </Radio.Group>
            ) : (
                <div
                    className="question-component"
                    style={{ marginTop: '20px' }}
                >
                    <h4>Answers:</h4>
                    {localAnswer.choices.map((_, id) => [createCheckbox(id)])}
                    <Button
                        type="text"
                        shape="circle"
                        icon={<PlusSquareOutlined />}
                        onClick={addButtonClick}
                        value="Add"
                    />
                </div>
            )}
        </>
    );
}

export default Choice;
