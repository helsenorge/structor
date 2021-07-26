import React, { FocusEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { getGuidanceAction } from '../../../helpers/QuestionHelper';
import {
    createGuidanceActionExtension,
    hasExtension,
    removeItemExtension,
    setItemExtension,
} from '../../../helpers/extensionHelper';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import { TreeContext } from '../../../store/treeStore/treeStore';

import FormField from '../../FormField/FormField';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';

type GuidanceActionProps = {
    item: QuestionnaireItem;
};

const GuidanceAction = (props: GuidanceActionProps): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const hasGuidanceAction = hasExtension(props.item, IExtentionType.guidanceAction);
    const action = getGuidanceAction(props.item);

    const toggleGuidanceAction = (): void => {
        if (hasGuidanceAction) {
            removeItemExtension(props.item, IExtentionType.guidanceAction, dispatch);
        } else {
            setItemExtension(props.item, createGuidanceActionExtension(), dispatch);
        }
    };

    const updateGuidanceAction = (event: FocusEvent<HTMLInputElement>) => {
        setItemExtension(props.item, createGuidanceActionExtension(event.target.value), dispatch);
    };

    return (
        <div>
            <FormField>
                <SwitchBtn
                    onChange={toggleGuidanceAction}
                    value={hasGuidanceAction}
                    label={t('Send bruker videre etter fullført skjema')}
                    initial
                />
            </FormField>
            {hasGuidanceAction && (
                <FormField label={t('Mål')}>
                    <input defaultValue={action} placeholder={t('F.eks. /infoside')} onBlur={updateGuidanceAction} />
                </FormField>
            )}
        </div>
    );
};

export default GuidanceAction;
