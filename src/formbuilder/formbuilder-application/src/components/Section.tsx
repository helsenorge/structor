import React, { useState, useEffect, useContext, ChangeEvent } from 'react';
import { Row, Col, Button, Tooltip, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import Question from './Question';
import {
    FormContext,
    addNewQuestion,
    removeQuestion,
    duplicateQuestion,
    updateSection,
} from '../store/FormStore';
import * as DND from 'react-beautiful-dnd';

const { TextArea } = Input;

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
    const [needsSections, setNeedsSections] = useState(false);
    // const [count, setCount] = useState(0);

    const { state, dispatch } = useContext(FormContext);

    const section = state.sections[sectionId];

    const [sectionTitle, setSectiontitle] = useState(
        state.sections[sectionId].sectionTitle,
    );
    function findPlaceholder() {
        const placeholderString = 'Seksjon ' + (index + 1) + '...';
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

    function dispatchAddQuestion() {
        dispatch(addNewQuestion(sectionId));
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
    function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
        setPlaceholder(e.currentTarget.value);
        if (section) {
            const temp = { ...section };
            temp.sectionTitle = e.target.value;
            dispatch(updateSection(sectionId, temp));
        }
    }

    function handleChange(value: string) {
        setSectiontitle(value);
        dispatch(updateSection(sectionId, value));
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
            {needsSections && (
                <div>
                    <Row justify="center" style={{ padding: '10px' }}>
                        <Col span={4} />
                        <Col span={13}>
                            <Input
                                placeholder={placeholder}
                                className="input-question"
                                size="large"
                            />
                        </Col>
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
                    <Row style={{ padding: '0 10px' }}>
                        <Col xs={0} lg={4}></Col>
                        <Col xs={24} lg={13}>
                            <TextArea
                                placeholder="Beskrivelse av seksjon..."
                                className="input-question"
                            ></TextArea>
                        </Col>
                        <Col xs={0} lg={4}></Col>
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
                </div>
            )}
            <Row>
                <Col span={24}>
                    <DND.Droppable droppableId={sectionId} type={'question'}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef}>
                                {!collapsed &&
                                    state.sections[sectionId].questionOrder.map(
                                        (questionId: string, index: number) => {
                                            const question =
                                                state.questions[questionId];
                                            return (
                                                <DND.Draggable
                                                    key={'drag' + questionId}
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
                                                                questionId={
                                                                    question.id
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
