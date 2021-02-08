import React, { useState } from 'react';
import { QuestionnaireItemInitial } from '../../../types/fhir';

type InitialInputTypeStringProps = {
    initial?: QuestionnaireItemInitial;
    onBlur: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeString = (props: InitialInputTypeStringProps): JSX.Element => {
    const [initialValue, setInitialValue] = useState(getValue(props.initial));

    function getValue(initial: QuestionnaireItemInitial | undefined): string {
        if (!initial) {
            return '';
        }
        return initial.valueString || '';
    }

    return (
        <div className="form-field">
            <label>Initiell verdi</label>
            <input
                value={initialValue}
                onChange={(event) => setInitialValue(event.target.value)}
                onBlur={() => {
                    const newInitial: QuestionnaireItemInitial | undefined = initialValue
                        ? { valueString: initialValue }
                        : undefined;
                    props.onBlur(newInitial);
                }}
            />
        </div>
    );
};

export default InitialInputTypeString;
