import './AnchorMenu.css';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import React, { useContext } from 'react';

import SubAnchor from './SubAnchor';
import { TreeContext } from '../../store/treeStore/treeStore';
import { reorderItemAction } from '../../store/treeStore/treeActions';

const AnchorMenu = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const dispatchReorderItem = (linkId: string, newIndex: number, order: string[] = []) => {
        dispatch(reorderItemAction(linkId, order, newIndex));
    };

    const handleChange = (result: DropResult) => {
        if (!result.destination || !result.draggableId) {
            return;
        }

        const order = JSON.parse(result.type);
        dispatchReorderItem(result.draggableId, result.destination.index, order);
    };

    return (
        <div className="anchor-menu">
            <p className="align-header">Skjemaoversikt</p>
            <DragDropContext onDragEnd={handleChange}>
                <SubAnchor items={state.qOrder} parentItem="draggable" parentArray={[]} />
            </DragDropContext>
            {state.qOrder.length === 0 && (
                <p className="center-text" style={{ padding: '0px 25px' }}>
                    Her vil du finne en oversikt over elementene i skjemaet.
                </p>
            )}
        </div>
    );
};

export default AnchorMenu;
