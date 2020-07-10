import React, { useState, useContext } from 'react';
import { Radio, Button, Input, Tooltip, Checkbox, Col, Row, Select } from 'antd';
import { PlusCircleOutlined, PlusSquareOutlined, CloseOutlined } from '@ant-design/icons';
import './AnswerComponent.css';
import { IChoice } from '../../types/IAnswer';
import { FormContext, updateAnswer } from '../../store/FormStore';

const { Option } = Select;

type choiceProps = {
    questionId: string;
};

function Choice({ questionId }: choiceProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(state.questions[questionId].answer as IChoice);

    function localUpdate(attribute: {
        isMultiple?: boolean;
        isOpen?: boolean;
        hasDefault?: boolean;
        updateStore?: boolean;
        choices?: Array<string>;
        defaultValue?: number;
    }) {
        const temp = { ...localAnswer };
        if (attribute.isMultiple !== undefined) temp.isMultiple = attribute.isMultiple;
        if (attribute.isOpen !== undefined) temp.isOpen = attribute.isOpen;
        if (attribute.hasDefault !== undefined) temp.hasDefault = attribute.hasDefault;
        if (attribute.choices !== undefined) temp.choices = attribute.choices;
        if (attribute.defaultValue !== undefined) {
            if (isNaN(attribute.defaultValue)) temp.defaultValue = undefined;
            else temp.defaultValue = attribute.defaultValue;
        }
        console.log('Default: ', temp.defaultValue);

        setLocalAnswer(temp);
        if (attribute.updateStore) dispatch(updateAnswer(questionId, temp));
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

    function addButtonClick() {
        const tempChoices = [...localAnswer.choices, ''];
        localUpdate({ updateStore: true, choices: tempChoices });
    }

    function deleteButton(id: number) {
        const tempChoices = [...localAnswer.choices];
        tempChoices.splice(id, 1);
        localUpdate({ updateStore: true, choices: tempChoices });
    }

    function alterChoiceText(id: number, value: string) {
        const tempChoices = [...localAnswer.choices];
        tempChoices[id] = value;
        localUpdate({ choices: tempChoices });
    }

    function createRadioButton(id: number) {
        return (
            <Radio key={'Radio_' + questionId + id} style={choiceButtonStyle} disabled={true} value={id}>
                <Input
                    type="text"
                    className="input-question"
                    placeholder={'Alternativ ' + (id + 1)}
                    value={localAnswer.choices[id]}
                    style={{ width: '100%' }}
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
                    placeholder={'Alternativ ' + (id + 1)}
                    value={localAnswer.choices[id]}
                    style={{ width: '85%' }}
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
            </Checkbox>
        );
    }

    return (
        <>
            <Row className="standard" style={{ paddingLeft: '0px', paddingTop: '0px' }}>
                <Col span={24}>
                    <Checkbox
                        defaultChecked={localAnswer.isOpen}
                        onChange={(e) =>
                            localUpdate({
                                updateStore: true,
                                isOpen: e.target.checked,
                            })
                        }
                    >
                        La mottaker legge til svaralternativ
                    </Checkbox>
                </Col>
            </Row>
            <Row className="standard" style={{ paddingLeft: '0px' }}>
                <Col span={24}>
                    <Checkbox
                        defaultChecked={localAnswer.isMultiple}
                        onChange={(e) =>
                            localUpdate({
                                updateStore: true,
                                isMultiple: e.target.checked,
                            })
                        }
                    >
                        La mottaker velge flere alternativ
                    </Checkbox>
                </Col>
            </Row>

            {!localAnswer.isMultiple && (
                <>
                    <Row className="standard" style={{ paddingLeft: '0px' }}>
                        <Col span={24}>
                            <Checkbox
                                defaultChecked={localAnswer.hasDefault}
                                disabled={localAnswer.isMultiple}
                                onChange={(e) =>
                                    localUpdate({
                                        updateStore: true,
                                        hasDefault: e.target.checked,
                                    })
                                }
                            >
                                Forhåndsvelg standardalternativ:
                            </Checkbox>
                            <Select
                                defaultValue={localAnswer.defaultValue}
                                disabled={!(localAnswer.hasDefault && !localAnswer.isMultiple)}
                                style={{ width: '200px' }}
                                onSelect={(value) => {
                                    localUpdate({
                                        updateStore: true,
                                        defaultValue: value,
                                    });
                                }}
                                placeholder="Velg standardalternativ"
                            >
                                {localAnswer.choices
                                    ? localAnswer.choices.map((name, id) => [
                                          <Option key={'def' + questionId + id} value={id}>
                                              {name.length < 1 ? 'Alternativ ' + (id + 1) : name}
                                          </Option>,
                                      ])
                                    : []}
                            </Select>
                        </Col>
                    </Row>
                </>
            )}

            {localAnswer.isMultiple ? (
                <div className="question-component" style={choiceStyle}>
                    <h4>Skriv inn svaralternativer under:</h4>
                    {localAnswer.choices.map((name, id) => [createCheckbox(id)])}
                    <Button type="text" icon={<PlusSquareOutlined />} onClick={addButtonClick} value="Add">
                        Legg til alternativ
                    </Button>
                </div>
            ) : (
                <div className="question-component" style={choiceStyle}>
                    <h4>Skriv inn svaralternativer under:</h4>
                    <Radio.Group
                        name="radiogroup"
                        value={localAnswer.hasDefault ? localAnswer.defaultValue : undefined}
                    >
                        {localAnswer.choices.map((name, id) => [createRadioButton(id)])}
                        {
                            <Button type="text" icon={<PlusCircleOutlined />} onClick={addButtonClick} value="Add">
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
