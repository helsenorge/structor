import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    isItemControlCheckbox,
    isItemControlDropDown,
    isItemControlRadioButton,
    isItemControlSlider,
    ItemControlType,
} from '../../../helpers/itemControl';
import { QuestionnaireItem } from 'fhir/r4';
import FormField from '../../FormField/FormField';
import RadioBtn from '../../RadioBtn/RadioBtn';

interface Props {
    item: QuestionnaireItem;
    dispatchExtentionUpdate: (newValue: ItemControlType) => void;
}

const ChoiceTypeSelect = ({ item, dispatchExtentionUpdate }: Props): React.JSX.Element => {
    const { t } = useTranslation();

    const getSelectedItemControlValue = () => {
        if (isItemControlCheckbox(item)) {
            return ItemControlType.checkbox;
        } else if (isItemControlDropDown(item)) {
            return ItemControlType.dropdown;
        } else if (isItemControlRadioButton(item)) {
            return ItemControlType.radioButton;
        } else if (isItemControlSlider(item)) {
            return ItemControlType.slider;
        }

        return ItemControlType.dynamic;
    };

    return (
        <div className="horizontal">
            <FormField label={t('Display type')}>
                <RadioBtn
                    onChange={(newValue: string) => {
                        dispatchExtentionUpdate(newValue as ItemControlType);
                    }}
                    checked={getSelectedItemControlValue()}
                    options={[
                        {
                            code: ItemControlType.dynamic,
                            display: t('Dynamic'),
                        },
                        {
                            code: ItemControlType.radioButton,
                            display: t('Radio buttons'),
                        },
                        {
                            code: ItemControlType.dropdown,
                            display: t('Dropdown'),
                        },
                        {
                            code: ItemControlType.checkbox,
                            display: t('Checkbox (Allow selection of multiple values)'),
                        },
                        {
                            code: ItemControlType.slider,
                            display: t('Slider'),
                        },
                    ]}
                    name="choice-item-control-radio"
                />
            </FormField>
        </div>
    );
};

export default ChoiceTypeSelect;
