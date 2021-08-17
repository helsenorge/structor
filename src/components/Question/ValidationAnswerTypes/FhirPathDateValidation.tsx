import React from 'react';
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
                        code: FhirPathDateOperator.ABSOLUTE,
                        display: 'fast dato',
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
                        /*
                        if (date) {
                            const newExtention: Extension = {
                                url: IExtentionType.minValue,
                                valueDate: format(date, 'yyyy-MM-dd'),
                            };
                            setItemExtension(item, newExtention, dispatch);
                        } else {
                            removeItemExtension(item, IExtentionType.minValue, dispatch);
                        }
                        */
                    }}
                />
            )}
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
