import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';
import createUUID from '../../helpers/CreateUUID';
import { predefinedValueSetUri } from '../../helpers/initPredefinedValueSet';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateValueSetAction } from '../../store/treeStore/treeActions';
import { ValueSet } from '../../types/fhir';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import Modal from '../Modal/Modal';
import './PredefinedValueSetModal.css';
import { removeSpace } from '../../helpers/formatHelper';
import UriField from '../FormField/UriField';
import { createUriUUID } from '../../helpers/uriHelper';
import InputField from '../InputField/inputField';
import { getValueSetValues } from '../../helpers/valueSetHelper';

type Props = {
    close: () => void;
};

const initValueSet = () =>
    ({
        resourceType: 'ValueSet',
        id: `${createUUID()}`,
        version: '1.0',
        name: '',
        title: '',
        date: new Date().toISOString(),
        status: 'draft',
        publisher: '',
        compose: {
            include: [
                {
                    system: createUriUUID(),
                    concept: [
                        {
                            id: createUUID(),
                            code: '',
                            display: '',
                        },
                        {
                            id: createUUID(),
                            code: '',
                            display: '',
                        },
                    ],
                },
            ],
        },
    } as ValueSet);

const PredefinedValueSetModal = (props: Props): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [newValueSet, setNewValueSet] = useState<ValueSet>({ ...initValueSet() });
    const { qContained } = state;

    const addNewElement = () => {
        newValueSet?.compose?.include[0].concept?.push({
            id: createUUID(),
            code: '',
            display: '',
        });
        setNewValueSet({ ...newValueSet });
    };

    const removeElement = (id?: string) => {
        const compose = { ...newValueSet.compose };
        const conceptToDelete = compose.include && compose.include[0].concept?.findIndex((x) => x && x.id === id);
        if (conceptToDelete || conceptToDelete === 0) {
            compose.include && compose.include[0].concept?.splice(conceptToDelete, 1);
        }

        setNewValueSet({ ...newValueSet });
    };

    const handleConceptItem = (value: string, updateField: 'code' | 'display', id?: string) => {
        const compose = { ...newValueSet.compose };
        const item = compose.include && compose.include[0]?.concept?.find((x) => x && x.id === id);

        if (item) {
            item[updateField] = value;
        }

        if (updateField === 'display' && item) {
            item.code = removeSpace(value);
        }

        setNewValueSet({ ...newValueSet });
    };

    const dispatchValueSet = () => {
        dispatch(updateValueSetAction(newValueSet));
        setNewValueSet({ ...initValueSet() });
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

    const handleOrder = (result: DropResult) => {
        if (!result.source || !result.destination || !result.draggableId) {
            return;
        }

        const fromIndex = result.source.index;
        const toIndex = result.destination.index;

        const compose = { ...newValueSet.compose };
        const itemToMove = compose.include && compose.include[0].concept?.splice(fromIndex, 1);

        if (fromIndex !== toIndex && itemToMove) {
            compose.include && compose.include[0].concept?.splice(toIndex, 0, itemToMove[0]);
            setNewValueSet({ ...newValueSet });
        }
    };

    const handleSystem = (value: string) => {
        const compose = { ...newValueSet.compose };
        compose.include && (compose.include[0].system = value);
        setNewValueSet({ ...newValueSet });
    };

    const canEdit = (type?: string) => {
        return type !== predefinedValueSetUri;
    };

    const handleEdit = (valueSet: ValueSet) => {
        const o = JSON.stringify(valueSet);
        setNewValueSet(JSON.parse(o));
    };

    return (
        <Modal close={props.close} title={t('Predefined values')} size="large" bottomCloseText={t('Close')}>
            <div className="predefined-container">
                <div>
                    <FormField label={t('Title')}>
                        <InputField
                            value={newValueSet.title}
                            onChange={(event) => setNewValueSet({ ...newValueSet, title: event.target.value })}
                        />
                    </FormField>
                    <FormField label={t('Teknisk-navn')}>
                        <InputField
                            value={newValueSet.name}
                            onChange={(event) => setNewValueSet({ ...newValueSet, name: event.target.value })}
                        />
                    </FormField>
                    <FormField label={t('Publisher')}>
                        <InputField
                            value={newValueSet.publisher}
                            onChange={(event) => setNewValueSet({ ...newValueSet, publisher: event.target.value })}
                        />
                    </FormField>
                    <div className="btn-group center-text">
                        <Btn onClick={addNewElement} title={t('+ New option')} variant="secondary" />
                        <Btn onClick={dispatchValueSet} title={t('Save >')} variant="primary" />
                    </div>
                    <div className="value-set">
                        {newValueSet.compose?.include.map((include, includeIndex) => {
                            return (
                                <div key={include.system}>
                                    <FormField label={t('System')}>
                                        <UriField
                                            disabled={includeIndex > 0}
                                            value={include.system}
                                            onBlur={(event) => handleSystem(event.target.value)}
                                        />
                                    </FormField>
                                    <DragDropContext onDragEnd={handleOrder}>
                                        <Droppable
                                            droppableId={`droppable-new-value-set-${include.system}`}
                                            type="value-set"
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                >
                                                    {include.concept?.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id || '1'}
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
                                                                        className="answer-option-item align-everything"
                                                                    >
                                                                        <span
                                                                            className="reorder-icon"
                                                                            aria-label="reorder element"
                                                                            {...providedDrag.dragHandleProps}
                                                                        />
                                                                        <div className="answer-option-content align-everything">
                                                                            <InputField
                                                                                disabled={includeIndex > 0}
                                                                                value={item.display}
                                                                                placeholder={t('Enter a title..')}
                                                                                onChange={(event) =>
                                                                                    handleConceptItem(
                                                                                        event.target.value,
                                                                                        'display',
                                                                                        item.id,
                                                                                    )
                                                                                }
                                                                            />
                                                                            <InputField
                                                                                disabled={includeIndex > 0}
                                                                                value={item.code}
                                                                                placeholder={t('Enter a value..')}
                                                                                onChange={(event) =>
                                                                                    handleConceptItem(
                                                                                        event.target.value,
                                                                                        'code',
                                                                                        item.id,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        {includeIndex === 0 &&
                                                                            include.concept?.length &&
                                                                            include.concept?.length > 2 && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        removeElement(item.id)
                                                                                    }
                                                                                    name={t('Remove element')}
                                                                                    className="align-everything"
                                                                                />
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
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    {qContained?.map((x) => (
                        <div key={x.id}>
                            <p>
                                <strong>{x.title}</strong> ({x.name}){' '}
                                {canEdit(x.url) && (
                                    <Btn
                                        title="Endre"
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleEdit(x)}
                                    />
                                )}
                            </p>
                            <ul>
                                {getValueSetValues(x).map((y) => (
                                    <li key={y.code}>
                                        {y.display} ({y.code})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default PredefinedValueSetModal;
