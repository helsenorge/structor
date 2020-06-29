import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Tooltip, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import Question from './Question';
import {
    FormContext,
    addNewQuestion,
    removeQuestion,
    duplicateQuestion,
} from '../store/FormStore';
import ISection from '../types/ISection';
import * as DND from 'react-beautiful-dnd';
import Converter from './Converter'

type SectionProps = {
    sectionId: string;
    duplicateSection: () => void;
    removeSection: () => void;
    provided: DND.DraggableProvided;
    collapsed: boolean;
    index: number;
};

function Section({
    sectionId,
    duplicateSection,
    removeSection,
    provided,
    collapsed,
    index,
}: SectionProps): JSX.Element {
    const [placeholder, setPlaceholder] = useState('Tittel...');
    const [isSection, setIsSection] = useState(true);
    // const [count, setCount] = useState(0);

    const { state, dispatch } = useContext(FormContext);

    const section = state.sections[sectionId];

    function findPlaceholder() {
        if (index === 0) {
            // setIsSection(false);
            setPlaceholder('Tittel...');
            return;
        }
        setIsSection(true);
        setPlaceholder('Seksjonstittel...');
    }

    useEffect(() => {
        findPlaceholder();
    });

    function dispatchAddQuestion() {
        dispatch(addNewQuestion(section.id));
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
            dispatch(removeQuestion(questionIndex, section.id));
    }

    return (
        <div
            style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: 'var(--color-base-1)',
                width: '95%',
                display: 'inline-block',
            }}
        >
            <Row justify="center">
                <Col span={2} />
                <Col span={14}>
                    <Input
                        placeholder={placeholder}
                        className="input-question"
                        size="large"
                    />
                </Col>
                <Col span={1} />
                <Col span={3}>
                    <Button
                        style={{
                            zIndex: 1,
                            color: 'var(--primary-1)',
                            margin: '0 10px',
                        }}
                        size="large"
                        icon={<CopyOutlined />}
                        type="default"
                        onClick={() => duplicateSection()}
                    >
                        Dupliser seksjon
                    </Button>
                </Col>
                <Col span={3}>
                    <Button
                        style={{ zIndex: 1, color: 'var(--primary-1)' }}
                        size="large"
                        icon={<DeleteOutlined />}
                        type="default"
                        onClick={() => removeSection()}
                    >
                        Slett seksjon
                    </Button>
                </Col>
                <Col span={1}>
                    <Tooltip title="Flytt seksjon">
                        <Button
                            {...provided.dragHandleProps}
                            style={{ zIndex: 1, color: 'var(--primary-1)' }}
                            size="large"
                            type="link"
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
                    </Tooltip>
                </Col>
            </Row>
            <Row>
                <hr
                    key="hrTitle"
                    style={{
                        color: 'black',
                        width: '100%',
                        border: '0.2px solid var(--color-base-2)',
                    }}
                />
            </Row>
            <Row>
                <Col span={24}>
                    <DND.Droppable droppableId={section.id} type={'question'}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef}>
                                {!collapsed &&
                                    section.questionOrder.map(
                                        (questionId: string, index: number) => {
                                            const question =
                                                state.questions[questionId];
                                            return (
                                                <DND.Draggable
                                                    key={questionId}
                                                    draggableId={questionId}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                        >
                                                            <Question
                                                                key={
                                                                    question.id
                                                                }
                                                                question={
                                                                    question
                                                                }
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
            <Row>
                <Col span={24} style={{ margin: '10px' }}>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary-1)',
                            borderColor: 'var(--primary-1)',
                        }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={dispatchAddQuestion}
                    >
                        Legg til nytt spørsmål
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default Section;
