import React, { useState, useContext } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/commonComponents/NavBar';
import Section from '../components/Section';
import {
    FormContext,
    addNewSection,
    removeSection,
    swapSection,
    swapQuestion,
} from '../store/FormStore';
import * as DND from 'react-beautiful-dnd';
import './Form.css';

function CreateForm(): JSX.Element {
    const [i, setI] = useState(0);
    const { state, dispatch } = useContext(FormContext);

    const [dragIndex, setDragIndex] = useState(-1);

    function dispatchAddNewSection(index?: number) {
        setI(i + 1);
        //const newSectionAction = addNewSection();
        dispatch(addNewSection());
    }

    function dispatchRemoveSection(index: number) {
        dispatch(removeSection(index));
    }

    function onDragEnd(result: DND.DropResult) {
        setDragIndex(-1);
        if (!result.destination) return;
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (result.type === 'section') {
            dispatch(swapSection(sourceIndex, destIndex));
        } else if (result.type === 'question') {
            const sourceParentId = result.source.droppableId;
            const destParentId = result.destination.droppableId;
            dispatch(
                swapQuestion(
                    sourceParentId,
                    sourceIndex,
                    destParentId,
                    destIndex,
                ),
            );
        }
    }

    function onDragStart(startResponder: DND.DragStart) {
        if (startResponder.type === 'section')
            setDragIndex(startResponder.source.index);
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <NavBar />
                </Col>
            </Row>
            <Row style={{ margin: '61px 0 0 0' }}>
                <DND.DragDropContext
                    onDragEnd={onDragEnd}
                    onBeforeDragStart={onDragStart}
                >
                    <DND.Droppable droppableId="section" type="section">
                        {(provided, snapshot) => (
                            <Col span={24}>
                                <div
                                    ref={provided.innerRef}
                                    style={{
                                        display: 'inline',
                                        position: 'relative',
                                    }}
                                >
                                    {state.sectionOrder.map(
                                        (sectionId: string, index: number) => {
                                            const section =
                                                state.sections[sectionId];
                                            return (
                                                <DND.Draggable
                                                    key={section.id}
                                                    draggableId={section.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                        >
                                                            <Section
                                                                key={section.id}
                                                                sectionId={
                                                                    sectionId
                                                                }
                                                                removeSection={() =>
                                                                    dispatchRemoveSection(
                                                                        index,
                                                                    )
                                                                }
                                                                provided={
                                                                    provided
                                                                }
                                                                collapsed={
                                                                    index ===
                                                                    dragIndex
                                                                }
                                                                index={index}
                                                            />
                                                        </div>
                                                    )}
                                                </DND.Draggable>
                                            );
                                        },
                                    )}
                                </div>
                                {provided.placeholder}
                            </Col>
                        )}
                    </DND.Droppable>
                </DND.DragDropContext>
            </Row>
            <Row>
                <Col span={24}>
                    <div
                        style={{
                            margin: '10px',
                            display: 'inline-block',
                        }}
                    >
                        <Button
                            className="section-button"
                            type="dashed"
                            ghost
                            size="large"
                            onClick={() => dispatchAddNewSection()}
                        >
                            Legg til ny seksjon
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CreateForm;
