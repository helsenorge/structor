import React from 'react';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import ValidationAnswerTypesNumber from './ValidationAnswerTypeNumber';
import ValidationAnswerTypesText from './ValidationAnswerTypeText';
import ValidationAnswerTypeString from './ValidationAnswerTypeString';
import ValidationAnswerTypeDate from './ValidationAnswerTypeDate';
import ValidationAnswerTypeTime from './ValidationAnswerTypeTime';
import { QuestionnaireItem } from '../../../types/fhir';
interface ValidationTypeProp {
    item: QuestionnaireItem;
    //TYPES
}

const ValidationAnswerTypes = ({ item }: ValidationTypeProp): JSX.Element => {
    const respondType = (itemType: string) => {
        switch (itemType) {
            case IQuestionnaireItemType.time:
                return <ValidationAnswerTypeTime />;
            case IQuestionnaireItemType.date:
                return <ValidationAnswerTypeDate item={item} />;
            case IQuestionnaireItemType.string:
                return <ValidationAnswerTypeString item={item} />;
            case IQuestionnaireItemType.text:
                return <ValidationAnswerTypesText item={item} />;
            case IQuestionnaireItemType.integer:
                return <ValidationAnswerTypesNumber item={item} />;
        }
    };

    return <>{respondType(item.type)}</>;
};

export default ValidationAnswerTypes;
