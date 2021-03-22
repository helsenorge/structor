import React, { useContext } from 'react';
import './OptionReferance.css';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import Btn from '../../Btn/Btn';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import createUUID from '../../../helpers/CreateUUID';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

type Props = {
    item: QuestionnaireItem;
};

const OpenReferance = ({ item }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchNewItem = () => {
        const newItem = [
            {
                url: IExtentionType.optionReference,
                valueReference: {
                    reference: '',
                    display: '',
                    id: createUUID(),
                },
            },
        ];

        if (item.linkId) {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, [...(item.extension || []), ...newItem]));
        }
    };

    const removeItem = (id?: string) => {
        if (id) {
            const newExtension = item.extension?.filter((x) => x.valueReference?.id !== id) || [];
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, [...newExtension]));
        }
    };

    const updateReferance = (type: 'display' | 'reference', value: string, id?: string) => {
        const newExtension = item?.extension?.map((x) => {
            return x.valueReference?.id === id
                ? {
                      url: x.url,
                      valueReference: {
                          ...x.valueReference,
                          [type]: value,
                      },
                  }
                : x;
        });

        if (newExtension) {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, newExtension));
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        userSelect: 'none',
        background: isDragging ? 'lightgreen' : 'transparent',
        cursor: 'pointer',
        ...draggableStyle,
    });

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? 'lightblue' : 'transparent',
    });

    const optionReferances = item.extension?.filter((x) => x.url === IExtentionType.optionReference);

    const reorderExtension = (list: Extension[], to: number, from: number): Extension[] => {
        const itemToMove = list.splice(from, 1);
        list.splice(to, 0, itemToMove[0]);
        return list;
    };

    const handleReorder = (result: DropResult) => {
        if (!result.source || !result.destination || !result.draggableId) {
            return;
        }

        const fromIndex = result.source.index;
        const toIndex = result.destination.index;

        if (fromIndex !== toIndex) {
            const tempList = item.extension ? [...item.extension] : [];
            const nonOptionReferances = tempList.filter((x) => x.url !== IExtentionType.optionReference);
            const optionReferances = tempList.filter((x) => x.url === IExtentionType.optionReference);
            const reordered = reorderExtension(optionReferances, toIndex, fromIndex);
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, [...nonOptionReferances, ...reordered]));
        }
    };

    return (
        <>
            <div className="center-text new-option-referance">
                <Btn
                    size="small"
                    type="button"
                    variant="secondary"
                    onClick={() => dispatchNewItem()}
                    title="+ Legg til endpoint"
                />
            </div>
            <DragDropContext onDragEnd={handleReorder}>
                <Droppable droppableId={`droppable-${item.linkId}-option-referance`}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            {optionReferances?.map((referance, index) => {
                                return (
                                    <Draggable
                                        key={referance.valueReference?.id}
                                        draggableId={referance.valueReference?.id || '1'}
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
                                                key={referance.valueReference?.id}
                                            >
                                                <div className="option-referance align-everything">
                                                    <span
                                                        {...providedDrag.dragHandleProps}
                                                        className="reorder-icon"
                                                        aria-label="reorder element"
                                                    />
                                                    <input
                                                        autoComplete="off"
                                                        type="text"
                                                        name="beskrivelse"
                                                        placeholder="Legg inn organisasjon.."
                                                        defaultValue={referance.valueReference?.display}
                                                        onBlur={(event) =>
                                                            updateReferance(
                                                                'display',
                                                                event.target.value,
                                                                referance.valueReference?.id,
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        autoComplete="off"
                                                        type="text"
                                                        name="verdi"
                                                        placeholder="Legg inn endpoint.."
                                                        defaultValue={referance.valueReference?.reference}
                                                        onBlur={(event) =>
                                                            updateReferance(
                                                                'reference',
                                                                event.target.value,
                                                                referance.valueReference?.id,
                                                            )
                                                        }
                                                    />
                                                    {optionReferances.length > 2 && (
                                                        <button
                                                            type="button"
                                                            name="Fjern element"
                                                            className="align-everything"
                                                            onClick={() => removeItem(referance.valueReference?.id)}
                                                        />
                                                    )}
                                                </div>
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
        </>
    );
};

export default OpenReferance;
