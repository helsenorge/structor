import React, { useContext } from 'react';
import { TreeContext, OrderItem } from '../store/treeStore/treeStore';
import TreeItem from './treeItem';
import { newItemAction } from '../store/treeStore/treeActions';
import { generateQuestionnaire } from '../helpers/generateQuestionnaire';

const TreeForm = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const dispatchNewRootItem = () => {
        dispatch(newItemAction('group', []));
    };

    const renderTree = (items: Array<OrderItem>, parentArray: Array<string>): Array<JSX.Element> => {
        return items.map((x) => {
            return (
                <div key={x.linkId}>
                    <TreeItem item={state.qItems[x.linkId]} parentArray={parentArray} />
                    {renderTree(x.items, [...parentArray, x.linkId])}
                </div>
            );
        });
    };

    return (
        <>
            <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{renderTree(state.qOrder, [])}</div>
            <button onClick={dispatchNewRootItem}>Add root child</button>
            <button onClick={() => console.log(generateQuestionnaire(state))}>Log questionnaire to console</button>
        </>
    );
};

export default TreeForm;
