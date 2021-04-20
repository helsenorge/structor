import React, { useContext } from 'react';
import { TreeContext } from '../../../store/treeStore/treeStore';
import GroupedSelect from '../../Select/GroupedSelect';
import { EnrichmentSet } from '../../../helpers/QuestionHelper';
import FormField from '../../FormField/FormField';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { updateExtensionValue } from '../../../helpers/extensionHelper';

type FhirPathSelectProps = {
    item: QuestionnaireItem;
};

const FhirPathSelect = (props: FhirPathSelectProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchUpdateItem = (name: IItemProperty, value: boolean) => {
        dispatch(updateItemAction(props.item.linkId, name, value));
    };

    const handleExtension = (extension: Extension) => {
        dispatch(
            updateItemAction(props.item.linkId, IItemProperty.extension, updateExtensionValue(props.item, extension)),
        );
    };

    const handleFhirpath = (fhirpath: string) => {
        const extension = {
            url: IExtentionType.fhirPath,
            valueString: fhirpath,
        };
        handleExtension(extension);
        dispatchUpdateItem(IItemProperty.readOnly, true);
    };

    const fhirPath = props.item.extension?.find((x) => x.url === IExtentionType.fhirPath)?.valueString ?? '';

    return (
        <FormField label="Beriking">
            <GroupedSelect
                value={fhirPath}
                options={EnrichmentSet}
                placeholder="Legg til en formel.."
                onChange={(event) => {
                    handleFhirpath(event.target.value);
                }}
                displaySelectedValue={true}
            />
        </FormField>
    );
};

export default FhirPathSelect;
