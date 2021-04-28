import './AnchorMenu.css';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import React from 'react';

import SubAnchor from './SubAnchor';
import { ActionType, Items, OrderItem } from '../../store/treeStore/treeStore';
import { IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import { newItemAction, reorderItemAction } from '../../store/treeStore/treeActions';

interface AnchorMenuProps {
    qOrder: OrderItem[];
    qItems: Items;
    dispatch: React.Dispatch<ActionType>;
}

const AnchorMenu = (props: AnchorMenuProps): JSX.Element => {
    const dispatchNewRootItem = () => {
        props.dispatch(newItemAction(IQuestionnaireItemType.group, []));
    };

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
        <div className="questionnaire-overview">
            <p className="align-header">Skjemaoversikt</p>
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
            <div className="floating-button">
                <button className="new-item-button" onClick={dispatchNewRootItem}>
                    <i className="add-icon large" aria-label="add element" title="Opprett element" />
                    Legg til element på toppnivå
                </button>
            </div>
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
    return isOrderEqual && areItemsEqual;
});
