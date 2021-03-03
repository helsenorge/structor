import React, { useContext } from 'react';
import { TreeContext } from '../store/treeStore/treeStore';
import { IItemProperty, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { newItemAction, deleteItemAction, updateItemAction, duplicateItemAction } from '../store/treeStore/treeActions';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../types/fhir';
import { addEmptyOptionToAnswerOptionArray, removeOptionFromAnswerOptionArray } from '../helpers/answerOptionHelper';

interface TreeItemProps {
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

    const dispatchUpdateItem = (property: IItemProperty, value: string | QuestionnaireItemAnswerOption[]) => {
        dispatch(updateItemAction(props.item.linkId, property, value));
    };

    const dispatchDuplicateItem = () => {
        dispatch(duplicateItemAction(props.item.linkId, props.parentArray));
    };

    return (
        <div style={{ marginLeft: props.parentArray.length * 32 }}>
            <span>{`LinkId: ${props.item.linkId}, text: ${props.item.text}, type: ${props.item.type}`}</span>
            {props.item.type === IQuestionnaireItemType.choice && props.item.answerOption && (
                <div>
                    {props.item.answerOption.map((x) => {
                        return (
                            <button
                                key={x.valueCoding?.code}
                                onClick={() => {
                                    const newArray = removeOptionFromAnswerOptionArray(
                                        props.item.answerOption || [],
                                        x.valueCoding?.code || '',
                                    );
                                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                                }}
                            >{`Delete ${x.valueCoding?.display} value`}</button>
                        );
                    })}
                </div>
            )}
            <div>
                <button onClick={dispatchNewItem}>Add child</button>
                <button onClick={dispatchDeleteItem}>Delete item</button>
                <button onClick={() => dispatchUpdateItem(IItemProperty.text, 'NY HEADER')}>Set text</button>
                <button onClick={dispatchDuplicateItem}>Dupliser</button>
                {props.item.type === IQuestionnaireItemType.choice && (
                    <button
                        onClick={() => {
                            const existingValues: QuestionnaireItemAnswerOption[] = props.item.answerOption || [];
                            const newArray = addEmptyOptionToAnswerOptionArray(existingValues);
                            dispatchUpdateItem(IItemProperty.answerOption, newArray);
                        }}
                    >
                        Add valueSet value
                    </button>
                )}
            </div>
        </div>
    );
};

export default TreeItem;
