import React, { useContext } from 'react';
import { Input, Row, Col, Checkbox, Select, Tooltip, Button } from 'antd';
import './answerComponents/AnswerComponent.css';
import { FormContext, updateQuestion } from '../store/FormStore';
import IQuestion from '../types/IQuestion';
import * as DND from 'react-beautiful-dnd';
import AnswerTypes, { IChoice, INumber, IText, IBoolean, ITime, IAnswer, IInfo } from '../types/IAnswer';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

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
                        isDecimal: false,
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
                case AnswerTypes.info:
                    temp.answer = {
                        id: questionId,
                        info: '',
                        hasInfo: false,
                    } as IInfo;
                    break;
                default:
                    temp.answer = { id: questionId } as IAnswer;
                    break;
            }
        }
        dispatch(updateQuestion(temp));
    }

    return (
        <div style={{ backgroundColor: 'var(--color-base-1)' }}>
            <Row>
                <Col span={17} style={{ paddingRight: '5px' }}>
                    <Input
                        placeholder={localQuestion.placeholder}
                        defaultValue={localQuestion.questionText}
                        onBlur={(e) => {
                            updateStore({
                                questionText: e.target.value === undefined ? '' : e.target.value,
                            });
                        }}
                    />
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
                            className="icon-buttons"
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
                        <Col span={18} style={{ padding: '12px 0' }}>
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
                                        {t('Mandatory')}
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
                                        {t('Question type')}{' '}
                                    </p>
                                    <Select
                                        defaultValue={localQuestion.answerType}
                                        style={{
                                            width: '200px',
                                            float: 'left',
                                        }}
                                        onSelect={(value) => {
                                            updateStore({
                                                answerType: value,
                                            });
                                        }}
                                        placeholder={t('Choose type')}
                                    >
                                        <Option value={AnswerTypes.default} disabled>{t('Choose type')}</Option>
                                        <Option value={AnswerTypes.boolean}>{t('Yes/no')}</Option>
                                        <Option value={AnswerTypes.number}>{t('Number')}</Option>
                                        <Option value={AnswerTypes.text}>{t('Text')}</Option>
                                        <Option value={AnswerTypes.time}>{t('Date/time')}</Option>
                                        <Option value={AnswerTypes.choice}>{t('Single/multiple choice')}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6} style={{ float: 'right', display: 'block' }}>
                            {buttons()}
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default QuestionBuilder;
