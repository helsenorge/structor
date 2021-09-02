import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import FormField from '../../FormField/FormField';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { setItemExtension } from '../../../helpers/extensionHelper';

type ValidationAnswerTypeAttachmentProps = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeAttachment = ({ item }: ValidationAnswerTypeAttachmentProps): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const maxSize = item.extension?.find((ext) => ext.url === IExtentionType.maxSize)?.valueDecimal || '';

    function updateMaxSize(size: number) {
        const extension = { url: IExtentionType.maxSize, valueDecimal: size };
        setItemExtension(item, extension, dispatch);
    }

    return (
        <FormField label={t('Max file size in MB')}>
            <input
                defaultValue={maxSize}
                type="number"
                aria-label="maximum filesize"
                onBlur={(e) => updateMaxSize(parseFloat(e.target.value))}
            />
        </FormField>
    );
};

export default ValidationAnswerTypeAttachment;
