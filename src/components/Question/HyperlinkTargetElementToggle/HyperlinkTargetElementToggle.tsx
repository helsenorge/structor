import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import './HyperlinkTargetElementToggle.css';

import {
    createHyperlinkTargetExtension,
    removeItemExtension,
    setItemExtension,
} from '../../../helpers/extensionHelper';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import { HyperlinkTarget } from '../../../types/hyperlinkTargetType';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import { ActionType } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';

interface Props {
    item: QuestionnaireItem;
    formExtensions: Array<Extension> | undefined;
    dispatch: React.Dispatch<ActionType>;
}

const HyperlinkTargetElementToggle = ({ item, formExtensions, dispatch }: Props): JSX.Element => {
    const { t } = useTranslation();
    const [isHyperlinkSameWindowActivated, setHyperlinkSameWindowActivated] = useState<boolean>(false);
    const [itemHyperlinkValue, setItemHyperlinkValue] = useState<HyperlinkTarget | undefined>(undefined);
    const [formHyperlinkValue, setFormHyperlinkValue] = useState<HyperlinkTarget | undefined>(undefined);

    const getHyperlinkTargetvalue = (extensions: Extension[]): HyperlinkTarget | undefined => {
        const hyperlinkExtension = extensions?.find((item) => item.url === IExtentionType.hyperlinkTarget);
        if (hyperlinkExtension) {
            const value = hyperlinkExtension.valueCoding?.code;
            if (value) return ~~value;
        }
        return undefined;
    };

    useEffect(() => {
        if (item.extension) setItemHyperlinkValue(getHyperlinkTargetvalue(item.extension));
        if (formExtensions) setFormHyperlinkValue(getHyperlinkTargetvalue(formExtensions));
    }, [item.extension, formExtensions]);

    useEffect(() => {
        if (!itemHyperlinkValue && !formHyperlinkValue) setHyperlinkSameWindowActivated(false);
        else if (itemHyperlinkValue === HyperlinkTarget.DEFAULT) setHyperlinkSameWindowActivated(false);
        else if (itemHyperlinkValue === HyperlinkTarget.SAME_WINDOW) setHyperlinkSameWindowActivated(true);
        else if (!itemHyperlinkValue && formHyperlinkValue === HyperlinkTarget.SAME_WINDOW)
            setHyperlinkSameWindowActivated(true);
    }, [itemHyperlinkValue, formHyperlinkValue]);

    const handleHyperlinkTarget = (): void => {
        if (!itemHyperlinkValue && !formHyperlinkValue)
            setItemExtension(item, createHyperlinkTargetExtension(), dispatch);
        else if (itemHyperlinkValue === HyperlinkTarget.DEFAULT && formHyperlinkValue === HyperlinkTarget.SAME_WINDOW)
            removeItemExtension(item, IExtentionType.hyperlinkTarget, dispatch);
        else if (itemHyperlinkValue === HyperlinkTarget.DEFAULT && !formHyperlinkValue)
            setItemExtension(item, createHyperlinkTargetExtension(), dispatch);
        else if (itemHyperlinkValue === HyperlinkTarget.SAME_WINDOW && !formHyperlinkValue)
            removeItemExtension(item, IExtentionType.hyperlinkTarget, dispatch);
        else if (!itemHyperlinkValue && formHyperlinkValue === HyperlinkTarget.SAME_WINDOW)
            setItemExtension(item, createHyperlinkTargetExtension(HyperlinkTarget.DEFAULT), dispatch);
    };

    return (
        <div className="hptElement__container">
            <FormField>
                <SwitchBtn
                    label={t('Open item links in same tab')}
                    value={isHyperlinkSameWindowActivated}
                    onChange={() => {
                        handleHyperlinkTarget();
                    }}
                />
            </FormField>
        </div>
    );
};

export default HyperlinkTargetElementToggle;
