import React from 'react';
import ValidationAnswerTypesNumber from './ValidationAnswerTypeNumber';

interface ValidationTypeProp {
    item: string;
    //TYPES
}

const ValidationAnswerTypes = (item: any): JSX.Element => {
    const respondType = (param: string) => {
        switch (param) {
            case 'group':
                return <p>Group</p>;
            case 'display':
                return <p>Display</p>;
            case 'string':
                return <p>String</p>;
            case 'text':
                return <p>Text</p>;
            case 'choice':
                return <p>Choice</p>;
            case 'Open-choice':
                return <p>Open choice</p>;
            case 'date':
                return <p>Date</p>;
            case 'time':
                return <p>Time</p>;
            case 'dateTime':
                return <p>Datetime</p>;
            case 'boolean':
                return <p>Boolean</p>;
            case 'integer':
                return <ValidationAnswerTypesNumber />;

            default:
                return <p>Error {param}</p>;
                break;
        }
    };

    return <>{respondType(item.type)}</>;
};

export default ValidationAnswerTypes;
