import React, { useState, useContext } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/commonComponents/NavBar';
import Section from '../components/Section';
import {
    FormContext,
    addNewSection,
    duplicateSection,
    removeSection,
    swapSection,
    swapQuestion,
} from '../store/FormStore';
import * as DND from 'react-beautiful-dnd';
import './Form.css';
import ISection from '../types/ISection';

function CreateForm(): JSX.Element {
    const [i, setI] = useState(0);
    const { state, dispatch } = useContext(FormContext);

    const [dragIndex, setDragIndex] = useState(-1);

    const [collapsedSection, setCollapsedSection] = useState('A');

    function dispatchAddNewSection(index?: number) {
        dispatch(addNewSection());
    }

    function dispatchRemoveSection(index: number) {
        dispatch(removeSection(index));
    }

    function dispatchDuplicateSection(index: number, id: string) {
        dispatch(duplicateSection(index, id));
    }

    function onDragEnd(result: DND.DropResult) {
        setDragIndex(-1);
        if (!result.destination) return;
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        if (result.type === 'section') {
            dispatch(swapSection(sourceIndex, destIndex));
            setCollapsedSection('A');
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

    function onBeforeCapture(startResponder: DND.BeforeCapture) {
        setCollapsedSection(startResponder.draggableId);
    }

    type memoSection = {
        sectionId: string;
        index: number;
        provided: DND.DraggableProvided;
    };

    function compareSections(
        prevSection: memoSection,
        nextSection: memoSection,
    ) {
        return prevSection.index === nextSection.index;
    }

    // const SectionMemo = React.memo((props: memoSection) => {
    //     return (
    //         <Section
    //             key={props.sectionId}
    //             sectionId={props.sectionId}
    //             removeSection={() => dispatchRemoveSection(props.index)}
    //             provided={props.provided}
    //             collapsed={props.sectionId === collapsedSection}
    //             index={props.index}
    //         />
    //     );
    // }, compareSections);

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
                    onBeforeCapture={onBeforeCapture}
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
                                            return (
                                                <DND.Draggable
                                                    key={'drag' + sectionId}
                                                    draggableId={sectionId}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                        >
                                                            {/* <SectionMemo
                                                                key={sectionId}
                                                                sectionId={
                                                                    sectionId
                                                                }
                                                                index={index}
                                                                provided={
                                                                    provided
                                                                }
                                                            /> */}
                                                            <Section
                                                                key={sectionId}
                                                                sectionId={
                                                                    sectionId
                                                                }
                                                                duplicateSection={() =>
                                                                    dispatchDuplicateSection(
                                                                        index,
                                                                        sectionId,
                                                                    )
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
                                                                    sectionId ===
                                                                    collapsedSection
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
