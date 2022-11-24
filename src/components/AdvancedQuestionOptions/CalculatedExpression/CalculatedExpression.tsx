import React from 'react';
import { useTranslation } from 'react-i18next';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';

type CalculatedExpressionProps = {
    item: QuestionnaireItem;
    disabled?: boolean;
    updateExtension: (extension: Extension) => void;
    removeExtension: (extensionType: IExtentionType) => void;
};

const CalculatedExpression = (props: CalculatedExpressionProps): JSX.Element => {
    const { t } = useTranslation();
    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (!event.target.value) {
            props.removeExtension(IExtentionType.calculatedExpression);
        } else {
            const ceExtension: Extension = {
                url: IExtentionType.calculatedExpression,
                valueString: event.target.value,
            };
            props.updateExtension(ceExtension);
        }
    };

    const calculatedExpression =
        props.item.extension?.find((ext) => ext.url === IExtentionType.calculatedExpression)?.valueString || '';
    return (
        <FormField label={t('Calculation formula')}>
            <textarea defaultValue={calculatedExpression} onBlur={handleBlur} disabled={props.disabled} />
        </FormField>
    );
};

export default CalculatedExpression;
