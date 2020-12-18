import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import FormField from '../../FormField/FormField';

interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypeText = ({ item }: ValidationTypeProp): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const updateMaxLength = (number: number) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.maxLength, number));
    };

    return (
        <>
            <FormField label="Maximum antall tegn">
                <input
                    value={item.maxLength || ''}
                    type="input"
                    aria-label="maximum sign"
                    onChange={(e) => updateMaxLength(parseInt(e.target.value.toString()))}
                ></input>
            </FormField>
        </>
    );
};

export default ValidationAnswerTypeText;
