import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { isItemControlCheckbox, isItemControlDropDown, ItemControlType } from '../../../helpers/itemControl';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../../types/fhir';
import { checkboxExtension, dropdownExtension } from '../../../helpers/QuestionHelper';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import RadioBtn from '../../RadioBtn/RadioBtn';
import Select from '../../Select/Select';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import Typeahead from '../../Typeahead/Typeahead';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';

type Props = {
    item: QuestionnaireItem;
    selectedValueSet?: string;
};

const PredefinedValueSet = ({ item, selectedValueSet }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const { qContained } = state;

    const dispatchExtentionUpdate = (type: ItemControlType.checkbox | ItemControlType.dropdown) => {
        removeItemExtension(item, IExtentionType.itemControl, dispatch);
        if (type === ItemControlType.checkbox && !isItemControlCheckbox(item)) {
            setItemExtension(item, checkboxExtension, dispatch);
        } else if (type === ItemControlType.dropdown && !isItemControlDropDown(item)) {
            setItemExtension(item, dropdownExtension, dispatch);
        }
    };

    const getContainedValueSetValues = (valueSetId: string): Array<{ system?: string; display?: string }> => {
        const valueSet = qContained?.find((x) => x.id === valueSetId);
        if (valueSet && valueSet.compose && valueSet.compose.include && valueSet.compose.include[0].concept) {
            return valueSet.compose.include[0].concept.map((x) => {
                return { system: valueSet.compose?.include[0].system, display: x.display };
            });
        }
        return [];
    };

    const containedValueSets =
        qContained?.map((valueSet) => {
            return {
                code: valueSet.id,
                display: valueSet.title,
            } as ValueSetComposeIncludeConcept;
        }) || [];

    const handleDisplaySelected = () => {
        if (selectedValueSet && selectedValueSet.indexOf('#') >= 0) {
            return selectedValueSet.substring(1);
        }
        return '';
    };

    const handleDisplaySelectedTitle = () => {
        if (selectedValueSet && selectedValueSet.indexOf('#') >= 0) {
            const id = selectedValueSet.substring(1);
            return qContained?.find((x) => x.id === id)?.title || '';
        }
        return '';
    };

    const renderPreDefinedValueSet = () => {
        const selectedValueSet = handleDisplaySelected();
        if (selectedValueSet !== '') {
            return getContainedValueSetValues(selectedValueSet).map((x, index) => {
                return <RadioBtn name={x.system} key={index} disabled showDelete={false} value={x.display} />;
            });
        }

        return undefined;
    };

    const handleSelectedValueSet = (id: string) => {
        const valueSet = qContained?.find((x) => x.id === id);
        if (valueSet) {
            dispatch(updateItemAction(item.linkId, IItemProperty.answerValueSet, `#${id}`));
        }
    };

    const handleSelect = () => {
        if (containedValueSets.length > 5) {
            return (
                <Typeahead
                    defaultValue={handleDisplaySelectedTitle()}
                    items={containedValueSets}
                    onChange={handleSelectedValueSet}
                />
            );
        }

        return (
            <Select
                value={handleDisplaySelected()}
                options={containedValueSets || []}
                onChange={(event) => handleSelectedValueSet(event.target.value)}
                placeholder={t('Velg et alternativ..')}
            />
        );
    };

    return (
        <div>
            <div className="horizontal">
                <div className="form-field">
                    <SwitchBtn
                        label={t('Flere valg mulig')}
                        onChange={() => dispatchExtentionUpdate(ItemControlType.checkbox)}
                        initial
                        value={isItemControlCheckbox(item)}
                    />
                </div>
                <div className="form-field">
                    <SwitchBtn
                        label={t('Nedtrekksmeny')}
                        onChange={() => dispatchExtentionUpdate(ItemControlType.dropdown)}
                        initial
                        value={isItemControlDropDown(item)}
                    />
                </div>
            </div>
            <FormField label="Velg spørsmålsett">{handleSelect()}</FormField>
            <FormField>{renderPreDefinedValueSet()}</FormField>
        </div>
    );
};

export default PredefinedValueSet;
