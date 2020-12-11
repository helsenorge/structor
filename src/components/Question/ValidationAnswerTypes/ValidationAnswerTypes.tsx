import React from 'react';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import ValidationAnswerTypesNumber from './ValidationAnswerTypeNumber';
import ValidationAnswerTypesText from './ValidationAnswerTypeText';
import ValidationAnswerTypeString from './ValidationAnswerTypeString';
import ValidationAnswerTypeDate from './ValidationAnswerTypeDate';

interface ValidationTypeProp {
    item: string;
    //TYPES
}

const ValidationAnswerTypes = (item: any): JSX.Element => {
    const respondType = (param: string) => {
        switch (param) {
            case IQuestionnaireItemType.group:
                return <p>Group</p>;
            case IQuestionnaireItemType.display:
                return <p>Display</p>;
            case IQuestionnaireItemType.choice:
                return <p>Choice</p>;
            case IQuestionnaireItemType.openChoice:
                return <p>Open choice</p>;
            case IQuestionnaireItemType.time:
                return <p>Time</p>;
            case IQuestionnaireItemType.dateTime:
                return <p>Datetime</p>;
            case IQuestionnaireItemType.boolean:
                return <p>Boolean</p>;
            case IQuestionnaireItemType.date:
                return <ValidationAnswerTypeDate />;
            case IQuestionnaireItemType.string:
                return <ValidationAnswerTypeString />;
            case IQuestionnaireItemType.text:
                return <ValidationAnswerTypesText />;
            case IQuestionnaireItemType.integer:
                return <ValidationAnswerTypesNumber />;
        }
    };

    return <>{respondType(item.type)}</>;
};

export default ValidationAnswerTypes;
