import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionnaireItem, QuestionnaireItemEnableBehaviorCodes } from '../../types/fhir';
import RadioBtn from '../RadioBtn/RadioBtn';

type Props = {
    currentItem: QuestionnaireItem;
    dispatchUpdateItemEnableBehavior: (value: QuestionnaireItemEnableBehaviorCodes | undefined) => void;
};

const EnableBehavior = ({ currentItem, dispatchUpdateItemEnableBehavior }: Props): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div className="enablebehavior">
            <RadioBtn
                onChange={(newValue: string) => {
                    dispatchUpdateItemEnableBehavior(newValue as QuestionnaireItemEnableBehaviorCodes);
                }}
                checked={
                    currentItem.enableBehavior === QuestionnaireItemEnableBehaviorCodes.ALL
                        ? QuestionnaireItemEnableBehaviorCodes.ALL
                        : QuestionnaireItemEnableBehaviorCodes.ANY
                }
                options={[
                    {
                        code: QuestionnaireItemEnableBehaviorCodes.ANY,
                        display: t('At least one condition must be fulfilled'),
                    },
                    {
                        code: QuestionnaireItemEnableBehaviorCodes.ALL,
                        display: t('All conditions must be fulfilled'),
                    },
                ]}
                name={`ew-behavior-${currentItem.linkId}`}
            />
        </div>
    );
};

export default EnableBehavior;
