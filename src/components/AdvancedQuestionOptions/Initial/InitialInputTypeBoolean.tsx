import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionnaireItemInitial } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';

type InitialInputTypeBooleanProps = {
    initial?: QuestionnaireItemInitial;
    dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeBoolean = (props: InitialInputTypeBooleanProps): JSX.Element => {
    const { t } = useTranslation();
    const [initialValue, setInitialValue] = useState(getValue(props.initial));

    function getValue(initial: QuestionnaireItemInitial | undefined): boolean {
        if (!initial) {
            return false;
        }
        return initial.valueBoolean || false;
    }

    return (
        <FormField>
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
                label={t('Initial value')}
            />
        </FormField>
    );
};

export default InitialInputTypeBoolean;
