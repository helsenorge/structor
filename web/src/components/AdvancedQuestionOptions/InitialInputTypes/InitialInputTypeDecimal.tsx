import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionnaireItemInitial } from '../../../types/fhir';
import FormField from '../../FormField/FormField';

type InitialInputTypeIntegerProps = {
    initial?: QuestionnaireItemInitial;
    dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeDecimal = (props: InitialInputTypeIntegerProps): JSX.Element => {
    const { t } = useTranslation();
    const [initialValue, setInitialValue] = useState(getValue(props.initial));

    function getValue(initial: QuestionnaireItemInitial | undefined): string {
        if (!initial) {
            return '';
        }
        return initial.valueDecimal?.toString() || '';
    }

    function isNumeric(value: string): boolean {
        return !isNaN(parseFloat(value));
    }

    return (
        <FormField label={t('Initial value')}>
            <input
                type="number"
                value={initialValue}
                onChange={({ target: { value } }) => {
                    const newValue = value.replace(/,/g, '.');
                    if (isNumeric(newValue) || value === '-' || value === '') {
                        setInitialValue(newValue);
                    }
                }}
                onBlur={() => {
                    const newInitial: QuestionnaireItemInitial | undefined = isNumeric(initialValue)
                        ? { valueDecimal: parseFloat(initialValue) }
                        : undefined;
                    props.dispatchAction(newInitial);
                }}
            />
        </FormField>
    );
};

export default InitialInputTypeDecimal;
