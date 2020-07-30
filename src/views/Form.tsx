import React, { useState, useContext, useEffect } from 'react';
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
import '../index.css';
import { useTranslation } from 'react-i18next';

function CreateForm(): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [collapsedSection, setCollapsedSection] = useState('A');
    const [hasSections, setHasSections] = useState(false);
    const { t } = useTranslation();

    function dispatchAddNewSection() {
        setHasSections(true);
        dispatch(addNewSection());
    }

    function dispatchRemoveSection(index: number) {
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
            dispatch(swapQuestion(sourceParentId, sourceIndex, destParentId, destIndex));
        }
    }
    function onBeforeCapture(startResponder: DND.BeforeCapture) {
        const focusButton = document.getElementById('stealFocus_' + startResponder.draggableId);
        if (focusButton) {
            focusButton.focus();
        }
        setCollapsedSection(startResponder.draggableId);
    }

    useEffect(() => {
        if (state.sectionOrder.length > 1) setHasSections(true);
    }, [state.sectionOrder.length]);

    return (
        <div>
            <Row>
                <Col span={24}>
                    <NavBar />
                </Col>
            </Row>
            <Row style={{ margin: '61px 0 0 0' }} justify="center">
                <Col xl={16} lg={18} md={22} xs={24}>
                    <TitleAndDescription />
                </Col>
            </Row>
            <Row justify="center">
                <DND.DragDropContext onDragEnd={onDragEnd} onBeforeCapture={onBeforeCapture}>
                    <DND.Droppable droppableId="section" type="section">
                        {(provided) => (
                            <Col xl={16} lg={18} md={22} xs={24}>
                                <div
                                    ref={provided.innerRef}
                                    style={{
                                        display: 'inline',
                                        position: 'relative',
                                    }}
                                >
                                    {state.sectionOrder.map((sectionId: string, index: number) => {
                                        return (
                                            <DND.Draggable
                                                key={'drag' + sectionId}
                                                draggableId={sectionId}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps}>
                                                        <Section
                                                            key={sectionId}
                                                            sectionId={sectionId}
                                                            valid={true}
                                                            duplicateSection={() =>
                                                                dispatchDuplicateSection(index, sectionId)
                                                            }
                                                            removeSection={() => dispatchRemoveSection(index)}
                                                            provided={provided}
                                                            collapsed={sectionId === collapsedSection}
                                                            sectionIndex={index}
                                                            hasSections={hasSections}
                                                        />
                                                    </div>
                                                )}
                                            </DND.Draggable>
                                        );
                                    })}
                                </div>
                                {provided.placeholder}
                            </Col>
                        )}
                    </DND.Droppable>
                </DND.DragDropContext>
            </Row>
            <Row justify="center">
                <Col xl={16} lg={18} md={22} xs={24}>
                    <div className="wrapper">
                        {!hasSections ? (
                            <Button
                                className="section-button"
                                type="dashed"
                                ghost
                                size="large"
                                onClick={() => {
                                    setHasSections(true);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                {t('Add sections')}
                            </Button>
                        ) : (
                            <Button
                                className="section-button"
                                type="dashed"
                                ghost
                                size="large"
                                onClick={() => dispatchAddNewSection()}
                            >
                                {t('Add section')}
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CreateForm;
