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
            case IQuestionnaireItemType.group:
                return <p>Group</p>;
            case IQuestionnaireItemType.display:
                return <p>Display</p>;
            case IQuestionnaireItemType.choice:
                return <p>Choice</p>;
            case IQuestionnaireItemType.openChoice:
                return <p>Open choice</p>;
            case IQuestionnaireItemType.dateTime:
                return <p>Datetime</p>;
            case IQuestionnaireItemType.boolean:
                return <p>Boolean</p>;
            case IQuestionnaireItemType.time:
                return <ValidationAnswerTypeTime />;
            case IQuestionnaireItemType.date:
                return <ValidationAnswerTypeDate />;
            case IQuestionnaireItemType.string:
                return <ValidationAnswerTypeString />;
            case IQuestionnaireItemType.text:
                return <ValidationAnswerTypesText item={item} />;
            case IQuestionnaireItemType.integer:
                return <ValidationAnswerTypesNumber item={item} />;
        }
    };

    return <>{respondType(item.type)}</>;
};

export default ValidationAnswerTypes;
