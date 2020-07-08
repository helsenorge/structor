import React, { useState, useEffect, useContext, ChangeEvent } from 'react';
import { Row, Col, Button, Tooltip, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import QuestionWrapper from './QuestionWrapper';
import {
    FormContext,
    addNewQuestion,
    removeQuestion,
    duplicateQuestion,
    updateSection,
} from '../store/FormStore';
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

    const [localSection, setLocalSection] = useState(state.sections[sectionId]);

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

    function dispatchDuplicateQuestion(
        sectionId: string,
        questionIndex: number,
        questionId: string,
    ) {
        dispatch(duplicateQuestion(sectionId, questionIndex, questionId));
    }

    function dispatchRemoveQuestion(questionIndex: number) {
        if (window.confirm('Vil du slette dette spørsmålet?'))
            dispatch(removeQuestion(questionIndex, localSection.id));
    }

    function localUpdate(attribute: {
        updateState?: boolean;
        description?: string;
        sectionTitle?: string;
    }) {
        const temp = { ...localSection };
        if (attribute.description) temp.description = attribute.description;
        if (attribute.sectionTitle) temp.sectionTitle = attribute.sectionTitle;

        setLocalSection(temp);
        if (attribute.updateState) dispatch(updateSection(localSection));
    }

    return (
        <div
            style={{
                margin: '10px',
                backgroundColor: 'var(--color-base-1)',
                width: '95%',
                display: 'inline-block',
                boxShadow: '0 4px 8px 0 #c7c7c7c7',
                borderRadius: '2px',
            }}
        >
            {needsSections && (
                <div
                    style={{
                        padding: '10px',
                        backgroundColor: 'var(--color-base-3',
                    }}
                >
                    <Row style={{ margin: '0 10px 10px 10px' }}>
                        <Col xs={0} lg={4}>
                            {String(sectionIndex + 1)}
                            <Tooltip
                                title={
                                    collapsedSection
                                        ? 'Utvid seksjon'
                                        : 'Kollaps seksjon'
                                }
                            >
                                <Button
                                    id="CollapseQuestionButton"
                                    style={{
                                        zIndex: 1,
                                        color: 'var(--primary-1)',
                                        float: 'left',
                                    }}
                                    size="small"
                                    type="link"
                                    shape="circle"
                                    icon={
                                        collapsedSection ? (
                                            <DownOutlined />
                                        ) : (
                                            <UpOutlined />
                                        )
                                    }
                                    onClick={() =>
                                        setCollapsedSection(!collapsedSection)
                                    }
                                />
                            </Tooltip>
                        </Col>
                        <Col
                            xs={24}
                            lg={13}
                            span={13}
                            style={{
                                width: '100%',
                            }}
                        >
                            <Input
                                placeholder={placeholder}
                                className="input-question"
                                size="large"
                                value={localSection.sectionTitle}
                                onChange={(e) => {
                                    localUpdate({
                                        sectionTitle: e.target.value,
                                    });
                                }}
                                onBlur={() =>
                                    localUpdate({ updateState: true })
                                }
                            />
                        </Col>
                        <Col
                            sm={7}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                style={{
                                    zIndex: 1,
                                    color: 'var(--primary-1)',
                                    marginLeft: '10px',
                                }}
                                icon={<CopyOutlined />}
                                type="default"
                                onClick={() => duplicateSection()}
                            >
                                Dupliser seksjon
                            </Button>
                            <Button
                                style={{
                                    zIndex: 1,
                                    color: 'var(--primary-1)',
                                    marginLeft: '10px',
                                }}
                                icon={<DeleteOutlined />}
                                type="default"
                                onClick={() => removeSection()}
                            >
                                Slett seksjon
                            </Button>
                            <Tooltip title="Flytt seksjon">
                                {provided && (
                                    <Button
                                        {...provided.dragHandleProps}
                                        style={{
                                            zIndex: 1,
                                            color: 'var(--primary-1)',
                                        }}
                                        size="large"
                                        type="link"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path
                                                d="M0 0h24v24H0V0z"
                                                fill="none"
                                            />
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
                    <Row style={{ padding: '0 10px' }}>
                        <Col xs={0} lg={4}></Col>
                        <Col xs={24} lg={13}>
                            <TextArea
                                placeholder="Beskrivelse av seksjon..."
                                className="input-question"
                                value={localSection.description}
                                onChange={(e) => {
                                    localUpdate({
                                        description: e.target.value,
                                    });
                                }}
                                onBlur={() =>
                                    localUpdate({ updateState: true })
                                }
                            ></TextArea>
                        </Col>
                        <Col xs={0} lg={4}></Col>
                    </Row>
                </div>
            )}
            {!collapsedSection && (
                <>
                    <Row>
                        <hr
                            key="hrTitle"
                            style={{
                                margin: 0,
                                color: 'black',
                                width: '100%',
                                border: '0.2px solid var(--color-base-2)',
                            }}
                        />
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DND.Droppable
                                droppableId={sectionId}
                                type={'question'}
                            >
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}>
                                        {!collapsed &&
                                            state.sections[
                                                sectionId
                                            ].questionOrder.map(
                                                (
                                                    questionId: string,
                                                    index: number,
                                                ) => {
                                                    const question =
                                                        state.questions[
                                                            questionId
                                                        ];
                                                    return (
                                                        <DND.Draggable
                                                            key={
                                                                'drag' +
                                                                questionId
                                                            }
                                                            draggableId={
                                                                questionId
                                                            }
                                                            index={index}
                                                        >
                                                            {(
                                                                provided,
                                                                snapshot,
                                                            ) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                >
                                                                    <QuestionWrapper
                                                                        key={
                                                                            question.id
                                                                        }
                                                                        questionId={
                                                                            question.id
                                                                        }
                                                                        cronologicalID={[
                                                                            sectionIndex,
                                                                            index,
                                                                        ]}
                                                                        duplicateQuestion={() =>
                                                                            dispatchDuplicateQuestion(
                                                                                sectionId,
                                                                                index,
                                                                                questionId,
                                                                            )
                                                                        }
                                                                        removeQuestion={() =>
                                                                            dispatchRemoveQuestion(
                                                                                index,
                                                                            )
                                                                        }
                                                                        provided={
                                                                            provided
                                                                        }
                                                                        isInfo={
                                                                            question.answerType ===
                                                                            AnswerTypes.info
                                                                        }
                                                                    />
                                                                    <hr
                                                                        key={
                                                                            'hr' +
                                                                            question.id
                                                                        }
                                                                        style={{
                                                                            color:
                                                                                'black',
                                                                            width:
                                                                                '100%',
                                                                            border:
                                                                                '0.2px solid var(--color-base-2)',
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
                        <Col span={10} style={{ margin: '10px' }}>
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
