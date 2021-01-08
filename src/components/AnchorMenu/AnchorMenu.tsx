import React, { useContext } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { reorderItemAction } from '../../store/treeStore/treeActions';
import { OrderItem, TreeContext } from '../../store/treeStore/treeStore';
import './AnchorMenu.css';

const AnchorMenu = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const dispatchReorderItem = (linkId: string, newIndex: number) => {
        dispatch(reorderItemAction(linkId, [], newIndex));
    };

    const handleChange = (result: DropResult) => {
        if (!result.destination || !result.draggableId) {
            return;
        }
        dispatchReorderItem(result.draggableId, result.destination.index);
    };

    const grid = 8;

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
        padding: grid,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: 'none',
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        background: isDragging ? 'lightgreen' : 'grey',

        // styles we need to apply on draggables
        ...draggableStyle,
    });

    const renderTree = (items: Array<OrderItem>, parentArray: Array<string> = []): Array<JSX.Element> => {
        return items.map((x, index) => {
            return (
                <div key={index}>
                    <Draggable draggableId={x.linkId} index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                                {state.qItems[x.linkId].text}
                            </div>
                        )}
                    </Draggable>
                    {renderTree(x.items, [...parentArray, x.linkId])}
                </div>
            );
        });
    };

    return (
        <div className="anchor-menu">
            <p className="align-header">Oversikt</p>

            <DragDropContext onDragEnd={handleChange}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {renderTree(state.qOrder)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default AnchorMenu;
