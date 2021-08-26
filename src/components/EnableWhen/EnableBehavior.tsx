import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionnaireItem, QuestionnaireItemEnableBehaviorCodes } from '../../types/fhir';

type Props = {
    currentItem: QuestionnaireItem;
    dispatchUpdateItemEnableBehavior: (value: QuestionnaireItemEnableBehaviorCodes | undefined) => void;
};

const EnableBehavior = ({ currentItem, dispatchUpdateItemEnableBehavior }: Props): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div className="enablebehavior">
            <label>
                <input
                    type="radio"
                    checked={
                        currentItem.enableBehavior === QuestionnaireItemEnableBehaviorCodes.ANY ||
                        !currentItem.enableBehavior
                    }
                    name={`ew-behavior-${currentItem.linkId}`}
                    onChange={(event) => {
                        dispatchUpdateItemEnableBehavior(
                            event.target.checked ? QuestionnaireItemEnableBehaviorCodes.ANY : undefined,
                        );
                    }}
                />
                <span>{` ${t('At least one condition must be fulfilled')}`}</span>
            </label>
            <label>
                <input
                    type="radio"
                    checked={currentItem.enableBehavior === QuestionnaireItemEnableBehaviorCodes.ALL}
                    name={`ew-behavior-${currentItem.linkId}`}
                    onChange={(event) => {
                        dispatchUpdateItemEnableBehavior(
                            event.target.checked ? QuestionnaireItemEnableBehaviorCodes.ALL : undefined,
                        );
                    }}
                />
                <span>{` ${t('All conditions must be fulfilled')}`}</span>
            </label>
        </div>
    );
};

export default EnableBehavior;
