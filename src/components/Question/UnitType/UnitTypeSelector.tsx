import React, { ChangeEvent } from 'react';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import {
    QUANTITY_UNIT_TYPE_CUSTOM,
    QUANTITY_UNIT_TYPE_NOT_SELECTED,
    quantityUnitTypes,
} from '../../../helpers/QuestionHelper';
import { removeExtensionValue, updateExtensionValue } from '../../../helpers/extensionHelper';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { Coding, Extension, QuestionnaireItem } from '../../../types/fhir';
import SystemField from '../../FormField/SystemField';
import { createSystemUUID } from '../../../helpers/systemHelper';

type UnitTypeSelectorProps = {
    item: QuestionnaireItem;
    dispatchUpdateItem: (itemProperty: IItemProperty, extension: Array<Extension>) => void;
};

const UnitTypeSelector = (props: UnitTypeSelectorProps): JSX.Element => {
    const updateQuantityUnitType = (event: ChangeEvent<HTMLSelectElement>): void => {
        const {
            target: { value: quantityUnitTypeCode },
        } = event;
        let updatedExtensions: Extension[];
        if (quantityUnitTypeCode === QUANTITY_UNIT_TYPE_NOT_SELECTED) {
            updatedExtensions = removeExtensionValue(props.item, IExtentionType.questionnaireUnit)?.extension || [];
        } else {
            const coding =
                quantityUnitTypeCode === QUANTITY_UNIT_TYPE_CUSTOM
                    ? { code: '', display: '', system: createSystemUUID() }
                    : quantityUnitTypes.find(({ code: predefinedCode }) => predefinedCode === quantityUnitTypeCode);
            const unitExtension: Extension = {
                url: IExtentionType.questionnaireUnit,
                valueCoding: coding,
            };
            updatedExtensions = updateExtensionValue(props.item, unitExtension);
        }
        props.dispatchUpdateItem(IItemProperty.extension, updatedExtensions);
    };

    const getCurrentQuantityUnitTypeCoding = () => {
        return props.item.extension?.find((extension) => {
            return extension.url === IExtentionType.questionnaireUnit;
        })?.valueCoding;
    };

    const updateCustomQuantityUnitType = (
        property: 'code' | 'display' | 'system',
        event: React.FocusEvent<HTMLInputElement>,
    ) => {
        const currentValueCoding = getCurrentQuantityUnitTypeCoding();
        let newValueCoding: Coding;
        if (currentValueCoding) {
            newValueCoding = { ...currentValueCoding, [property]: event.target.value };
        } else {
            newValueCoding = { [property]: event.target.value };
        }
        const unitExtension: Extension = {
            url: IExtentionType.questionnaireUnit,
            valueCoding: newValueCoding,
        };
        props.dispatchUpdateItem(IItemProperty.extension, updateExtensionValue(props.item, unitExtension));
    };

    const getQuantityUnitType = (): string => {
        const quantityUnitTypeCoding = getCurrentQuantityUnitTypeCoding();

        if (!quantityUnitTypeCoding) {
            return QUANTITY_UNIT_TYPE_NOT_SELECTED;
        }

        const {
            code: currentCode = '',
            display: currentDisplay = '',
            system: currentSystem = '',
        } = quantityUnitTypeCoding;

        const isPredefined = quantityUnitTypes.some(
            (type) =>
                type.code !== QUANTITY_UNIT_TYPE_CUSTOM &&
                type.code === currentCode &&
                type.display === currentDisplay &&
                type.system === currentSystem,
        );

        if (isPredefined) {
            return currentCode;
        }

        return QUANTITY_UNIT_TYPE_CUSTOM;
    };

    const selectedUnitType = getQuantityUnitType();
    const isCustom = selectedUnitType === QUANTITY_UNIT_TYPE_CUSTOM;
    const currentCoding = getCurrentQuantityUnitTypeCoding();
    const { code, display, system } = currentCoding ? currentCoding : { code: '', display: '', system: '' };

    return (
        <>
            <FormField label="Velg enhet">
                <Select options={quantityUnitTypes} onChange={updateQuantityUnitType} value={selectedUnitType} />
            </FormField>
            {isCustom && (
                <>
                    <div className="horizontal equal">
                        <FormField label="Display">
                            <input
                                defaultValue={display}
                                onBlur={(event) => updateCustomQuantityUnitType('display', event)}
                            />
                        </FormField>
                        <FormField label="Code">
                            <input
                                defaultValue={code}
                                onBlur={(event) => updateCustomQuantityUnitType('code', event)}
                            />
                        </FormField>
                    </div>
                    <div className="horizontal full">
                        <SystemField value={system} onBlur={(event) => updateCustomQuantityUnitType('system', event)} />
                    </div>
                </>
            )}
        </>
    );
};

export default UnitTypeSelector;
