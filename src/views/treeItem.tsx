import React, { useContext } from 'react';
import { TreeContext } from '../store/treeStore/treeStore';
import { newItemAction, deleteItemAction, updateItemAction } from '../store/treeStore/treeActions';
import { QuestionnaireItem } from '../types/fhir';
import { IItemProperty } from '../types/IQuestionnareItemType';

interface TreeItemProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
}

const TreeItem = (props: TreeItemProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchNewItem = () => {
        dispatch(newItemAction('group', [...props.parentArray, props.item.linkId]));
    };

    const dispatchDeleteItem = () => {
        dispatch(deleteItemAction(props.item.linkId, props.parentArray));
    };

    const dispatchUpdateItem = () => {
        dispatch(updateItemAction(props.item.linkId, IItemProperty.text, 'NY HEADER'));
    };

    return (
        <div style={{ marginLeft: props.parentArray.length * 32 }}>
            <span>{`LinkId: ${props.item.linkId}, text: ${props.item.text}, med foreldre ${props.parentArray.join(
                '->',
            )}`}</span>
            <div>
                <button onClick={dispatchNewItem}>Add child</button>
                <button onClick={dispatchDeleteItem}>Delete item</button>
                <button onClick={dispatchUpdateItem}>Set text</button>
            </div>
        </div>
    );
};

export default TreeItem;
