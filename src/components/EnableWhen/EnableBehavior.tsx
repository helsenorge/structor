import React from 'react';
import { QuestionnaireItem, QuestionnaireItemEnableBehaviorCodes } from '../../types/fhir';

type Props = {
    currentItem: QuestionnaireItem;
    dispatchUpdateItemEnableBehavior: (value: QuestionnaireItemEnableBehaviorCodes | undefined) => void;
};

const EnableBehavior = ({ currentItem, dispatchUpdateItemEnableBehavior }: Props): JSX.Element => {
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
                <span> Minst en betingelse må være oppfylt</span>
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
                <span> Alle betingelser må være oppfylt</span>
            </label>
        </div>
    );
};

export default EnableBehavior;
