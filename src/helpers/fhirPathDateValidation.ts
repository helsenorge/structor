import { FhirPathDateOperator } from '../components/Question/ValidationAnswerTypes/FhirPathDateValidation';

export const getDateOperator = (extensionString: string | undefined): string => {
    let operator = '';
    if (extensionString) {
        operator = extensionString.split(' ')[1];
    }
    if (extensionString && !operator) {
        operator = FhirPathDateOperator.EXACT;
    }
    return operator || FhirPathDateOperator.NOVALIDATION;
};

export const getDateNumber = (extensionString: string | undefined): string => {
    return extensionString ? extensionString.split(' ')[2] || '' : '';
};

export const getDateUnit = (extensionString: string | undefined): string => {
    return extensionString ? extensionString.split(' ')[3] || '' : '';
};

export const generateFhirPathValueString = (operator: string, value: string, unit: string): string => {
    if (operator === FhirPathDateOperator.NOVALIDATION) {
        return '';
    }
    if (operator === FhirPathDateOperator.EXACT) {
        return 'today()';
    }
    return `today() ${operator} ${value} ${unit}`;
};
