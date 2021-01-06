import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import './AnchorMenu.css';

const AnchorMenu = (): JSX.Element => {
    const initList = [
        {
            id: '1',
            text: 'hi',
        },
        {
            id: '2',
            text: 'over',
        },
        {
            id: '3',
            text: 'there',
        },
    ];

    const [list, setList] = useState(initList);

    const handleChange = (result: DropResult) => {
        console.log(result);
    };

    return (
        <div className="anchor-menu">
            <h1>Anker</h1>
            <DragDropContext onDragEnd={handleChange}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {list.map((item, index) => {
                                return (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {item.text}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default AnchorMenu;
