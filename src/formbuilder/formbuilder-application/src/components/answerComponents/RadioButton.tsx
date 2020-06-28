import React, { useState, useContext } from 'react';
import { Radio, Button, Input, Tooltip } from 'antd';
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './AnswerComponent.css';
import { IChoice, AnswerTypes } from '../../types/IAnswer';
import IQuestion from '../../types/IQuestion';
import { FormContext, updateAnswer } from '../../store/FormStore';

type radioButtonProps = {
    question: IQuestion;
};

function RadioButton({ question }: radioButtonProps): JSX.Element {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
        width: '90%',
    };
    let choiceList = (question.answer as IChoice).choices;
    if (!choiceList) {
        choiceList = [''];
    }
    const [buttonNames, setButtonNames] = useState(choiceList);
    const { state, dispatch } = useContext(FormContext);

    function addButtonClick() {
        setButtonNames([...buttonNames, '']);
    }

    function deleteButton(id: number) {
        const res = [...buttonNames];
        res.splice(id, 1);
        setButtonNames(res);
    }

    const handleInput = () => {
        dispatch(
            updateAnswer(
                question.id as string,
                {
                    type: question.answer.type as AnswerTypes,
                    choices: buttonNames,
                } as IChoice,
            ),
        );
    }

    function createButton(id: number) {
        return (
            <Radio
                key={'Radio' + id}
                style={radioStyle}
                disabled={true}
                value={id}
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
                        // dispatch(
                        //     updateAnswer(
                        //         question.id as string,
                        //         {
                        //             type: question.answer.type as AnswerTypes,
                        //             choices: buttonNames,
                        //         } as IChoice,
                        //     ),
                        // );
                        handleInput();
                    }}
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
