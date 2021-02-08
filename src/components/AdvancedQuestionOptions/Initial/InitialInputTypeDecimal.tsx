import React, { useState } from 'react';
import { QuestionnaireItemInitial } from '../../../types/fhir';

type InitialInputTypeIntegerProps = {
    initial?: QuestionnaireItemInitial;
    dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeInteger = (props: InitialInputTypeIntegerProps): JSX.Element => {
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
        <div className="form-field">
            <label>Initiell verdi</label>
            <input
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
        </div>
    );
};

export default InitialInputTypeInteger;
