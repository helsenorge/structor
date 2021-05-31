import React, { FocusEvent, useContext, useState } from 'react';

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

type GuidanceParamProps = {
    item: QuestionnaireItem;
};

const GuidanceParam = (props: GuidanceParamProps): JSX.Element => {
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
                'Parameternavn må være fra 1-255 tegn og kan kun inneholde tall, _ og små eller store bokstaver fra a-z',
            );
        } else {
            setValidationMessage('');
        }
        setParameterName(value);
    };

    return (
        <div>
            <FormField>
                <SwitchBtn
                    onChange={toggleGuidanceParam}
                    value={hasGuidanceParam}
                    label="Send som parameter etter fullført skjema"
                    initial
                />
            </FormField>
            {hasGuidanceParam && (
                <FormField label="Parameternavn">
                    <input
                        defaultValue={parameterName}
                        placeholder="F.eks. hn_frontend_parameternavn"
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
