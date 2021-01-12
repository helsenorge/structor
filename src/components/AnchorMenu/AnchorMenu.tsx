import React, { useContext } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { reorderItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import './AnchorMenu.css';
import SubAnchor from './SubAnchor';

const AnchorMenu = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const dispatchReorderItem = (linkId: string, newIndex: number, order: string[] = []) => {
        dispatch(reorderItemAction(linkId, order, newIndex));
    };

    const handleChange = (result: DropResult) => {
        console.log(result);
        if (!result.destination || !result.draggableId) {
            return;
        }

        const order = JSON.parse(result.type);
        dispatchReorderItem(result.draggableId, result.destination.index, order);
    };

    return (
        <div className="anchor-menu">
            <p className="align-header">Oversikt</p>

            <DragDropContext onDragEnd={handleChange}>
                <SubAnchor items={state.qOrder} parentItem="draggable" parentArray={[]} />
            </DragDropContext>
        </div>
    );
};

export default AnchorMenu;
