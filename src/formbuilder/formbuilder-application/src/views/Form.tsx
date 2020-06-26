import React, { useState, useContext } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/commonComponents/NavBar';
import Section from '../components/Section';
import { FormContext, addNewSection, removeSection } from '../store/FormStore';
import * as DND from 'react-beautiful-dnd';
import './Form.css';
import ISection from '../types/ISection';

function CreateForm(): JSX.Element {
    const [i, setI] = useState(0);
    const { state, dispatch } = useContext(FormContext);

    const [dragIndex, setDragIndex] = useState(-1);

    function dispatchAddNewSection(index?: number) {
        setI(i + 1);
        const newSectionAction = addNewSection();
        dispatch(addNewSection());
        // try {
        //     if (index && !state.sections[index]) {
        //         dispatch(addNewSection(index));
        //     } else {
        //         dispatch(addNewSection(i + 1));
        //     }
        // } catch (e) {
        //     console.log(e);
        // }
    }

    function dispatchRemoveSection(index: number) {
        dispatch(removeSection(index));
    }

    function onDragEnd(result: DND.DropResult) {
        setDragIndex(-1);
        if (!result.destination) return;
        const sourceIndex = state.sections[result.source.index].id;
        const destIndex = state.sections[result.destination.index].id;

        if (result.type === 'section') {
            const tmpOldSection = state.sections[sourceIndex];
            tmpOldSection.id = destIndex;
            const tmpNewSection = state.sections[destIndex];
            tmpNewSection.id = sourceIndex;
            // dispatch(addSection(destIndex, tmpOldSection));
            // dispatch(addSection(sourceIndex, tmpNewSection));
        }
        console.log(state);
    }

    function onDragStart(startResponder: DND.DragStart) {
        console.log(state);
        // setDragIndex(state.sections[startResponder.source.index].id);
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
                                                    key={
                                                        'dragSection' +
                                                        section.id
                                                    }
                                                    draggableId={
                                                        'section' + section.id
                                                    }
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
                                                                key={
                                                                    'section' +
                                                                    section.id
                                                                }
                                                                section={
                                                                    section
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
