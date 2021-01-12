import React, { useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { OrderItem, TreeContext } from '../../store/treeStore/treeStore';
import ReorderIcon from '../../images/icons/reorder-three-outline.svg';

type SubAnchorProps = {
    parentItem: string;
    items: OrderItem[];
    parentArray: Array<string>;
    children?: JSX.Element | JSX.Element[];
};

const SubAnchor = (props: SubAnchorProps): JSX.Element => {
    const grid = 8;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        userSelect: 'none',
        padding: grid * 2,
        background: isDragging ? 'lightgreen' : 'transparent',

        margin: '0 10px 10px 0',
        border: '1px solid grey',
        ...draggableStyle,
    });

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? 'lightblue' : 'transparent',
        padding: grid,
        margin: '10px 0',
    });

    const { state } = useContext(TreeContext);

    return (
        <div style={{ marginLeft: props.parentArray.length * 2 }}>
            <Droppable droppableId={`droppable-${props.parentItem}`} type={JSON.stringify(props.parentArray)}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                        {props.items.map((item, index) => (
                            <Draggable key={item.linkId} draggableId={item.linkId} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span className="truncate">
                                                {state.qItems[item.linkId].text || <i>Legg inn spørsmål</i>}
                                            </span>
                                            <span
                                                {...provided.dragHandleProps}
                                                style={{
                                                    display: 'block',
                                                    height: 25,
                                                    width: 25,
                                                }}
                                            >
                                                <img src={ReorderIcon} height={25} aria-label="reorder" />
                                            </span>
                                        </div>
                                        <div>
                                            {item.items.length > 0 && (
                                                <SubAnchor
                                                    items={item.items}
                                                    parentItem={item.linkId}
                                                    parentArray={[...props.parentArray, item.linkId]}
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
