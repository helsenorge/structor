import React, { useContext, useState } from 'react';
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
    const localAnswer = { ...(state.questions[questionId].answer as IChoice) };
    const [choices, setChoices] = useState((state.questions[questionId].answer as IChoice).choices);

    function localUpdate(attribute: {
        isMultiple?: boolean;
        isOpen?: boolean;
        hasDefault?: boolean;
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

        dispatch(updateAnswer(questionId, temp));
    }

    function updateChoices(attribute: { mode?: string; value?: string; id?: number; updateState?: boolean }) {
        let tempChoices = [...choices];

        if (attribute.mode === 'add') tempChoices = [...choices, ''];

        if (attribute.mode === 'delete' && attribute.id !== undefined) tempChoices.splice(attribute.id, 1);
        if (attribute.value !== undefined && attribute.id !== undefined) tempChoices[attribute.id] = attribute.value;
        setChoices(tempChoices);
        if (attribute.updateState) localUpdate({ choices: tempChoices });
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

    function deleteButton(id: number): JSX.Element {
        return (
            <Tooltip title="Fjern alternativ" placement="right">
                <Button
                    id="stealFocus"
                    type="text"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() =>
                        updateChoices({
                            mode: 'delete',
                            id: id,
                            updateState: true,
                        })
                    }
                    value="Delete"
                />
            </Tooltip>
        );
    }

    function createRadioButton(id: number) {
        return (
            <Radio key={'Radio_' + questionId + id} style={choiceButtonStyle} disabled={true} value={id}>
                <Input
                    type="text"
                    className="input-question"
                    placeholder={'Skriv inn alternativ nr. ' + (id + 1) + ' her'}
                    value={choices[id]}
                    style={{ width: '100%' }}
                    onChange={(e) => updateChoices({ id: id, value: e.target.value })}
                    onBlur={() => updateChoices({ updateState: true })}
                />
                {deleteButton(id)}
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
                    placeholder={'Skriv inn alternativ nr. ' + (id + 1) + ' her'}
                    defaultValue={localAnswer.choices[id]}
                    style={{ width: '85%' }}
                    onChange={(e) => updateChoices({ id: id, value: e.target.value })}
                    onBlur={() => updateChoices({ updateState: true })}
                />
                {deleteButton(id)}
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
                                        defaultValue: value,
                                    });
                                }}
                                placeholder="Velg standardalternativ"
                            >
                                {choices
                                    ? choices.map((name, id) => [
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
                    {choices.map((name, id) => [createCheckbox(id)])}
                    <Button
                        type="text"
                        icon={<PlusSquareOutlined />}
                        onClick={() => updateChoices({ mode: 'add' })}
                        value="Add"
                    >
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
                        {choices.map((name, id) => [createRadioButton(id)])}
                        {
                            <Button
                                type="text"
                                icon={<PlusCircleOutlined />}
                                onClick={() => updateChoices({ mode: 'add' })}
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
