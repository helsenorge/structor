import { FhirPathDateOperator } from '../components/Question/ValidationAnswerTypes/FhirPathDateValidation';

export const getDateOperator = (extensionString: string | undefined, absExtensionDate: string | undefined): string => {
    let operator = '';
    if (extensionString) {
        operator = extensionString.split(' ')[1];
    }
    if (extensionString && !operator) {
        operator = FhirPathDateOperator.EXACT;
    }
    if (absExtensionDate && !operator) {
        operator = FhirPathDateOperator.ABSOLUTE;
    }
    return operator || FhirPathDateOperator.NOVALIDATION;
};

export const getDateNumber = (extensionString: string | undefined): string => {
    return extensionString ? extensionString.split(' ')[2] || '' : '';
};

export const getDateUnit = (extensionString: string | undefined): string => {
    return extensionString ? extensionString.split(' ')[3] || '' : '';
};

export const generateFhirPathValueString = (
    operator: string | undefined,
    value: string | undefined,
    unit: string | undefined,
): string => {
    if (
        operator === FhirPathDateOperator.NOVALIDATION ||
        operator === FhirPathDateOperator.ABSOLUTE ||
        operator === ''
    ) {
        return '';
    }
    if (operator === FhirPathDateOperator.EXACT) {
        return 'today()';
    }
    return `today() ${operator || ''} ${value || ''} ${unit || ''}`;
};
