import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { ValueSetComposeIncludeConcept } from '../../../types/fhir';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import RadioBtn from '../../RadioBtn/RadioBtn';
import Select from '../../Select/Select';
import Typeahead from '../../Typeahead/Typeahead';

type Props = {
    linkId: string;
    selectedValueSet?: string;
};

const PredefinedValueSet = ({ linkId, selectedValueSet }: Props): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qContained } = state;

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
            dispatch(updateItemAction(linkId, IItemProperty.answerValueSet, `#${id}`));
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
                placeholder="Velg et alternativ.."
            />
        );
    };

    return (
        <div>
            <FormField label="Velg spørsmålsett">{handleSelect()}</FormField>
            <FormField>{renderPreDefinedValueSet()}</FormField>
        </div>
    );
};

export default PredefinedValueSet;
