import React from 'react';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';

type CalculatedExpressionProps = {
    item: QuestionnaireItem;
    updateExtension: (extension: Extension) => void;
    removeExtension: (extensionType: IExtentionType) => void;
};

const CalculatedExpression = (props: CalculatedExpressionProps): JSX.Element => {
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
        <FormField label="Kalkuleringsformel">
            <textarea defaultValue={calculatedExpression} onBlur={handleBlur} />
        </FormField>
    );
};

export default CalculatedExpression;
