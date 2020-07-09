import React, { useState, useContext } from 'react';
import { Input, Row, Col, Checkbox, Select } from 'antd';
import './answerComponents/AnswerComponent.css';
import { FormContext, updateQuestion } from '../store/FormStore';
import IQuestion from '../types/IQuestion';
import AnswerTypes, {
    IChoice,
    INumber,
    IText,
    IBoolean,
    ITime,
    IAnswer,
} from '../types/IAnswer';

const { Option } = Select;

type QuestionProps = {
    questionId: string;
};

function QuestionBuilder({ questionId }: QuestionProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localQuestion, setLocalQuestion] = useState(
        state.questions[questionId] as IQuestion,
    );

    function localUpdate(attribute: {
        answerType?: AnswerTypes;
        isRequired?: boolean;
        collapsed?: boolean;
        isDependent?: boolean;
        questionText?: string;
        dependentOf?: string;
        description?: string;
        updateStore?: boolean;
    }) {
        const temp = { ...state.questions[questionId] };
        if (attribute.isRequired !== undefined)
            temp.isRequired = attribute.isRequired;
        if (attribute.isDependent !== undefined)
            temp.isDependent = attribute.isDependent;
        if (attribute.dependentOf !== undefined)
            temp.dependentOf = attribute.dependentOf;
        if (attribute.questionText !== undefined)
            temp.questionText = attribute.questionText;
        if (attribute.collapsed !== undefined)
            temp.collapsed = attribute.collapsed;

        if (attribute.answerType) {
            temp.answerType = attribute.answerType;
            switch (attribute.answerType) {
                case AnswerTypes.choice:
                    temp.answer = {
                        id: questionId,
                        choices: [''],
                        isMultiple: false,
                        isOpen: false,
                        hasDefault: false,
                    } as IChoice;
                    break;
                case AnswerTypes.number:
                    temp.answer = {
                        id: questionId,
                        hasMax: false,
                        hasMin: false,
                        hasUnit: false,
                        isDecimal: true,
                        hasDefault: false,
                    } as INumber;
                    break;
                case AnswerTypes.text:
                    temp.answer = { id: questionId, isLong: false } as IText;
                    break;
                case AnswerTypes.boolean:
                    temp.answer = {
                        id: questionId,
                        isChecked: false,
                        label: '',
                    } as IBoolean;
                    break;
                case AnswerTypes.time:
                    temp.answer = {
                        id: questionId,
                        isTime: false,
                        isDate: false,
                        hasDefaultTime: false,
                        hasStartTime: false,
                        hasEndTime: false,
                    } as ITime;
                    break;
                default:
                    temp.answer = { id: questionId } as IAnswer;
                    console.log(
                        'Missing answer type interface: ' +
                            attribute.answerType,
                    );
                    break;
            }
        }
        setLocalQuestion(temp);
        if (attribute.updateStore) dispatch(updateQuestion(temp));
    }

    return (
        <div style={{ backgroundColor: 'var(--color-base-1)' }}>
            <Row style={{ padding: '0 23px 0 7px ' }}>
                <Col span={20}>
                    <Input
                        placeholder={localQuestion.placeholder}
                        className="input-question"
                        defaultValue={localQuestion.questionText}
                        onChange={(e) =>
                            localUpdate({
                                questionText:
                                    e.target.value === undefined
                                        ? ''
                                        : e.target.value,
                            })
                        }
                        onBlur={() => localUpdate({ updateStore: true })}
                    />
                </Col>
            </Row>
            {!state.questions[questionId].collapsed && (
                <>
                    <Row className="standard">
                        <Col span={8}>
                            <Checkbox
                                checked={localQuestion.isRequired}
                                onChange={(e) =>
                                    localUpdate({
                                        isRequired: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Spørsmålet skal være obligatorisk.
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row className="standard">
                        <Col span={20}>
                            <p
                                style={{
                                    float: 'left',
                                    padding: '5px 10px 0 0',
                                }}
                            >
                                Velg type spørsmål:{' '}
                            </p>
                            <Select
                                value={localQuestion.answerType}
                                style={{ width: '200px', float: 'left' }}
                                onSelect={(value) => {
                                    localUpdate({
                                        answerType: value,
                                        updateStore: true,
                                    });
                                }}
                                placeholder="Trykk for å velge"
                            >
                                <Option value={AnswerTypes.boolean}>
                                    Samtykke
                                </Option>
                                <Option value={AnswerTypes.number}>Tall</Option>
                                <Option value={AnswerTypes.text}>Tekst</Option>
                                <Option value={AnswerTypes.time}>
                                    Dato/tid
                                </Option>
                                <Option value={AnswerTypes.choice}>
                                    Flervalg
                                </Option>
                            </Select>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default QuestionBuilder;
