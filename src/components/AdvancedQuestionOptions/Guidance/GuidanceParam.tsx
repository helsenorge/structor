import React, { FocusEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getGuidanceParameterName, isValidGuidanceParameterName } from '../../../helpers/QuestionHelper';
import {
    createGuidanceParameterExtension,
    hasExtension,
    removeItemExtension,
    setItemExtension,
} from '../../../helpers/extensionHelper';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import { TreeContext } from '../../../store/treeStore/treeStore';

import FormField from '../../FormField/FormField';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import InputField from '../../InputField/inputField';

type GuidanceParamProps = {
    item: QuestionnaireItem;
};

const GuidanceParam = (props: GuidanceParamProps): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const hasGuidanceParam = hasExtension(props.item, IExtentionType.guidanceParam);
    const [parameterName, setParameterName] = useState(getGuidanceParameterName(props.item));
    const [validationMessage, setValidationMessage] = useState('');

    const toggleGuidanceParam = () => {
        if (hasGuidanceParam) {
            removeItemExtension(props.item, IExtentionType.guidanceParam, dispatch);
        } else {
            setItemExtension(props.item, createGuidanceParameterExtension(), dispatch);
        }
    };

    const updateParameterName = (event: FocusEvent<HTMLInputElement>) => {
        validateParameterName(event.target.value);
        if (isValidGuidanceParameterName(event.target.value)) {
            setItemExtension(props.item, createGuidanceParameterExtension(event.target.value), dispatch);
        }
    };

    const validateParameterName = (value: string) => {
        if (!isValidGuidanceParameterName(value)) {
            setValidationMessage(
                t(
                    'Parameter name must be 1-255 characters and can only contain numbers, _ and normal and capital letters a-z',
                ),
            );
        } else {
            setValidationMessage('');
        }
        setParameterName(value);
    };

    return (
        <div>
            <FormField>
                <SwitchBtn onChange={toggleGuidanceParam} value={hasGuidanceParam} label={t('Send as parameter')} />
            </FormField>
            {hasGuidanceParam && (
                <FormField label={t('Parameter name')}>
                    <InputField
                        defaultValue={parameterName}
                        placeholder={t('For example hn_frontend_parametername')}
                        onBlur={updateParameterName}
                        onChange={(event) => validateParameterName(event.target.value)}
                    />
                    {validationMessage && <div className="msg-error">{validationMessage}</div>}
                </FormField>
            )}
        </div>
    );
};

export default GuidanceParam;
