import React, { useContext } from 'react';
import { TreeContext } from '../store/treeStore/treeStore';
import { newItemAction, deleteItemAction } from '../store/treeStore/treeActions';

interface TreeItemProps {
    linkId: string;
    parentArray: Array<string>;
}

const TreeItem = (props: TreeItemProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchNewItem = () => {
        dispatch(newItemAction('group', [...props.parentArray, props.linkId]));
    };

    const dispatchDeleteItem = () => {
        dispatch(deleteItemAction(props.linkId, props.parentArray));
    };

    return (
        <div style={{ marginLeft: props.parentArray.length * 32 }}>
            <span>{`LinkId: ${props.linkId}, med foreldre ${props.parentArray.join('->')}`}</span>
            <div>
                <button onClick={dispatchNewItem}>Add child</button>
                <button onClick={dispatchDeleteItem}>Delete item</button>
            </div>
        </div>
    );
};

export default TreeItem;
