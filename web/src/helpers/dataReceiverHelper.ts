import { getExtensionStringValue } from "src/helpers/extensionHelper";
import { IExtensionType } from "src/types/IQuestionnareItemType";

import type { QuestionnaireItem } from "fhir/r4";

export const getLinkIdFromValueString = (item: QuestionnaireItem): string => {
  const extensionValueString =
    getExtensionStringValue(item, IExtensionType.copyExpression) ?? "";
  const startIndex = extensionValueString.indexOf("'") + 1;
  const endIndex = extensionValueString.indexOf("')");
  return extensionValueString.substring(startIndex, endIndex);
};
