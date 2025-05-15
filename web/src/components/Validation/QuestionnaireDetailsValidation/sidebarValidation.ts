import { TFunction } from "react-i18next";
import { Items, TreeState } from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";

import { isItemControlSidebar } from "../../../helpers/itemControl";
import { getTextExtensionMarkdown } from "../../../helpers/QuestionHelper";
import { createError } from "../validationHelper";
import { ErrorLevel, ValidationType } from "../validationTypes";

export const validateSidebar = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  validateSOTHaveText(t, state.qItems, errors);
  return errors;
};

const validateSOTHaveText = (
  t: TFunction<"translation">,
  qItems: Items,
  errors: ValidationError[],
): ValidationError[] => {
  Object.keys(qItems).forEach((linkId) => {
    const item = qItems[linkId];
    if (isItemControlSidebar(item)) {
      if (!getTextExtensionMarkdown(item)?.trim()) {
        errors.push(
          createError(
            item.linkId,
            ValidationType.sidebar,
            t("SOT does not have a text"),
            ErrorLevel.error,
          ),
        );
      }
    }
  });
  return errors;
};
