import { IExtensionType } from "../types/IQuestionnareItemType";

export const getEnumKeyByString = <T extends { [index: string]: string }>(
  theEnum: T,
  theValue: string
): keyof T | undefined => {
  const keys = Object.keys(theEnum).filter((x) => theEnum[x] === theValue);
  return keys.length > 0 ? keys[0] : undefined;
};

export const getValidationExtentionUrls = [
  IExtensionType.maxValue,
  IExtensionType.minValue,
  IExtensionType.minLength,
  IExtensionType.fhirPathMaxValue,
  IExtensionType.fhirPathMinValue,
  IExtensionType.maxSize,
  IExtensionType.regEx,
  IExtensionType.validationtext,
];
