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
    updateAnswerOption,
} from '../../../helpers/answerOptionHelper';

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import Btn from '../../Btn/Btn';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import RadioBtn from '../../RadioBtn/RadioBtn';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { checkboxExtension } from '../../../helpers/QuestionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import AnswerOption from '../../AnswerOption/AnswerOption';

type Props = {
    item: QuestionnaireItem;
};

const Choice = ({ item }: Props): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qContained } = state;

    const dispatchExtentionUpdate = () => {
        if (item.extension && item.extension.length > 0) {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, []));
        } else {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, checkboxExtension));
        }
    };

    const getContainedValueSetValues = (valueSetId: string): Array<{ system?: string; display?: string }> => {
        const valueSet = qContained?.find((x) => `#${x.id}` === valueSetId);
        if (valueSet && valueSet.compose && valueSet.compose.include && valueSet.compose.include[0].concept) {
            return valueSet.compose.include[0].concept.map((x) => {
                return { system: valueSet.compose?.include[0].system, display: x.display };
            });
        }
        return [];
    };

    const renderValueSetValues = (): JSX.Element => {
        return (
            <>
                {item.answerValueSet && item.answerValueSet.startsWith('#') && (
                    <div>
                        <p>Dette spørsmålet bruker følgende innebygde verdier, som ikke kan endres i skjemabyggeren:</p>
                        {getContainedValueSetValues(item.answerValueSet).map((x, index) => {
                            return (
                                <RadioBtn name={x.system} key={index} disabled showDelete={false} value={x.display} />
                            );
                        })}
                    </div>
                )}
                {item.answerValueSet && item.answerValueSet.startsWith('http') && (
                    <div>{`Dette spørsmålet henter verdier fra ${item.answerValueSet}`}</div>
                )}
            </>
        );
    };

    const dispatchUpdateItem = (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | undefined,
    ) => {
        dispatch(updateItemAction(item.linkId, name, value));
    };

    const renderAnswerOptionItem = (
        answerOption: QuestionnaireItemAnswerOption,
        index: number,
        handleDrag?: DraggableProvidedDragHandleProps,
        count?: number,
    ): JSX.Element => {
        return (
            <AnswerOption
                onChange={(event) => {
                    const newArray = updateAnswerOption(
                        item.answerOption || [],
                        answerOption.valueCoding?.code || '',
                        event.target.value,
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                deleteItem={() => {
                    const newArray = removeOptionFromAnswerOptionArray(
                        item.answerOption || [],
                        answerOption.valueCoding?.code || '',
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                answerOption={answerOption}
                index={index}
                handleDrag={handleDrag}
                showDelete={!!count && count > 2}
            />
        );
    };

    const renderAnswerOption = () => {
        const handleChange = (result: DropResult) => {
            if (!result.destination || !result.draggableId) {
                return;
            }

            const fromIndex = result.source.index;
            const toIndex = result.destination.index;
            const swapPositions = (array: QuestionnaireItemAnswerOption[], too: number, from: number) => {
                [array[too], array[from]] = [array[from], array[too]];
                return array;
            };

            if (fromIndex !== toIndex) {
                const tempList = item.answerOption ? [...item.answerOption] : [];
                dispatchUpdateItem(IItemProperty.answerOption, swapPositions(tempList, toIndex, fromIndex));
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
                <Droppable droppableId={`droppable-${item._linkId}-answer-options`} type="stuff">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            {item.answerOption?.map((answerOption, index) => {
                                return (
                                    <Draggable
                                        key={answerOption.valueCoding?.code}
                                        draggableId={answerOption.valueCoding?.code || '1'}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                            >
                                                {renderAnswerOptionItem(
                                                    answerOption,
                                                    index,
                                                    provided.dragHandleProps,
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
            <div className="form-field">
                <SwitchBtn
                    label="Flere valg mulig"
                    onChange={() => dispatchExtentionUpdate()}
                    initial
                    value={item.extension !== undefined && item.extension.length > 0}
                />
                {item.answerValueSet && !item.answerOption && renderValueSetValues()}
                {renderAnswerOption()}
            </div>
            {!item.answerValueSet && (
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
            )}
        </>
    );
};

export default Choice;
