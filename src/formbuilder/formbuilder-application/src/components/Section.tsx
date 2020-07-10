import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Tooltip, Input, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import QuestionWrapper from './QuestionWrapper';
import { FormContext, addNewQuestion, removeQuestion, duplicateQuestion, updateSection } from '../store/FormStore';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import * as DND from 'react-beautiful-dnd';
import AnswerTypes from '../types/IAnswer';

const { TextArea } = Input;

type SectionProps = {
    sectionId: string;
    duplicateSection: () => void;
    removeSection: () => void;
    provided?: DND.DraggableProvided;
    collapsed: boolean;
    sectionIndex: number;
};

function Section({
    sectionId,
    duplicateSection,
    removeSection,
    provided,
    collapsed,
    sectionIndex,
}: SectionProps): JSX.Element {
    const [placeholder, setPlaceholder] = useState('Tittel...');
    const [needsSections, setNeedsSections] = useState(false);
    const [collapsedSection, setCollapsedSection] = useState(false);

    // const [count, setCount] = useState(0);

    const { state, dispatch } = useContext(FormContext);

    function findPlaceholder() {
        const placeholderString = 'Seksjon ' + (sectionIndex + 1) + '...';
        setPlaceholder(placeholderString);
        if (Object.keys(state.sections).length > 1) {
            setNeedsSections(true);
        } else {
            setNeedsSections(false);
        }
    }

    useEffect(() => {
        findPlaceholder();
    });

    function dispatchAddQuestion(isInfo: boolean) {
        dispatch(addNewQuestion(sectionId, isInfo));
    }

    function dispatchDuplicateQuestion(sectionId: string, questionIndex: number, questionId: string) {
        dispatch(duplicateQuestion(sectionId, questionIndex, questionId));
    }

    function dispatchRemoveQuestion(questionIndex: number) {
            dispatch(removeQuestion(questionIndex, state.sections[sectionId].id));
    }

    function localUpdate(attribute: { description?: string; sectionTitle?: string }) {
        const temp = { ...state.sections[sectionId] };
        if (attribute.description !== undefined) temp.description = attribute.description;
        if (attribute.sectionTitle !== undefined) temp.sectionTitle = attribute.sectionTitle;
        dispatch(updateSection(temp));
    }

    return (
        <div
            style={{
                backgroundColor: 'var(--color-base-1)',
            }}
            className="wrapper"
        >
            {needsSections && (
                <div
                    style={{
                        padding: '30px',
                        backgroundColor: 'var(--color-base-3)',
                    }}
                >
                    <Row>
                        <Col xs={1} lg={1}>
                            <Tooltip title={collapsedSection ? 'Utvid seksjon' : 'Kollaps seksjon'}>
                                <Button
                                    id="stealFocus"
                                    style={{
                                        zIndex: 1,
                                        color: 'grey',
                                        float: 'left',
                                    }}
                                    type="link"
                                    shape="circle"
                                    icon={collapsedSection ? <DownOutlined /> : <UpOutlined />}
                                    onClick={() => setCollapsedSection(!collapsedSection)}
                                />
                            </Tooltip>
                        </Col>
                        <Col xs={2} lg={3} style={{ padding: '5px 10px' }}>
                            <h3
                                style={{
                                    float: 'right',
                                    color: 'grey',
                                }}
                            >
                                {String(sectionIndex + 1)}
                            </h3>
                        </Col>
                        <Col
                            xs={20}
                            lg={14}
                            style={{
                                width: '100%',
                            }}
                        >
                            <Input
                                placeholder={placeholder}
                                className="input-question"
                                size="large"
                                defaultValue={state.sections[sectionId].sectionTitle}
                                onBlur={(e) =>
                                    localUpdate({
                                        sectionTitle: e.target.value,
                                    })
                                }
                            />
                        </Col>
                        <Col md={0} lg={5}></Col>
                        <Col span={1}>
                            <Tooltip title="Flytt seksjon">
                                {provided && (
                                    <Button
                                        id="stealFocus"
                                        {...provided.dragHandleProps}
                                        style={{
                                            zIndex: 1,
                                            color: 'var(--primary-1)',
                                            float: 'right',
                                        }}
                                        type="link"
                                        shape="circle"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path d="M0 0h24v24H0V0z" fill="none" />
                                            <path
                                                fill="var(--primary-1)"
                                                d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
                                            />
                                        </svg>
                                    </Button>
                                )}
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop: '5px' }}>
                        <Col xs={3} lg={4}></Col>
                        <Col xs={15} lg={14}>
                            <TextArea
                                placeholder="Beskrivelse av seksjon..."
                                className="input-question"
                                defaultValue={state.sections[sectionId].description}
                                onBlur={(e) => localUpdate({ description: e.target.value })}
                                rows={3}
                            ></TextArea>
                        </Col>
                        <Col span={6}>
                            <Row
                                style={{
                                    textAlign: 'right',
                                }}
                            >
                                <Col span={24}>
                                    <Popconfirm
                                        title="Vil du slette denne seksjonen?"
                                        onConfirm={() => removeSection()}
                                        okText="Ja"
                                        cancelText="Nei"
                                    >
                                        <Button
                                            style={{
                                                zIndex: 1,
                                                color: 'var(--primary-1)',
                                                marginLeft: '10px',
                                            }}
                                            icon={<DeleteOutlined />}
                                            type="default"
                                        >
                                            Slett seksjon
                                        </Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Row style={{ textAlign: 'right', paddingTop: '10px' }}>
                                <Col span={24}>
                                    <Button
                                        style={{
                                            zIndex: 1,
                                            color: 'var(--primary-1)',
                                            marginLeft: '10px',
                                            float: 'right',
                                        }}
                                        icon={<CopyOutlined />}
                                        type="default"
                                        onClick={() => duplicateSection()}
                                    >
                                        Dupliser seksjon
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <hr
                            key="hrTitle"
                            style={{
                                margin: 0,
                                color: 'black',
                                width: '100%',
                                border: '0.2px solid var(--color-base-3)',
                            }}
                        />
                    </Row>
                </div>
            )}
            {!collapsedSection && (
                <>
                    <Row>
                        <Col span={24}>
                            <DND.Droppable droppableId={sectionId} type={'question'}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}>
                                        {!collapsed &&
                                            state.sections[sectionId].questionOrder.map(
                                                (questionId: string, index: number) => {
                                                    const question = state.questions[questionId];
                                                    return (
                                                        <DND.Draggable
                                                            key={'drag' + questionId}
                                                            draggableId={questionId}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                >
                                                                    <QuestionWrapper
                                                                        key={question.id}
                                                                        questionId={question.id}
                                                                        cronologicalID={[sectionIndex, index]}
                                                                        duplicateQuestion={() =>
                                                                            dispatchDuplicateQuestion(
                                                                                sectionId,
                                                                                index,
                                                                                questionId,
                                                                            )
                                                                        }
                                                                        removeQuestion={() =>
                                                                            dispatchRemoveQuestion(index)
                                                                        }
                                                                        provided={provided}
                                                                        isInfo={
                                                                            question.answerType === AnswerTypes.info
                                                                        }
                                                                    />
                                                                    <hr
                                                                        key={'hr' + question.id}
                                                                        style={{
                                                                            color: 'black',
                                                                            width: '100%',
                                                                            border: '0.2px solid var(--color-base-3)',
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </DND.Draggable>
                                                    );
                                                },
                                            )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </DND.Droppable>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col span={24} style={{ margin: '10px', padding: '15px' }}>
                            <Button
                                style={{
                                    backgroundColor: 'var(--primary-1)',
                                    borderColor: 'var(--primary-1)',
                                    margin: '0 10px',
                                }}
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => dispatchAddQuestion(false)}
                            >
                                Legg til nytt spørsmål
                            </Button>
                            <Button
                                style={{
                                    color: 'var(--primary-1)',
                                    margin: '0 10px',
                                }}
                                icon={<PlusOutlined />}
                                onClick={() => dispatchAddQuestion(true)}
                                type="default"
                            >
                                Legg til informasjon
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default Section;
