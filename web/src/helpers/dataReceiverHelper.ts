import { QuestionnaireItem } from "fhir/r4";
import { getExtensionStringValue } from "src/helpers/extensionHelper";
import { IExtensionType } from "src/types/IQuestionnareItemType";

export const getLinkIdFromValueString = (item: QuestionnaireItem): string => {
  const extensionValueString =
    getExtensionStringValue(item, IExtensionType.copyExpression) ?? "";
  const startIndex = extensionValueString.indexOf("'") + 1;
  const endIndex = extensionValueString.indexOf("')");
  return extensionValueString.substring(startIndex, endIndex);
};
