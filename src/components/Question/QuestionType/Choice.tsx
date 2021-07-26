import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DragDropContext,
    Draggable,
    DraggableProvidedDragHandleProps,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
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
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { checkboxExtension, dropdownExtension } from '../../../helpers/QuestionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import AnswerOption from '../../AnswerOption/AnswerOption';
import SystemField from '../../FormField/SystemField';
import { isItemControlCheckbox, isItemControlDropDown, ItemControlType } from '../../../helpers/itemControl';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';

type Props = {
    item: QuestionnaireItem;
};

const Choice = ({ item }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);

    const dispatchExtentionUpdate = (type: ItemControlType.checkbox | ItemControlType.dropdown) => {
        removeItemExtension(item, IExtentionType.itemControl, dispatch);
        if (type === ItemControlType.checkbox && !isItemControlCheckbox(item)) {
            setItemExtension(item, checkboxExtension, dispatch);
        } else if (type === ItemControlType.dropdown && !isItemControlDropDown(item)) {
            setItemExtension(item, dropdownExtension, dispatch);
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
            <div className="horizontal">
                <div className="form-field">
                    <SwitchBtn
                        label={t('Flere valg mulig')}
                        onChange={() => dispatchExtentionUpdate(ItemControlType.checkbox)}
                        initial
                        value={isItemControlCheckbox(item)}
                    />
                </div>
                <div className="form-field">
                    <SwitchBtn
                        label={t('Nedtrekksmeny')}
                        onChange={() => dispatchExtentionUpdate(ItemControlType.dropdown)}
                        initial
                        value={isItemControlDropDown(item)}
                    />
                </div>
            </div>
            <div className="form-field">
                {item.answerOption && item.answerOption?.length > 0 && renderAnswerOption()}
            </div>
            {!item.answerValueSet && (
                <div className="center-text">
                    <Btn
                        title={t('+ Legg til alternativ')}
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
