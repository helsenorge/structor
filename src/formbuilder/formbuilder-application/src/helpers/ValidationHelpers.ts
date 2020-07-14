export interface IValidation {
    validationList: Array<boolean>;
    visitedFields: Array<boolean>;
    checkedList: Array<boolean>;
}

export function setValidateText(
    field: number,
    validationObject: IValidation,
    setValidationObject: (value: React.SetStateAction<IValidation>) => void,
    value?: string,
): void {
    const tempObject = { ...validationObject };
    if (!validationObject.checkedList[field]) {
        tempObject.validationList[field] = true;
    } else {
        tempObject.validationList[field] = validateText(value);
    }
    setValidationObject(tempObject);
}

export function setValidateNumber(
    field: number,
    validationObject: IValidation,
    setValidationObject: (value: React.SetStateAction<IValidation>) => void,
    value?: number,
): void {
    const tempObject = { ...validationObject };
    if (!validationObject.checkedList[field]) {
        tempObject.validationList[field] = true;
    } else {
        tempObject.validationList[field] = validateNumber(value);
    }
    setValidationObject(tempObject);
}

export function validateNumber(value?: number): boolean {
    return value !== undefined ? value >= 0 : false;
}

export function validateText(value?: string): boolean {
    return value !== undefined ? value.length > 0 : false;
}

export function setVisitedField(
    field: number,
    validationObject: IValidation,
    setValidationObject: (value: React.SetStateAction<IValidation>) => void,
): void {
    const tempObject = { ...validationObject };
    tempObject.visitedFields[field] = true;
    setValidationObject(tempObject);
}

export function setCheckedField(
    field: number,
    value: boolean,
    validationObject: IValidation,
    setValidationObject: (value: React.SetStateAction<IValidation>) => void,
): void {
    const tempObject = { ...validationObject };
    tempObject.checkedList[field] = value;
    if (!value) tempObject.visitedFields[field] = false;
    setValidationObject(tempObject);
}

export function checkErrorFields(
    validationFlag: boolean,
    validationObject: IValidation,
    errorList: Array<boolean>,
    setErrorList: (value: React.SetStateAction<boolean[]>) => void,
): void {
    const tempError = [...errorList];
    for (let i = 0; i < tempError.length; i++) {
        tempError[i] = setError(validationFlag, i, validationObject.validationList, validationObject.visitedFields);
    }
    setErrorList(tempError);
}
function setError(
    validationFlag: boolean,
    field: number,
    validationList: Array<boolean>,
    visitedFields: Array<boolean>,
): boolean {
    return !validationList[field] && (validationFlag || visitedFields[field]);
}
