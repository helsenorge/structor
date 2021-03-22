import React, { useContext } from 'react';
import FormField from '../../FormField/FormField';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { updateExtensionValue } from '../../../helpers/extensionHelper';

type ValidationAnswerTypeAttachmentProps = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeAttachment = ({ item }: ValidationAnswerTypeAttachmentProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const maxSize = item.extension?.find((ext) => ext.url === IExtentionType.maxSize)?.valueDecimal || '';

    function updateMaxSize(size: number) {
        const newExtension = updateExtensionValue(item, { url: IExtentionType.maxSize, valueDecimal: size });
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, newExtension));
    }

    return (
        <>
            <FormField label="Maksimal filstørrelse i MB">
                <input
                    defaultValue={maxSize}
                    type="number"
                    aria-label="maximum filesize"
                    onBlur={(e) => updateMaxSize(parseFloat(e.target.value))}
                ></input>
            </FormField>
        </>
    );
};

export default ValidationAnswerTypeAttachment;
