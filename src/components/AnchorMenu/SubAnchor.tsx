import React, { useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { OrderItem, TreeContext } from '../../store/treeStore/treeStore';

import ReorderIcon from '../../images/icons/reorder-three-outline.svg';
import FolderIcon from '../../images/icons/folder-outline.svg';
import MessageIcon from '../../images/icons/information-circle-outline.svg';
import QuestionIcon from '../../images/icons/help-circle-outline.svg';

import { IExtentionType, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';

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
                return <img src={FolderIcon} height={25} alt={`question type ${IQuestionnaireItemType.group}`} />;
            case IQuestionnaireItemType.display:
                return <img src={MessageIcon} height={25} alt={`question type ${IQuestionnaireItemType.display}`} />;
            default:
                return <img src={QuestionIcon} height={25} alt="question" />;
        }
    };

    const handleScrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    };

    const { state } = useContext(TreeContext);

    const isSupported = (linkId: string) => {
        const notViewableExtentions = state.qItems[linkId].extension?.find((x) => x.url === IExtentionType.itemControl);
        return !!notViewableExtentions;
    };

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
                                        <div
                                            style={{ display: 'flex', alignItems: 'center' }}
                                            onClick={() => {
                                                handleScrollTo(item.linkId);
                                            }}
                                        >
                                            <span className="anchor-icon" style={{ paddingRight: 10 }}>
                                                {getRelevantIcon(state.qItems[item.linkId].type)}
                                            </span>
                                            <span className="truncate">
                                                {isSupported(item.linkId) ? 'supported' : 'not'}
                                                {state.qItems[item.linkId].text || <i>Legg inn spørsmål</i>}
                                            </span>
                                            <span {...provided.dragHandleProps} className="anchor-icon">
                                                <img
                                                    src={ReorderIcon}
                                                    height={25}
                                                    alt="reorder"
                                                    aria-label="reorder item"
                                                />
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
