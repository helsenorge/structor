import React, { useContext, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { OrderItem, TreeContext } from '../../store/treeStore/treeStore';
import './AnchorMenu.css';

const AnchorMenu = (): JSX.Element => {
    const initList = [
        {
            id: '1',
            text: 'Her kan det være et godt spørmsål',
        },
        {
            id: '2',
            text: 'Litt lenger spørsmål',
        },
        {
            id: '4',
            text:
                'Du har tatt en test som ikke påviser koronavirus. Du trenger vanligvis ikke å teste deg på nytt dersom du akkurat har fått et svar som ikke påviser koronavirus?',
        },
    ];

    const { state, dispatch } = useContext(TreeContext);

    const [list, setList] = useState(initList);

    const handleChange = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const alteredArray = list.concat();

        const [removed] = alteredArray.splice(result.source.index, 1);
        alteredArray.splice(result.destination?.index, 0, removed);

        setList(alteredArray);
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

    const renderTree = (
        items: Array<OrderItem>,
        parentArray: Array<string> = [],
        parentQuestionNumber = '',
    ): Array<JSX.Element> => {
        return items.map((x, index) => {
            const questionNumber =
                parentQuestionNumber === '' ? `${index + 1}` : `${parentQuestionNumber}.${index + 1}`;
            return (
                <Draggable key={index} draggableId={index.toString()} index={index}>
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
            );
            return (
                <div key={x.linkId}>
                    <p>{questionNumber}</p>
                    {renderTree(x.items, [...parentArray, x.linkId], questionNumber)}
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
