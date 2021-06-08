import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';

interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypeText = ({ item }: ValidationTypeProp): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const updateMaxLength = (number: number) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.maxLength, number));
    };

    const minLength = item?.extension?.find((x) => x.url === IExtentionType.minLength)?.valueInteger;

    return (
        <div className="horizontal equal">
            <FormField label="Maksimum antall tegn">
                <input
                    defaultValue={item.maxLength || ''}
                    type="number"
                    aria-label="maximum sign"
                    onBlur={(e) => updateMaxLength(parseInt(e.target.value))}
                />
            </FormField>
            <FormField label="Minimum antall tegn">
                <input
                    defaultValue={minLength}
                    type="number"
                    aria-label="minimum sign"
                    onBlur={(e) => {
                        const newValue = parseInt(e.target.value);
                        if (!newValue) {
                            removeItemExtension(item, IExtentionType.minLength, dispatch);
                        } else {
                            setItemExtension(
                                item,
                                {
                                    url: IExtentionType.minLength,
                                    valueInteger: newValue,
                                },
                                dispatch,
                            );
                        }
                    }}
                />
            </FormField>
        </div>
    );
};

export default ValidationAnswerTypeText;
