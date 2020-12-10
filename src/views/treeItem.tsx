import React, { useContext } from 'react';
import { TreeContext } from '../store/treeStore/treeStore';
import { IItemProperty, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import {
    newItemAction,
    deleteItemAction,
    updateItemAction,
    newValueSetCodeAction,
    deleteValueSetCodeAction,
} from '../store/treeStore/treeActions';
import { QuestionnaireItem, ValueSet } from '../types/fhir';

interface TreeItemProps {
    valueSet?: ValueSet;
    item: QuestionnaireItem;
    parentArray: Array<string>;
}

const TreeItem = (props: TreeItemProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchNewItem = () => {
        dispatch(newItemAction(IQuestionnaireItemType.choice, [...props.parentArray, props.item.linkId]));
    };

    const dispatchDeleteItem = () => {
        dispatch(deleteItemAction(props.item.linkId, props.parentArray));
    };

    const dispatchUpdateItem = () => {
        dispatch(updateItemAction(props.item.linkId, IItemProperty.text, 'NY HEADER'));
    };

    const dispatchNewValueSetItem = () => {
        dispatch(newValueSetCodeAction(props.item.linkId, Math.random().toString()));
    };

    const dispatchDeleteValueSetItem = (code: string) => {
        dispatch(deleteValueSetCodeAction(props.item.linkId, code));
    };

    return (
        <div style={{ marginLeft: props.parentArray.length * 32 }}>
            <span>{`LinkId: ${props.item.linkId}, text: ${props.item.text}, type: ${props.item.type}`}</span>
            {props.valueSet && props.valueSet.compose && props.valueSet.compose.include[0].concept && (
                <div>
                    {props.valueSet.compose.include[0].concept.map((x) => {
                        return (
                            <button
                                key={x.code}
                                onClick={() => dispatchDeleteValueSetItem(x.code)}
                            >{`Delete ${x.display} value`}</button>
                        );
                    })}
                </div>
            )}
            <div>
                <button onClick={dispatchNewItem}>Add child</button>
                <button onClick={dispatchDeleteItem}>Delete item</button>
                <button onClick={dispatchUpdateItem}>Set text</button>
                {props.valueSet && <button onClick={dispatchNewValueSetItem}>Add valueSet value</button>}
            </div>
        </div>
    );
};

export default TreeItem;
