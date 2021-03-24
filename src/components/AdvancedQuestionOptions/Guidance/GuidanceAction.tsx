import React, { FocusEvent, useContext } from 'react';

import { getGuidanceAction } from '../../../helpers/QuestionHelper';
import {
    createGuidanceActionExtension,
    hasExtension,
    removeExtensionValue,
    updateExtensionValue,
} from '../../../helpers/extensionHelper';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { updateItemAction } from '../../../store/treeStore/treeActions';

import FormField from '../../FormField/FormField';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';

type GuidanceActionProps = {
    item: QuestionnaireItem;
};

const GuidanceAction = (props: GuidanceActionProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const hasGuidanceAction = hasExtension(props.item, IExtentionType.guidanceAction);
    const action = getGuidanceAction(props.item);

    const toggleGuidanceAction = () => {
        let newExtensions;
        if (hasGuidanceAction) {
            newExtensions = removeExtensionValue(props.item, IExtentionType.guidanceAction)?.extension;
        } else {
            newExtensions = updateExtensionValue(props.item, createGuidanceActionExtension());
        }
        dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, newExtensions));
    };

    const updateGuidanceAction = (event: FocusEvent<HTMLInputElement>) => {
        const newExtensions = updateExtensionValue(props.item, createGuidanceActionExtension(event.target.value));
        dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, newExtensions));
    };

    return (
        <div>
            <FormField>
                <SwitchBtn
                    onChange={toggleGuidanceAction}
                    value={hasGuidanceAction}
                    label="Send bruker videre etter fullført skjema"
                    initial
                />
            </FormField>
            {hasGuidanceAction && (
                <FormField label="Mål">
                    <input defaultValue={action} placeholder="F.eks. /infoside" onBlur={updateGuidanceAction} />
                </FormField>
            )}
        </div>
    );
};

export default GuidanceAction;
