import React, { useState, useContext } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/commonComponents/NavBar';
import Section from '../components/Section';
import TitleAndDescription from '../components/TitleAndDescription';
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
    const { state, dispatch } = useContext(FormContext);
    const [collapsedSection, setCollapsedSection] = useState('A');

    // Disabled because it's throwing warnings when it can't find the drag handle for the first section if it's only 1 section.
    // Can't be fixed with conditional rendering, because it will display a warning for every new section we add if we display the component conditionally.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window['__react-beautiful-dnd-disable-dev-warnings'] = true;

    function dispatchAddNewSection() {
        dispatch(addNewSection());
    }

    function dispatchRemoveSection(index: number) {
        if (window.confirm('Vil du slette denne seksjonen?'))
            dispatch(removeSection(index));
    }

    function dispatchDuplicateSection(index: number, id: string) {
        dispatch(duplicateSection(index, id));
    }

    function onDragEnd(result: DND.DropResult) {
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
        const focusButton = document.getElementById('MoveSectionButton');
        if (focusButton) {
            focusButton.focus();
        }
        setCollapsedSection(startResponder.draggableId);
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <NavBar />
                </Col>
            </Row>
            <Row style={{ margin: '61px 0 0 0' }}>
                <Col span={24}>
                    <TitleAndDescription />
                </Col>
            </Row>
            <Row>
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
                            boxShadow: '0 4px 8px 0 #c7c7c7c7',
                            borderRadius: '2px',
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
