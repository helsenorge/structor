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
    createNewAnswerOption,
    removeOptionFromAnswerOptionArray,
    reorderPositions,
    updateAnswerOption,
    updateAnswerOptionCode,
    updateAnswerOptionSystem,
} from '../../../helpers/answerOptionHelper';

import { QuestionnaireItem, QuestionnaireItemAnswerOption, ValueSetComposeIncludeConcept } from '../../../types/fhir';
import Btn from '../../Btn/Btn';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { checkboxExtension, dropdownExtension } from '../../../helpers/QuestionHelper';
import { removeItemAttributeAction, updateItemAction } from '../../../store/treeStore/treeActions';
import AnswerOption from '../../AnswerOption/AnswerOption';
import SystemField from '../../FormField/SystemField';
import { isItemControlCheckbox, isItemControlDropDown, ItemControlType } from '../../../helpers/itemControl';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import FormField from '../../FormField/FormField';
import ChoiceTypeSelect from './ChoiceTypeSelect';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import Typeahead from '../../Typeahead/Typeahead';
import Select from '../../Select/Select';
import { createSystemUUID } from '../../../helpers/systemHelper';

type Props = {
    item: QuestionnaireItem;
};

const Choice = ({ item }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch, state } = useContext(TreeContext);
    const { qContained } = state;

    const containedValueSets =
        qContained?.map((valueSet) => {
            return {
                code: valueSet.id,
                display: valueSet.title,
            } as ValueSetComposeIncludeConcept;
        }) || [];

    const dispatchExtentionUpdate = (type: ItemControlType) => {
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

    const dispatchRemoveAttribute = (name: IItemProperty): void => {
        dispatch(removeItemAttributeAction(item.linkId, name));
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

    const handleDisplaySelected = () => {
        if (item.answerValueSet && item.answerValueSet.indexOf('#') >= 0) {
            return item.answerValueSet.substring(1);
        }
        return '';
    };

    const handleDisplaySelectedTitle = () => {
        if (item.answerValueSet && item.answerValueSet.indexOf('#') >= 0) {
            const id = item.answerValueSet.substring(1);
            return qContained?.find((x) => x.id === id)?.title || '';
        }
        return '';
    };

    const handleSelectedValueSet = (id: string) => {
        const valueSet = qContained?.find((x) => x.id === id);
        if (valueSet) {
            dispatch(updateItemAction(item.linkId, IItemProperty.answerValueSet, `#${id}`));
        }
    };

    const handleSelect = () => {
        if (containedValueSets.length > 5) {
            return (
                <Typeahead
                    defaultValue={handleDisplaySelectedTitle()}
                    items={containedValueSets}
                    onChange={handleSelectedValueSet}
                />
            );
        }

        return (
            <Select
                value={handleDisplaySelected()}
                options={containedValueSets || []}
                onChange={(event) => handleSelectedValueSet(event.target.value)}
                placeholder={t('Choose an option..')}
            />
        );
    };

    const getContainedValueSetValues = (
        valueSetId: string,
    ): Array<{ code?: string; system?: string; display?: string }> => {
        const valueSet = qContained?.find((x) => x.id === valueSetId);
        if (valueSet && valueSet.compose && valueSet.compose.include && valueSet.compose.include[0].concept) {
            return valueSet.compose.include[0].concept.map((x) => {
                return { code: x.code, system: valueSet.compose?.include[0].system, display: x.display };
            });
        }
        return [];
    };

    const renderPreDefinedValueSet = () => {
        const selectedPredefinedValueSet = handleDisplaySelected();
        if (selectedPredefinedValueSet !== '') {
            return getContainedValueSetValues(selectedPredefinedValueSet).map((x) => {
                return (
                    <div className="predefined-value" key={x.code}>
                        {x.display}
                    </div>
                );
            });
        }

        return undefined;
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
            <ChoiceTypeSelect item={item} dispatchExtentionUpdate={dispatchExtentionUpdate} />
            <FormField>
                <SwitchBtn
                    onChange={() => {
                        const newType =
                            item.type === IQuestionnaireItemType.openChoice
                                ? IQuestionnaireItemType.choice
                                : IQuestionnaireItemType.openChoice;
                        dispatchUpdateItem(IItemProperty.type, newType);
                    }}
                    value={item.type === IQuestionnaireItemType.openChoice}
                    label={t('Allow free-text answer')}
                />
            </FormField>
            <FormField>
                <SwitchBtn
                    onChange={() => {
                        if (!!item.answerValueSet) {
                            const system = createSystemUUID();
                            dispatchRemoveAttribute(IItemProperty.answerValueSet);
                            dispatchUpdateItem(IItemProperty.answerOption, [
                                createNewAnswerOption(system),
                                createNewAnswerOption(system),
                            ]);
                        } else {
                            dispatchRemoveAttribute(IItemProperty.answerOption);
                            dispatchUpdateItem(IItemProperty.answerValueSet, '#');
                        }
                    }}
                    value={!!item.answerValueSet}
                    label={t('Use predefined valueset')}
                />
            </FormField>
            {!!item.answerValueSet ? (
                <>
                    <FormField label={t('Select answer valueset')}>{handleSelect()}</FormField>
                    <FormField>{renderPreDefinedValueSet()}</FormField>
                </>
            ) : (
                <>
                    <SystemField
                        value={
                            item.answerOption && item.answerOption.length > 0
                                ? item.answerOption[0]?.valueCoding?.system
                                : ''
                        }
                        onBlur={(event) => handleChangeSystem(event.target.value)}
                    />
                    <FormField>{item.answerOption && item.answerOption?.length > 0 && renderAnswerOption()}</FormField>
                    <div className="center-text">
                        <Btn
                            title={t('+ Add option')}
                            type="button"
                            onClick={() => {
                                const newArray = addEmptyOptionToAnswerOptionArray(item.answerOption || []);
                                dispatchUpdateItem(IItemProperty.answerOption, newArray);
                            }}
                            variant="secondary"
                            size="small"
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default Choice;
