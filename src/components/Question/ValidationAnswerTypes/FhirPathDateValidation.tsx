import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, parse } from 'date-fns';
import Picker from '../../DatePicker/DatePicker';
import Select from '../../Select/Select';

export enum FhirPathDateOperator {
    NOVALIDATION = 'no_validation',
    ABSOLUTE = 'abs',
    EXACT = 'exact',
    PLUSS = '+',
    MINUS = '-',
}

interface FhirPathDateValidationProps {
    descriptionText: string;
    numberValue: string;
    unitValue: string;
    operatorValue: string;
    absoluteDateValue?: string;
    onChangeAbsoluteValue: (newValue: string) => void;
    onChangeNumberValue: (newValue: string) => void;
    onChangeUnitValue: (newValue: string) => void;
    onChangeOperatorValue: (newValue: string) => void;
}

export const FhirPathDateValidation = (props: FhirPathDateValidationProps): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div className="horizontal">
            <span>{`${props.descriptionText} ${t('is')} `}</span>
            <Select
                options={[
                    {
                        code: FhirPathDateOperator.NOVALIDATION,
                        display: t('<no validation>'),
                    },
                    {
                        code: FhirPathDateOperator.ABSOLUTE,
                        display: t('a set date'),
                    },
                    {
                        code: FhirPathDateOperator.EXACT,
                        display: t('today'),
                    },
                    {
                        code: FhirPathDateOperator.PLUSS,
                        display: t('today plus'),
                    },
                    {
                        code: FhirPathDateOperator.MINUS,
                        display: t('today minus'),
                    },
                ]}
                value={props.operatorValue}
                onChange={(event) => {
                    props.onChangeOperatorValue(event.target.value);
                }}
            />
            {props.operatorValue === FhirPathDateOperator.ABSOLUTE && (
                <Picker
                    selected={
                        props.absoluteDateValue ? parse(props.absoluteDateValue, 'yyyy-MM-dd', new Date()) : undefined
                    }
                    type="date"
                    disabled={false}
                    callback={(date) => {
                        const newDateString = date ? format(date, 'yyyy-MM-dd') : '';
                        props.onChangeAbsoluteValue(newDateString);
                    }}
                />
            )}
            {(props.operatorValue === FhirPathDateOperator.PLUSS ||
                props.operatorValue === FhirPathDateOperator.MINUS) && (
                <>
                    <input
                        type="number"
                        placeholder={t('number')}
                        className="date-validation-input"
                        defaultValue={props.numberValue}
                        onChange={(event) => {
                            props.onChangeNumberValue(event.target.value);
                        }}
                    />
                    <Select
                        placeholder={t('Unit')}
                        options={[
                            {
                                code: 'days',
                                display: t('days'),
                            },
                            {
                                code: 'weeks',
                                display: t('weeks'),
                            },
                            {
                                code: 'months',
                                display: t('months'),
                            },
                            {
                                code: 'years',
                                display: t('year'),
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
