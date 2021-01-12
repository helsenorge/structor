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
            <p className="align-header">Skjemaoversikt</p>
            <DragDropContext onDragEnd={handleChange}>
                <SubAnchor items={state.qOrder} parentItem="draggable" parentArray={[]} />
            </DragDropContext>
            {state.qOrder.length === 0 && (
                <p className="center-text" style={{ padding: '0px 25px' }}>
                    Ingen spørsmål er lagt til, legg til et spørsmål. Her finner du en oversikt av alle spørsmålene.
                </p>
            )}
        </div>
    );
};

export default AnchorMenu;
