import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coding, QuestionnaireItem, QuestionnaireItemInitial } from '../../../types/fhir';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { TreeContext } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import { getValueSetValues } from '../../../helpers/valueSetHelper';

type InitialInputTypeChoiceProps = {
    item: QuestionnaireItem;
    dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeChoice = (props: InitialInputTypeChoiceProps): JSX.Element => {
    const { t } = useTranslation();
    const { state } = useContext(TreeContext);
    const { qContained } = state;

    const getInitialValue = (): string => {
        const {
            item: { initial },
        } = props;
        if (!initial || !initial[0]) {
            return '';
        }

        return initial[0]?.valueCoding?.code || '';
    };

    const hasInitialValue = (): boolean => {
        const {
            item: { initial },
        } = props;
        return initial !== undefined && initial[0] !== undefined && initial[0].valueCoding !== undefined;
    };

    const [initialValue, setInitialValue] = useState(getInitialValue());
    const [initialValueEnabled, setInitialValueEnabled] = useState(hasInitialValue());

    // TODO Support multiple initial values (for checkboxes)?

    const renderAnswerOption = (initialOption: Coding): JSX.Element => {
        return (
            <div key={initialOption.code} className="answerOption">
                <div className="radioBtn-div">
                    <input
                        className="radioBtn-input"
                        type="radio"
                        name={initialOption.system}
                        id={initialOption.code}
                        checked={initialOption.code === initialValue}
                        onChange={(event) => {
                            if (event.target.checked) {
                                setInitialValue(initialOption.code || '');
                            }
                            const newInitial = {
                                valueCoding: {
                                    system: initialOption.system,
                                    code: initialOption.code,
                                    display: initialOption.display,
                                },
                            };
                            props.dispatchAction(newInitial);
                        }}
                    />
                    {` `}
                    <label htmlFor={initialOption.code}>{initialOption.display}</label>
                </div>
            </div>
        );
    };

    const getContainedValueSetValues = (): Coding[] => {
        const valueSetId = props.item.answerValueSet;
        const containedValueSet = qContained?.find((valueSet) => `#${valueSet.id}` === valueSetId);
        return getValueSetValues(containedValueSet);
    };

    const renderAnswerOptions = (): JSX.Element => {
        let initialOptions: Coding[];
        if (props.item.answerValueSet) {
            initialOptions = getContainedValueSetValues();
        } else {
            initialOptions =
                props.item.answerOption?.map((answerOption) => {
                    return {
                        system: answerOption.valueCoding?.system || '',
                        code: answerOption.valueCoding?.code || '',
                        display: answerOption.valueCoding?.display || '',
                    };
                }) || [];
        }

        return (
            <>
                {initialOptions.map((option) => {
                    return renderAnswerOption(option);
                })}
            </>
        );
    };

    return (
        <FormField>
            <SwitchBtn
                label={t('Initial value')}
                onChange={() => {
                    const newInitialValueEnabled = !initialValueEnabled;
                    setInitialValueEnabled(newInitialValueEnabled);
                    if (!newInitialValueEnabled) {
                        setInitialValue('');
                        props.dispatchAction(undefined);
                    }
                }}
                value={initialValueEnabled}
            />
            {initialValueEnabled && renderAnswerOptions()}
        </FormField>
    );
};

export default InitialInputTypeChoice;
