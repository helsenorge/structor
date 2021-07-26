import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from '../../Select/Select';

export enum FhirPathDateOperator {
    NOVALIDATION = 'no_validation',
    EXACT = 'exact',
    PLUSS = '+',
    MINUS = '-',
}

interface FhirPathDateValidationProps {
    descriptionText: string;
    numberValue: string;
    unitValue: string;
    operatorValue: string;
    onChangeNumberValue: (newValue: string) => void;
    onChangeUnitValue: (newValue: string) => void;
    onChangeOperatorValue: (newValue: string) => void;
}

export const FhirPathDateValidation = (props: FhirPathDateValidationProps): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div className="horizontal">
            <span>{`${props.descriptionText} ${t('er')} `}</span>
            <Select
                options={[
                    {
                        code: FhirPathDateOperator.NOVALIDATION,
                        display: t('<uten validering>'),
                    },
                    {
                        code: FhirPathDateOperator.EXACT,
                        display: t('dagens dato'),
                    },
                    {
                        code: FhirPathDateOperator.PLUSS,
                        display: t('dagens dato pluss'),
                    },
                    {
                        code: FhirPathDateOperator.MINUS,
                        display: t('dagens dato minus'),
                    },
                ]}
                value={props.operatorValue}
                onChange={(event) => {
                    props.onChangeOperatorValue(event.target.value);
                }}
            />
            {(props.operatorValue === FhirPathDateOperator.PLUSS ||
                props.operatorValue === FhirPathDateOperator.MINUS) && (
                <>
                    <input
                        type="number"
                        placeholder={t('tall')}
                        className="date-validation-input"
                        defaultValue={props.numberValue}
                        onChange={(event) => {
                            props.onChangeNumberValue(event.target.value);
                        }}
                    />
                    <Select
                        placeholder="Enhet"
                        options={[
                            {
                                code: 'days',
                                display: t('dager'),
                            },
                            {
                                code: 'weeks',
                                display: t('uker'),
                            },
                            {
                                code: 'months',
                                display: t('måneder'),
                            },
                            {
                                code: 'years',
                                display: t('år'),
                            },
                        ]}
                        value={props.unitValue}
                        onChange={(event) => {
                            props.onChangeUnitValue(event.target.value);
                        }}
                    />
                </>
            )}
        </div>
    );
};
