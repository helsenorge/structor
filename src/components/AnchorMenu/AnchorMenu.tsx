import './AnchorMenu.css';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import React from 'react';

import SubAnchor from './SubAnchor';
import { ActionType, Items, OrderItem } from '../../store/treeStore/treeStore';
import { reorderItemAction } from '../../store/treeStore/treeActions';

interface AnchorMenuProps {
    qOrder: OrderItem[];
    qItems: Items;
    toggleFormDetails: () => void;
    dispatch: React.Dispatch<ActionType>;
}

const AnchorMenu = (props: AnchorMenuProps): JSX.Element => {
    const dispatchReorderItem = (linkId: string, newIndex: number, order: string[] = []) => {
        props.dispatch(reorderItemAction(linkId, order, newIndex));
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
            <div>
                <button onClick={props.toggleFormDetails}>Detaljer</button>
            </div>
            <DragDropContext onDragEnd={handleChange}>
                <SubAnchor
                    items={props.qOrder}
                    parentItem="draggable"
                    qItems={props.qItems}
                    parentArray={[]}
                    parentQuestionNumber=""
                />
            </DragDropContext>
            {props.qOrder.length === 0 && (
                <p className="center-text" style={{ padding: '0px 25px' }}>
                    Her vil du finne en oversikt over elementene i skjemaet.
                </p>
            )}
        </div>
    );
};

export default React.memo(AnchorMenu, (prevProps: AnchorMenuProps, nextProps: AnchorMenuProps) => {
    const isOrderEqual = JSON.stringify(prevProps.qOrder) === JSON.stringify(nextProps.qOrder);
    const areItemsEqual =
        JSON.stringify(
            Object.keys(prevProps.qItems).map(
                (key: string) => `${prevProps.qItems[key].text}${prevProps.qItems[key].type}`,
            ),
        ) ===
        JSON.stringify(
            Object.keys(nextProps.qItems).map(
                (key: string) => `${nextProps.qItems[key].text}${nextProps.qItems[key].type}`,
            ),
        );
    return isOrderEqual && areItemsEqual && prevProps.toggleFormDetails === nextProps.toggleFormDetails;
});
