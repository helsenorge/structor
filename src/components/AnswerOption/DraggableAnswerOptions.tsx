import React from 'react';
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
import {
    removeExtensionFromSingleAnswerOption,
    removeOptionFromAnswerOptionArray,
    reorderPositions,
    updateAnswerOption,
    updateAnswerOptionCode,
    updateAnswerOptionExtension,
} from '../../helpers/answerOptionHelper';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../types/fhir';
import { IExtentionType, IItemProperty } from '../../types/IQuestionnareItemType';
import AnswerOption from './AnswerOption';

interface DraggableAnswerOptionsProps {
    item: QuestionnaireItem;
    dispatchUpdateItem: (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | undefined,
    ) => void;
}

const DraggableAnswerOptions = ({ item, dispatchUpdateItem }: DraggableAnswerOptionsProps): JSX.Element => {
    const handleChange = (result: DropResult) => {
        if (!result.source || !result.destination || !result.draggableId) {
            return;
        }

        const fromIndex = result.source.index;
        const toIndex = result.destination.index;

        if (fromIndex !== toIndex) {
            const tempList = item.answerOption ? [...item.answerOption] : [];
            dispatchUpdateItem(IItemProperty.answerOption, reorderPositions(tempList, toIndex, fromIndex));
        }
    };

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? 'lightblue' : 'transparent',
    });

    const getItemStyle = (
        isDragging: boolean,
        draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
    ): React.CSSProperties => ({
        userSelect: 'none',
        background: isDragging ? 'lightgreen' : 'transparent',
        cursor: 'pointer',
        ...draggableStyle,
    });

    return (
        <DragDropContext onDragEnd={handleChange}>
            <Droppable droppableId={`droppable-${item.linkId}-answer-options`} type="stuff">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                        {item.answerOption?.map((answerOption, index) => {
                            return (
                                <Draggable
                                    key={answerOption.valueCoding?.id}
                                    draggableId={answerOption.valueCoding?.id || '1'}
                                    index={index}
                                >
                                    {(providedDrag, snapshotDrag) => (
                                        <div
                                            ref={providedDrag.innerRef}
                                            {...providedDrag.draggableProps}
                                            style={getItemStyle(
                                                snapshotDrag.isDragging,
                                                providedDrag.draggableProps.style,
                                            )}
                                        >
                                            <AnswerOption
                                                item={item}
                                                changeDisplay={(event) => {
                                                    const newArray = updateAnswerOption(
                                                        item.answerOption || [],
                                                        answerOption.valueCoding?.id || '',
                                                        event.target.value,
                                                    );
                                                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                                                }}
                                                changeCode={(event) => {
                                                    const newArray = updateAnswerOptionCode(
                                                        item.answerOption || [],
                                                        answerOption.valueCoding?.id || '',
                                                        event.target.value,
                                                    );
                                                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                                                }}
                                                changeOrdinalValueExtension={(event) => {
                                                    if (event.target.value === '') {
                                                        const newArray = removeExtensionFromSingleAnswerOption(
                                                            item.answerOption || [],
                                                            answerOption.valueCoding?.id || '',
                                                            IExtentionType.ordinalValue,
                                                        );
                                                        dispatchUpdateItem(IItemProperty.answerOption, newArray);
                                                    } else {
                                                        const newArray = updateAnswerOptionExtension(
                                                            item.answerOption || [],
                                                            answerOption.valueCoding?.id || '',
                                                            event.target.value,
                                                        );
                                                        dispatchUpdateItem(IItemProperty.answerOption, newArray);
                                                    }
                                                }}
                                                deleteItem={() => {
                                                    const newArray = removeOptionFromAnswerOptionArray(
                                                        item.answerOption || [],
                                                        answerOption.valueCoding?.id || '',
                                                    );
                                                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                                                }}
                                                answerOption={answerOption}
                                                handleDrag={providedDrag.dragHandleProps || undefined}
                                                showDelete={
                                                    !!item.answerOption?.length && item.answerOption?.length > 2
                                                }
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableAnswerOptions;
