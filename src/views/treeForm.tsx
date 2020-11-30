import React, { useContext } from 'react';
import { TreeContext, OrderItem } from '../store/treeStore/treeStore';
import TreeItem from './treeItem';
import { newItemAction } from '../store/treeStore/treeActions';

const TreeForm = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const dispatchNewRootItem = () => {
        dispatch(newItemAction('group', []));
    };

    const renderTree = (items: Array<OrderItem>, parentArray: Array<string>) => {
        return items.map((x) => {
            return (
                <div key={x.linkId}>
                    <TreeItem linkId={x.linkId} parentArray={parentArray} />
                    {renderTree(x.items, [...parentArray, x.linkId])}
                </div>
            );
        });
    };

    return (
        <>
            <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{renderTree(state.qOrder, [])}</div>
            <button onClick={dispatchNewRootItem}>Add root child</button>
        </>
    );
};

export default TreeForm;
