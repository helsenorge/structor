import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionnaireItem, Extension } from 'fhir/r4';
import FormField from '../../FormField/FormField';
import { IExtensionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { FhirPathDateValidation } from './FhirPathDateValidation';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import {
    generateFhirPathValueString,
    getDateNumber,
    getDateOperator,
    getDateUnit,
} from '../../../helpers/fhirPathDateValidation';
import InputField from '../../InputField/inputField';

type Props = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeDate = ({ item }: Props): React.JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);

    const validationText = item?.extension?.find((x) => x.url === IExtensionType.validationtext)?.valueString || '';
    const minDate = item?.extension?.find((x) => x.url === IExtensionType.minValue)?.valueDate;
    const maxDate = item?.extension?.find((x) => x.url === IExtensionType.maxValue)?.valueDate;

    const fhirPathMinDate = item?.extension?.find((x) => x.url === IExtensionType.fhirPathMinValue)?.valueString;
    const fhirPathMaxDate = item?.extension?.find((x) => x.url === IExtensionType.fhirPathMaxValue)?.valueString;

    const [fhirPathMinDateOperator, setFhirPathMinDateOperator] = React.useState<string>(
        getDateOperator(fhirPathMinDate, minDate),
    );
    const [fhirPathMinDateNumber, setFhirPathMinDateNumber] = React.useState<string>(getDateNumber(fhirPathMinDate));
    const [fhirPathMinDateUnit, setFhirPathMinDateUnit] = React.useState<string>(getDateUnit(fhirPathMinDate));

    const [fhirPathMaxDateOperator, setFhirPathMaxDateOperator] = React.useState<string>(
        getDateOperator(fhirPathMaxDate, maxDate),
    );
    const [fhirPathMaxDateNumber, setFhirPathMaxDateNumber] = React.useState<string>(getDateNumber(fhirPathMaxDate));
    const [fhirPathMaxDateUnit, setFhirPathMaxDateUnit] = React.useState<string>(getDateUnit(fhirPathMaxDate));

    const setAbsoluteValueExtension = (updatedValue: string, extensionUrl: string) => {
        if (updatedValue) {
            const newExtention: Extension = {
                url: extensionUrl,
                valueDate: updatedValue,
            };
            setItemExtension(item, newExtention, dispatch);
        } else {
            removeItemExtension(item, extensionUrl, dispatch);
        }
    };

    const setFhirPathExtension = (updatedValue: string, extensionUrl: string, extensions: Extension[]) => {
        const extensionsToSet = updatedValue
            ? [
                  ...extensions,
                  {
                      url: extensionUrl,
                      valueString: updatedValue,
                  },
              ]
            : extensions;

        dispatch(updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet));
    };

    const setMinDateExpression = (
        operator: string | undefined,
        value: string | undefined,
        unit: string | undefined,
    ) => {
        const newFhirPathMinValue = generateFhirPathValueString(operator, value, unit);
        const filteredExtensions = (item.extension || []).filter(
            (x: Extension) => x.url !== IExtensionType.fhirPathMinValue && x.url !== IExtensionType.minValue,
        );
        setFhirPathExtension(newFhirPathMinValue, IExtensionType.fhirPathMinValue, filteredExtensions);
    };

    const setMaxDateExpression = (
        operator: string | undefined,
        value: string | undefined,
        unit: string | undefined,
    ) => {
        const newFhirPathMaxValue = generateFhirPathValueString(operator, value, unit);
        const filteredExtensions = (item.extension || []).filter(
            (x: Extension) => x.url !== IExtensionType.fhirPathMaxValue && x.url !== IExtensionType.maxValue,
        );
        setFhirPathExtension(newFhirPathMaxValue, IExtensionType.fhirPathMaxValue, filteredExtensions);
    };

    return (
        <>
            <FormField label={t('Enter custom error message')}>
                <InputField
                    defaultValue={validationText}
                    onBlur={(event) => {
                        if (event.target.value) {
                            const newExtention: Extension = {
                                url: IExtensionType.validationtext,
                                valueString: event.target.value,
                            };
                            setItemExtension(item, newExtention, dispatch);
                        } else {
                            removeItemExtension(item, IExtensionType.validationtext, dispatch);
                        }
                    }}
                />
            </FormField>
            <FormField>
                <FhirPathDateValidation
                    descriptionText={t('Min date')}
                    numberValue={fhirPathMinDateNumber}
                    unitValue={fhirPathMinDateUnit}
                    operatorValue={fhirPathMinDateOperator}
                    absoluteDateValue={minDate}
                    onChangeAbsoluteValue={(newValue: string) => {
                        setAbsoluteValueExtension(newValue, IExtensionType.minValue);
                    }}
                    onChangeNumberValue={(newValue: string) => {
                        setFhirPathMinDateNumber(newValue);
                        setMinDateExpression(fhirPathMinDateOperator, newValue, fhirPathMinDateUnit);
                    }}
                    onChangeUnitValue={(newValue: string) => {
                        setFhirPathMinDateUnit(newValue);
                        setMinDateExpression(fhirPathMinDateOperator, fhirPathMinDateNumber, newValue);
                    }}
                    onChangeOperatorValue={(newValue: string) => {
                        setFhirPathMinDateOperator(newValue);
                        setMinDateExpression(newValue, fhirPathMinDateNumber, fhirPathMinDateUnit);
                    }}
                />
                <FhirPathDateValidation
                    descriptionText={t('Max date')}
                    numberValue={fhirPathMaxDateNumber}
                    unitValue={fhirPathMaxDateUnit}
                    operatorValue={fhirPathMaxDateOperator}
                    absoluteDateValue={maxDate}
                    onChangeAbsoluteValue={(newValue: string) => {
                        setAbsoluteValueExtension(newValue, IExtensionType.maxValue);
                    }}
                    onChangeNumberValue={(newValue: string) => {
                        setFhirPathMaxDateNumber(newValue);
                        setMaxDateExpression(fhirPathMaxDateOperator, newValue, fhirPathMaxDateUnit);
                    }}
                    onChangeUnitValue={(newValue: string) => {
                        setFhirPathMaxDateUnit(newValue);
                        setMaxDateExpression(fhirPathMaxDateOperator, fhirPathMaxDateNumber, newValue);
                    }}
                    onChangeOperatorValue={(newValue: string) => {
                        setFhirPathMaxDateOperator(newValue);
                        setMaxDateExpression(newValue, fhirPathMaxDateNumber, fhirPathMaxDateUnit);
                    }}
                />
            </FormField>
        </>
    );
};

export default ValidationAnswerTypeDate;
