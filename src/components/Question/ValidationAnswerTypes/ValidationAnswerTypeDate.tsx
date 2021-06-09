import React, { useContext } from 'react';
import { QuestionnaireItem, Extension } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import Picker from '../../DatePicker/DatePicker';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { format, parse } from 'date-fns';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { FhirPathDateValidation } from './FhirPathDateValidation';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import {
    generateFhirPathValueString,
    getDateNumber,
    getDateOperator,
    getDateUnit,
} from '../../../helpers/fhirPathDateValidation';

type Props = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeDate = ({ item }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const minDate = item?.extension?.find((x) => x.url === IExtentionType.minValue)?.valueDate;
    const maxDate = item?.extension?.find((x) => x.url === IExtentionType.maxValue)?.valueDate;

    const fhirPathValidationExtension = item?.extension?.find((x) => x.url === IExtentionType.fhirPathValidation);
    const fhirPathMinDate = item?.extension?.find((x) => x.url === IExtentionType.fhirPathMinValue)?.valueString;
    const fhirPathMaxDate = item?.extension?.find((x) => x.url === IExtentionType.fhirPathMaxValue)?.valueString;

    const [isAbsDateValidation, setIsAbsDateValidation] = React.useState<boolean>(!fhirPathValidationExtension);

    const [fhirPathMinDateOperator, setFhirPathMinDateOperator] = React.useState<string>(
        getDateOperator(fhirPathMinDate),
    );
    const [fhirPathMinDateNumber, setFhirPathMinDateNumber] = React.useState<string>(getDateNumber(fhirPathMinDate));
    const [fhirPathMinDateUnit, setFhirPathMinDateUnit] = React.useState<string>(getDateUnit(fhirPathMinDate));

    const [fhirPathMaxDateOperator, setFhirPathMaxDateOperator] = React.useState<string>(
        getDateOperator(fhirPathMaxDate),
    );
    const [fhirPathMaxDateNumber, setFhirPathMaxDateNumber] = React.useState<string>(getDateNumber(fhirPathMaxDate));
    const [fhirPathMaxDateUnit, setFhirPathMaxDateUnit] = React.useState<string>(getDateUnit(fhirPathMaxDate));

    const clearDateValidationExtensions = (): void => {
        const extensionsToSet = (item.extension || []).filter(
            (x: Extension) =>
                x.url !== IExtentionType.fhirPathMinValue &&
                x.url !== IExtentionType.fhirPathMaxValue &&
                x.url !== IExtentionType.minValue &&
                x.url !== IExtentionType.maxValue &&
                x.url !== IExtentionType.fhirPathValidation,
        );
        setFhirPathMinDateOperator('');
        setFhirPathMinDateNumber('');
        setFhirPathMinDateUnit('');
        setFhirPathMaxDateOperator('');
        setFhirPathMaxDateNumber('');
        setFhirPathMaxDateUnit('');
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
    };

    const generateFhirPathValidationExtension = (minDateString: string, maxDateString: string): Extension => {
        const andExpression = minDateString && maxDateString ? 'and' : '';
        const minDateExperssion = minDateString ? `this.value >= ${minDateString}` : '';
        const maxDateExperssion = maxDateString ? `this.value <= ${maxDateString}` : '';
        const expression = `${maxDateExperssion} ${andExpression} ${minDateExperssion}`;

        return {
            url: IExtentionType.fhirPathValidation,
            valueString: expression.trim(),
        };
    };

    const setMinDateExpression = (operator: string, value: string, unit: string) => {
        const newFhirPathMinValue = generateFhirPathValueString(operator, value, unit);
        const fhirPathMaxValue = generateFhirPathValueString(
            fhirPathMaxDateOperator,
            fhirPathMaxDateNumber,
            fhirPathMaxDateUnit,
        );

        const extensionsToSet = (item.extension || []).filter(
            (x: Extension) => x.url !== IExtentionType.fhirPathMinValue && x.url !== IExtentionType.fhirPathValidation,
        );

        if (newFhirPathMinValue) {
            const newMinDateExtention = {
                url: IExtentionType.fhirPathMinValue,
                valueString: newFhirPathMinValue,
            };
            extensionsToSet.push(newMinDateExtention);
        }

        if (newFhirPathMinValue || fhirPathMaxValue) {
            extensionsToSet.push(generateFhirPathValidationExtension(newFhirPathMinValue, fhirPathMaxValue));
        }
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
    };

    const setMaxDateExpression = (operator: string, value: string, unit: string) => {
        const fhirPathMinValue = generateFhirPathValueString(
            fhirPathMinDateOperator,
            fhirPathMinDateNumber,
            fhirPathMinDateUnit,
        );
        const newFhirPathMaxValue = generateFhirPathValueString(operator, value, unit);

        const extensionsToSet = (item.extension || []).filter(
            (x: Extension) => x.url !== IExtentionType.fhirPathMaxValue && x.url !== IExtentionType.fhirPathValidation,
        );

        if (newFhirPathMaxValue) {
            const newMaxDateExtention = {
                url: IExtentionType.fhirPathMaxValue,
                valueString: newFhirPathMaxValue,
            };
            extensionsToSet.push(newMaxDateExtention);
        }

        if (fhirPathMinValue || newFhirPathMaxValue) {
            extensionsToSet.push(generateFhirPathValidationExtension(fhirPathMinValue, newFhirPathMaxValue));
        }
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
    };

    return (
        <>
            <FormField label="Legg til egendefinert feilmelding:">
                <input
                    defaultValue={validationText}
                    onBlur={(event) => {
                        if (event.target.value) {
                            const newExtention: Extension = {
                                url: IExtentionType.validationtext,
                                valueString: event.target.value,
                            };
                            setItemExtension(item, newExtention, dispatch);
                        } else {
                            removeItemExtension(item, IExtentionType.validationtext, dispatch);
                        }
                    }}
                />
            </FormField>
            <div className="horizontal">
                <label>
                    <input
                        type="radio"
                        checked={isAbsDateValidation}
                        name="date-validation-type"
                        onChange={(): void => {
                            setIsAbsDateValidation(true);
                            clearDateValidationExtensions();
                        }}
                    />
                    <span> Absolutt datovalidering</span>
                </label>
                <label>
                    <input
                        type="radio"
                        checked={!isAbsDateValidation}
                        name="date-validation-type"
                        onChange={(): void => {
                            setIsAbsDateValidation(false);
                            clearDateValidationExtensions();
                        }}
                    />
                    <span> Datovalidering beregnet ut fra dagens dato</span>
                </label>
            </div>
            <div>{` `}</div>
            {!isAbsDateValidation && (
                <div className="form-field">
                    <FhirPathDateValidation
                        descriptionText="Min dato"
                        numberValue={fhirPathMinDateNumber}
                        unitValue={fhirPathMinDateUnit}
                        operatorValue={fhirPathMinDateOperator}
                        onChangeNumberValue={(newValue: string) => {
                            setFhirPathMinDateNumber(newValue);
                            setMinDateExpression(fhirPathMinDateOperator || '', newValue, fhirPathMinDateUnit || '');
                        }}
                        onChangeUnitValue={(newValue: string) => {
                            setFhirPathMinDateUnit(newValue);
                            setMinDateExpression(fhirPathMinDateOperator || '', fhirPathMinDateNumber || '', newValue);
                        }}
                        onChangeOperatorValue={(newValue: string) => {
                            setFhirPathMinDateOperator(newValue);
                            setMinDateExpression(
                                newValue || '',
                                fhirPathMinDateNumber || '',
                                fhirPathMinDateUnit || '',
                            );
                        }}
                    />
                    <FhirPathDateValidation
                        descriptionText="Max dato"
                        numberValue={fhirPathMaxDateNumber}
                        unitValue={fhirPathMaxDateUnit}
                        operatorValue={fhirPathMaxDateOperator}
                        onChangeNumberValue={(newValue: string) => {
                            setFhirPathMaxDateNumber(newValue);
                            setMaxDateExpression(fhirPathMaxDateOperator || '', newValue, fhirPathMaxDateUnit || '');
                        }}
                        onChangeUnitValue={(newValue: string) => {
                            setFhirPathMaxDateUnit(newValue);
                            setMaxDateExpression(fhirPathMaxDateOperator || '', fhirPathMaxDateNumber || '', newValue);
                        }}
                        onChangeOperatorValue={(newValue: string) => {
                            setFhirPathMaxDateOperator(newValue);
                            setMaxDateExpression(
                                newValue || '',
                                fhirPathMaxDateNumber || '',
                                fhirPathMaxDateUnit || '',
                            );
                        }}
                    />
                </div>
            )}
            {isAbsDateValidation && (
                <div className="horizontal">
                    <FormField label="Min dato:">
                        <Picker
                            selected={minDate ? parse(minDate, 'yyyy-MM-dd', new Date()) : undefined}
                            type="date"
                            disabled={false}
                            callback={(date) => {
                                if (date) {
                                    const newExtention: Extension = {
                                        url: IExtentionType.minValue,
                                        valueDate: format(date, 'yyyy-MM-dd'),
                                    };
                                    setItemExtension(item, newExtention, dispatch);
                                } else {
                                    removeItemExtension(item, IExtentionType.minValue, dispatch);
                                }
                            }}
                        />
                    </FormField>
                    <FormField label="Max dato:">
                        <Picker
                            selected={maxDate ? parse(maxDate, 'yyyy-MM-dd', new Date()) : undefined}
                            type="date"
                            disabled={false}
                            callback={(date) => {
                                if (date) {
                                    const newExtention: Extension = {
                                        url: IExtentionType.maxValue,
                                        valueDate: format(date, 'yyyy-MM-dd'),
                                    };
                                    setItemExtension(item, newExtention, dispatch);
                                } else {
                                    removeItemExtension(item, IExtentionType.maxValue, dispatch);
                                }
                            }}
                        />
                    </FormField>
                </div>
            )}
        </>
    );
};

export default ValidationAnswerTypeDate;
