import React from 'react';
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
    return (
        <div className="horizontal">
            <span>{`${props.descriptionText} er `}</span>
            <Select
                options={[
                    {
                        code: FhirPathDateOperator.NOVALIDATION,
                        display: '<uten validering>',
                    },
                    {
                        code: FhirPathDateOperator.EXACT,
                        display: 'dagens dato',
                    },
                    {
                        code: FhirPathDateOperator.PLUSS,
                        display: 'dagens dato pluss',
                    },
                    {
                        code: FhirPathDateOperator.MINUS,
                        display: 'dagens dato minus',
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
                        placeholder="tall"
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
                                display: 'dager',
                            },
                            {
                                code: 'weeks',
                                display: 'uker',
                            },
                            {
                                code: 'months',
                                display: 'måneder',
                            },
                            {
                                code: 'years',
                                display: 'år',
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
