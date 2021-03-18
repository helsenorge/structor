import React from 'react';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import ValidationAnswerTypeNumber from './ValidationAnswerTypeNumber';
import ValidationAnswerTypesText from './ValidationAnswerTypeText';
import ValidationAnswerTypeString from './ValidationAnswerTypeString';
import ValidationAnswerTypeDate from './ValidationAnswerTypeDate';
import { QuestionnaireItem } from '../../../types/fhir';
import ValidationAnswerTypeAttachment from './ValidationAnswerTypeAttachment';
interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypes = ({ item }: ValidationTypeProp): JSX.Element => {
    const respondType = (itemType: string) => {
        switch (itemType) {
            case IQuestionnaireItemType.attachment:
                return <ValidationAnswerTypeAttachment item={item} />;
            case IQuestionnaireItemType.date:
                return <ValidationAnswerTypeDate item={item} />;
            case IQuestionnaireItemType.string:
                return <ValidationAnswerTypeString item={item} />;
            case IQuestionnaireItemType.text:
                return <ValidationAnswerTypesText item={item} />;
            case IQuestionnaireItemType.integer:
            case IQuestionnaireItemType.decimal:
            case IQuestionnaireItemType.quantity:
                return <ValidationAnswerTypeNumber item={item} />;
        }
    };

    return <>{respondType(item.type)}</>;
};

export default ValidationAnswerTypes;
