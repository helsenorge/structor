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
        return initial.valueInteger?.toString() || '';
    }

    function isInteger(value: string): boolean {
        return /^\d+$/.test(value);
    }

    return (
        <div className="form-field">
            <label>Initiell verdi</label>
            <input
                value={initialValue}
                onChange={(event) => {
                    if (isInteger(event.target.value) || event.target.value === '') {
                        setInitialValue(event.target.value);
                    }
                }}
                onBlur={() => {
                    const newInitial: QuestionnaireItemInitial | undefined = isInteger(initialValue)
                        ? { valueInteger: parseInt(initialValue) }
                        : undefined;
                    props.dispatchAction(newInitial);
                }}
            />
        </div>
    );
};

export default InitialInputTypeInteger;
