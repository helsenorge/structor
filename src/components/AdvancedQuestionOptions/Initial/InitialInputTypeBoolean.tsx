import React, { useState } from 'react';
import { QuestionnaireItemInitial } from '../../../types/fhir';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';

type InitialInputTypeBooleanProps = {
    initial?: QuestionnaireItemInitial;
    dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeBoolean = (props: InitialInputTypeBooleanProps): JSX.Element => {
    const [initialValue, setInitialValue] = useState(getValue(props.initial));

    function getValue(initial: QuestionnaireItemInitial | undefined): boolean {
        if (!initial) {
            return false;
        }
        return initial.valueBoolean || false;
    }

    return (
        <div className="form-field">
            <SwitchBtn
                onChange={() => {
                    const newInitialValue = !initialValue;
                    setInitialValue(newInitialValue);
                    const newInitial: QuestionnaireItemInitial | undefined = newInitialValue
                        ? { valueBoolean: newInitialValue }
                        : undefined;
                    props.dispatchAction(newInitial);
                }}
                value={initialValue}
                label="Initiell verdi"
                initial={true}
            />
        </div>
    );
};

export default InitialInputTypeBoolean;
