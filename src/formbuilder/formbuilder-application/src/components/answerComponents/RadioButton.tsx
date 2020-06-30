import React, { useState, useContext } from 'react';
import { Radio, Button, Input, Tooltip } from 'antd';
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './AnswerComponent.css';
import { IChoice } from '../../types/IAnswer';
import { FormContext, updateAnswer } from '../../store/FormStore';

type radioButtonProps = {
    questionId: string;
};

function RadioButton({ questionId }: radioButtonProps): JSX.Element {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
        width: '90%',
    };
    const { state, dispatch } = useContext(FormContext);
    let choiceList = (state.questions[questionId].answer as IChoice).choices;
    if (!choiceList) {
        choiceList = [''];
    }
    const [buttonNames, setButtonNames] = useState(choiceList);

    function addButtonClick() {
        setButtonNames([...buttonNames, '']);
    }

    function deleteButton(id: number) {
        const res = [...buttonNames];
        res.splice(id, 1);
        setButtonNames(res);
    }

    function handleInput() {
        dispatch(
            updateAnswer(
                questionId as string,
                {
                    choices: buttonNames,
                } as IChoice,
            ),
        );
    }

    function handleInputChange(choiceText: string, id: number){
        const temp = buttonNames.slice();
        temp[id] = choiceText;
        setButtonNames(temp);
    }

    function createButton(id: number) {
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
                    value={buttonNames[id]}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    //     const temp = buttonNames.slice();
                    //     temp[id] = e.target.value;
                    //     setButtonNames(temp);
                    //     handleInput();
                    // }}
                    onChange={(e) => handleInputChange(e.target.value, id)}
                    onBlur={() => handleInput()}
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
    return (
        <Radio.Group name="radiogroup">
            {buttonNames.map((name, id) => [createButton(id)])}
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
    );
}

export default RadioButton;
