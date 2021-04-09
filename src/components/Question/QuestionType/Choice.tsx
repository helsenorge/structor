import React, { useContext } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableProvidedDragHandleProps,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd';
import {
    addEmptyOptionToAnswerOptionArray,
    removeOptionFromAnswerOptionArray,
    reorderPositions,
    updateAnswerOption,
    updateAnswerOptionCode,
    updateAnswerOptionSystem,
} from '../../../helpers/answerOptionHelper';

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import Btn from '../../Btn/Btn';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { checkboxExtension } from '../../../helpers/QuestionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import AnswerOption from '../../AnswerOption/AnswerOption';
import SystemField from '../../FormField/SystemField';

type Props = {
    item: QuestionnaireItem;
};

const Choice = ({ item }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchExtentionUpdate = () => {
        if (item.extension && item.extension.length > 0) {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, []));
        } else {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, checkboxExtension));
        }
    };

    const dispatchUpdateItem = (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | undefined,
    ) => {
        dispatch(updateItemAction(item.linkId, name, value));
    };

    const handleChangeSystem = (system: string) => {
        const alteredAnswerOption = updateAnswerOptionSystem(item.answerOption || [], system);
        dispatchUpdateItem(IItemProperty.answerOption, alteredAnswerOption);
    };

    const renderAnswerOptionItem = (
        answerOption: QuestionnaireItemAnswerOption,
        handleDrag?: DraggableProvidedDragHandleProps,
        count?: number,
    ): JSX.Element => {
        return (
            <AnswerOption
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
                deleteItem={() => {
                    const newArray = removeOptionFromAnswerOptionArray(
                        item.answerOption || [],
                        answerOption.valueCoding?.id || '',
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                answerOption={answerOption}
                handleDrag={handleDrag}
                showDelete={!!count && count > 2}
            />
        );
    };

    const renderAnswerOption = () => {
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
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
                                                {renderAnswerOptionItem(
                                                    answerOption,
                                                    providedDrag.dragHandleProps,
                                                    item.answerOption?.length,
                                                )}
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

    return (
        <>
            <SystemField
                value={
                    item.answerOption && item.answerOption.length > 0 ? item.answerOption[0]?.valueCoding?.system : ''
                }
                onBlur={(event) => handleChangeSystem(event.target.value)}
            />
            <div className="form-field">
                <SwitchBtn
                    label="Flere valg mulig"
                    onChange={() => dispatchExtentionUpdate()}
                    initial
                    value={item.extension !== undefined && item.extension.length > 0}
                />
                {item.answerOption && item.answerOption?.length > 0 && renderAnswerOption()}
            </div>
            {!item.answerValueSet && (
                <div className="center-text">
                    <Btn
                        title="+ Legg til alternativ"
                        type="button"
                        onClick={() => {
                            const newArray = addEmptyOptionToAnswerOptionArray(item.answerOption || []);
                            dispatchUpdateItem(IItemProperty.answerOption, newArray);
                        }}
                        variant="secondary"
                        size="small"
                    />
                </div>
            )}
        </>
    );
};

export default Choice;
