import React, { useContext } from 'react';
import {
    Radio,
    Button,
    Input,
    Tooltip,
    Checkbox,
    Col,
    Row,
    Select,
} from 'antd';
import {
    PlusCircleOutlined,
    PlusSquareOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import './AnswerComponent.css';
import { IChoice } from '../../types/IAnswer';
import { FormContext, updateAnswer } from '../../store/FormStore';

const { Option } = Select;

type choiceProps = {
    questionId: string;
};

function Choice({ questionId }: choiceProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);

    function localUpdate(attribute: {
        isMultiple?: boolean;
        isOpen?: boolean;
        hasDefault?: boolean;
        choices?: Array<string>;
        defaultValue?: number;
    }) {
        const temp = { ...(state.questions[questionId].answer as IChoice) };
        if (attribute.isMultiple !== undefined) {
            temp.isMultiple = attribute.isMultiple;
        }
        if (attribute.isOpen !== undefined) temp.isOpen = attribute.isOpen;
        if (attribute.hasDefault !== undefined)
            temp.hasDefault = attribute.hasDefault;
        if (attribute.choices !== undefined) temp.choices = attribute.choices;
        if (attribute.defaultValue !== undefined) {
            if (isNaN(attribute.defaultValue)) temp.defaultValue = undefined;
            else temp.defaultValue = attribute.defaultValue;
        }

        dispatch(updateAnswer(questionId, temp));
    }

    const choiceStyle = { marginTop: '20px', marginLeft: 0 };

    const choiceButtonStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        marginBottom: 10,
        width: '90%',
        marginLeft: 0,
    };

    const choiceInputStyle = {
        width: '250px',
    };

    function addButtonClick() {
        const tempChoices = [
            ...(state.questions[questionId].answer as IChoice).choices,
            '',
        ];
        localUpdate({ choices: tempChoices });
    }

    function deleteButton(id: number) {
        const tempChoices = [
            ...(state.questions[questionId].answer as IChoice).choices,
        ];
        tempChoices.splice(id, 1);
        localUpdate({ choices: tempChoices });
    }

    function alterChoiceText(id: number, value: string) {
        const tempChoices = [
            ...(state.questions[questionId].answer as IChoice).choices,
        ];
        tempChoices[id] = value;
        localUpdate({ choices: tempChoices });
        console.log(state.questions[questionId].answer);
    }

    function createRadioButton(id: number) {
        return (
            <Radio
                key={'Radio_' + questionId + id}
                style={choiceButtonStyle}
                disabled={true}
                value={id}
            >
                <Input
                    type="text"
                    className="input-question"
                    placeholder={
                        'Skriv inn alternativ nr. ' + (id + 1) + ' her'
                    }
                    defaultValue={
                        (state.questions[questionId].answer as IChoice).choices[
                            id
                        ]
                    }
                    style={choiceInputStyle}
                    onBlur={(e) => alterChoiceText(id, e.target.value)}
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
            <Checkbox
                key={'Checkbox_' + questionId + id}
                style={choiceButtonStyle}
                disabled={true}
                value={id}
                checked={false}
            >
                <Input
                    type="text"
                    className="input-question"
                    placeholder={
                        'Skriv inn alternativ nr. ' + (id + 1) + ' her'
                    }
                    defaultValue={
                        (state.questions[questionId].answer as IChoice).choices[
                            id
                        ]
                    }
                    style={choiceInputStyle}
                    onBlur={(e) => alterChoiceText(id, e.target.value)}
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
            </Checkbox>
        );
    }

    return (
        <>
            <Row>
                <Col span={6}>
                    <Checkbox
                        defaultChecked={
                            (state.questions[questionId].answer as IChoice)
                                .isMultiple
                        }
                        onChange={(e) =>
                            localUpdate({
                                isMultiple: e.target.checked,
                            })
                        }
                    >
                        La borger velge flere alternativ
                    </Checkbox>
                </Col>
                <Col span={6}>
                    <Checkbox
                        defaultChecked={
                            (state.questions[questionId].answer as IChoice)
                                .isOpen
                        }
                        onChange={(e) =>
                            localUpdate({
                                isOpen: e.target.checked,
                            })
                        }
                    >
                        La borger legge til svaralternativ
                    </Checkbox>
                </Col>
                {!(state.questions[questionId].answer as IChoice)
                    .isMultiple && (
                    <>
                        <Col span={6}>
                            <Checkbox
                                defaultChecked={
                                    (state.questions[questionId]
                                        .answer as IChoice).hasDefault
                                }
                                disabled={
                                    (state.questions[questionId]
                                        .answer as IChoice).isMultiple
                                }
                                onChange={(e) =>
                                    localUpdate({
                                        hasDefault: e.target.checked,
                                    })
                                }
                            >
                                Default:
                            </Checkbox>
                        </Col>
                        <Col span={6}>
                            <Select
                                defaultValue={
                                    (state.questions[questionId]
                                        .answer as IChoice).defaultValue
                                }
                                disabled={
                                    !(
                                        (state.questions[questionId]
                                            .answer as IChoice).hasDefault &&
                                        !(state.questions[questionId]
                                            .answer as IChoice).isMultiple
                                    )
                                }
                                style={{ width: '200px' }}
                                onSelect={(value) => {
                                    localUpdate({
                                        defaultValue: value,
                                    });
                                }}
                                placeholder="Velg default"
                            >
                                {(state.questions[questionId].answer as IChoice)
                                    .choices
                                    ? (state.questions[questionId]
                                          .answer as IChoice).choices.map(
                                          (name, id) => [
                                              <Option
                                                  key={'def' + questionId + id}
                                                  value={id}
                                              >
                                                  {name.length < 1
                                                      ? 'Alternativ ' + (id + 1)
                                                      : name}
                                              </Option>,
                                          ],
                                      )
                                    : []}
                            </Select>
                        </Col>
                    </>
                )}
            </Row>
            {(state.questions[questionId].answer as IChoice).isMultiple ? (
                <div className="question-component" style={choiceStyle}>
                    <h4>Alternativer:</h4>
                    {(state.questions[questionId]
                        .answer as IChoice).choices.map((name, id) => [
                        createCheckbox(id),
                    ])}
                    <Button
                        type="text"
                        icon={<PlusSquareOutlined />}
                        onClick={addButtonClick}
                        value="Add"
                    >
                        Legg til alternativ
                    </Button>
                </div>
            ) : (
                <div className="question-component" style={choiceStyle}>
                    <h4>Flervalgsalternativer:</h4>
                    <Radio.Group
                        name="radiogroup"
                        value={
                            (state.questions[questionId].answer as IChoice)
                                .hasDefault
                                ? (state.questions[questionId]
                                      .answer as IChoice).defaultValue
                                : undefined
                        }
                    >
                        {(state.questions[questionId]
                            .answer as IChoice).choices.map((name, id) => [
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
                </div>
            )}
        </>
    );
}

export default Choice;
