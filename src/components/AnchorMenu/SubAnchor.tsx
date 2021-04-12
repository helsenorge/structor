import React, { useContext } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Items, OrderItem, TreeContext } from '../../store/treeStore/treeStore';

import { IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import { isIgnorableItem } from '../../helpers/itemControl';
import { updateMarkedLinkIdAction } from '../../store/treeStore/treeActions';

type SubAnchorProps = {
    parentItem: string;
    items: OrderItem[];
    parentArray: Array<string>;
    qItems: Items;
    children?: JSX.Element | JSX.Element[];
    parentQuestionNumber: string;
};

const SubAnchor = (props: SubAnchorProps): JSX.Element => {
    const grid = 8;

    const { state, dispatch } = useContext(TreeContext);

    const getBackgroundColor = (isDragging: boolean, linkId: string) => {
        if (isDragging) {
            return 'lightgreen';
        }

        if (linkId === state.qCurrentItem?.linkId) {
            return '#93bdd4';
        }

        return 'transparent';
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItemStyle = (isDragging: boolean, draggableStyle: any, linkId: string) => ({
        userSelect: 'none',
        background: getBackgroundColor(isDragging, linkId),
        cursor: 'pointer',

        margin: '0 10px 10px 0',
        border: '1px solid grey',
        ...draggableStyle,
    });

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? 'lightblue' : 'transparent',
        padding: grid,
        margin: '10px 0',
    });

    const getRelevantIcon = (type: string) => {
        switch (type) {
            case IQuestionnaireItemType.group:
                return 'folder-icon';
            case IQuestionnaireItemType.display:
                return 'message-icon';
            default:
                return 'question-icon';
        }
    };

    const selectItem = (id: string) => {
        dispatch(updateMarkedLinkIdAction(id, props.parentArray));
    };

    const removeUnsupportedChildren = (items: OrderItem[], parentLinkId?: string) => {
        const parentItem = parentLinkId ? props.qItems[parentLinkId] : undefined;
        return items.filter((x) => !isIgnorableItem(props.qItems[x.linkId], parentItem));
    };

    const showHierarchy = (index: number) => {
        if (props.parentQuestionNumber) {
            return `${props.parentQuestionNumber}.${index + 1}`;
        }
        return `${index + 1}`;
    };

    return (
        <div style={{ marginLeft: props.parentArray.length * 2 }}>
            <Droppable droppableId={`droppable-${props.parentItem}`} type={JSON.stringify(props.parentArray)}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                        {removeUnsupportedChildren(props.items).map((item, index) => (
                            <Draggable key={item.linkId} draggableId={item.linkId} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style,
                                            item.linkId,
                                        )}
                                    >
                                        <div
                                            className="anchor-content"
                                            onClick={() => {
                                                selectItem(item.linkId);
                                            }}
                                        >
                                            <span
                                                className={getRelevantIcon(props.qItems[item.linkId].type)}
                                                style={{ marginRight: 10 }}
                                            />
                                            <span className="truncate" title={props.qItems[item.linkId].text || ''}>
                                                {showHierarchy(index)}{' '}
                                                {props.qItems[item.linkId].text || <i>Legg inn tekst</i>}
                                            </span>
                                            <span
                                                {...provided.dragHandleProps}
                                                className="reorder-icon"
                                                aria-label="reorder item"
                                            />
                                        </div>
                                        <div>
                                            {removeUnsupportedChildren(item.items, item.linkId).length > 0 && (
                                                <SubAnchor
                                                    items={removeUnsupportedChildren(item.items, item.linkId)}
                                                    parentItem={item.linkId}
                                                    qItems={props.qItems}
                                                    parentArray={[...props.parentArray, item.linkId]}
                                                    parentQuestionNumber={showHierarchy(index)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default SubAnchor;
