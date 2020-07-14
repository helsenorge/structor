import React, { useContext, useState, useEffect } from 'react';
import { Input, Row, Col, Checkbox, Select, Tooltip, Button, Form } from 'antd';
import './answerComponents/AnswerComponent.css';
import { FormContext, updateQuestion, updateSection } from '../store/FormStore';
import IQuestion from '../types/IQuestion';
import * as DND from 'react-beautiful-dnd';
import AnswerTypes, { IChoice, INumber, IText, IBoolean, ITime, IAnswer } from '../types/IAnswer';
import { validateText, IValidation, checkErrorFields, setVisitedField, setValidateText } from '../helpers/ValidationHelpers';

const { Option } = Select;

type QuestionProps = {
    questionId: string;
    buttons: () => JSX.Element;
    provided: DND.DraggableProvided;
    isInfo: boolean;
};

function QuestionBuilder({ questionId, buttons, provided, isInfo }: QuestionProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localQuestion = { ...state.questions[questionId] } as IQuestion;
    const [errorList, setErrorList] = useState([false, false]);
    const [validationObject, setValidationObject] = useState({
        checkedList: [true, true],
        visitedFields: [localQuestion.questionText.length > 0, localQuestion.answerType !== AnswerTypes.default],
        validationList: [validateText(localQuestion.questionText), localQuestion.answerType !== AnswerTypes.default],
    } as IValidation);

    function updateStore(attribute: {
        answerType?: AnswerTypes;
        isRequired?: boolean;
        collapsed?: boolean;
        isDependent?: boolean;
        questionText?: string;
        dependentOf?: string;
        description?: string;
    }) {
        const temp = { ...state.questions[questionId] };
        if (attribute.isRequired !== undefined) temp.isRequired = attribute.isRequired;
        if (attribute.isDependent !== undefined) temp.isDependent = attribute.isDependent;
        if (attribute.dependentOf !== undefined) temp.dependentOf = attribute.dependentOf;
        if (attribute.questionText !== undefined) temp.questionText = attribute.questionText;
        if (attribute.collapsed !== undefined) temp.collapsed = attribute.collapsed;

        if (attribute.answerType) {
            temp.answerType = attribute.answerType;
            switch (attribute.answerType) {
                case AnswerTypes.choice:
                    temp.answer = {
                        valid: true,
                        id: questionId,
                        choices: [''],
                        isMultiple: false,
                        isOpen: false,
                        hasDefault: false,
                    } as IChoice;
                    break;
                case AnswerTypes.number:
                    temp.answer = {
                        valid: true,
                        id: questionId,
                        hasMax: false,
                        hasMin: false,
                        hasUnit: false,
                        isDecimal: true,
                        hasDefault: false,
                    } as INumber;
                    break;
                case AnswerTypes.text:
                    temp.answer = { id: questionId, isLong: false, valid: true } as IText;
                    break;
                case AnswerTypes.boolean:
                    temp.answer = {
                        valid: true,
                        id: questionId,
                        isChecked: false,
                        label: '',
                    } as IBoolean;
                    break;
                case AnswerTypes.time:
                    temp.answer = {
                        valid: true,
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
                    break;
            }
        }
        dispatch(updateQuestion(temp));
    }

    useEffect(() => {
        const temp = { ...state.questions[questionId] };
        checkErrorFields(state.validationFlag, validationObject, errorList, setErrorList);
        dispatch(updateQuestion(temp));
    }, [validationObject, state.validationFlag]);

    return (
        <div style={{ backgroundColor: 'var(--color-base-1)' }}>
            <Row>
                <Col span={17} style={{ paddingRight: '5px' }}>
                    <Input
                        placeholder={localQuestion.placeholder}
                        className={errorList[0] ? 'field-error' : 'input-question'}
                        defaultValue={localQuestion.questionText}
                        onBlur={(e) => {
                            updateStore({
                                questionText: e.target.value === undefined ? '' : e.target.value,
                            });
                            setVisitedField(0, validationObject, setValidationObject);
                            setValidateText(0, validationObject, setValidationObject, e.currentTarget.value);
                        }}
                    />
                    {errorList[0] && <p style={{ color: 'red' }}> Fyll inn tekst her </p>}
                </Col>
                <Col span={6}></Col>
                <Col span={1} style={{ float: 'right' }}>
                    <Tooltip title={isInfo ? 'Flytt informasjon' : 'Flytt spørsmål'}>
                        <Button
                            id={'stealFocus_' + questionId}
                            style={{
                                zIndex: 1,
                                color: 'var(--primary-1)',
                                float: 'right',
                            }}
                            type="link"
                            shape="circle"
                            {...provided.dragHandleProps}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path
                                    fill="var(--primary-1)"
                                    d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
                                />
                            </svg>
                        </Button>
                    </Tooltip>
                </Col>
            </Row>
            {!state.questions[questionId].collapsed && (
                <>
                    <Row>
                        <Col span={17} style={{ padding: '12px 0' }}>
                            <Row className="standard">
                                <Col span={24}>
                                    <Checkbox
                                        checked={localQuestion.isRequired}
                                        onChange={(e) =>
                                            updateStore({
                                                isRequired: e.target.checked,
                                            })
                                        }
                                    >
                                        Spørsmålet skal være obligatorisk.
                                    </Checkbox>
                                </Col>
                            </Row>
                            <Row className="standard">
                                <Col span={24}>
                                    <p
                                        style={{
                                            float: 'left',
                                            padding: '5px 10px 0 0',
                                        }}
                                    >
                                        Velg type spørsmål:{' '}
                                    </p>
                                    <Select
                                        className={errorList[1] ? 'field-error' : ''}
                                        defaultValue={localQuestion.answerType}
                                        style={{
                                            width: '200px',
                                            float: 'left',
                                        }}
                                        onSelect={(value) => {
                                            updateStore({
                                                answerType: value,
                                            });
                                            if (value !== AnswerTypes.default) {
                                                const tmpObject = { ...validationObject };
                                                tmpObject.validationList[1] = true;
                                                tmpObject.visitedFields[1] = true;
                                            }
                                        }}
                                        placeholder="Trykk for å velge"
                                    >
                                        <Option value={AnswerTypes.boolean}>Avkrysningsboks</Option>
                                        <Option value={AnswerTypes.number}>Tall</Option>
                                        <Option value={AnswerTypes.text}>Tekst</Option>
                                        <Option value={AnswerTypes.time}>Dato/tid</Option>
                                        <Option value={AnswerTypes.choice}>Flervalg</Option>
                                    </Select>
                                    {errorList[1] && <p style={{ color: 'red' }}> Velg et svar alternativ</p>}
                                </Col>
                            </Row>
                        </Col>
                        <Col span={7} style={{ float: 'right', display: 'block' }}>
                            {buttons()}
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default QuestionBuilder;
