import { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";
import type { ValidationError } from "../../../utils/validationUtils";

import {
  ErrorClassVariant,
  getSeverityClass,
} from "../../Validation/validationHelper";
import styles from "../AnchorMenu.module.scss";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAnchorMenuHelpers = (validationErrors: ValidationError[]) => {
  const validationClasses = (linkId: string): string => {
    return getSeverityClass(
      ErrorClassVariant.highlight,
      validationErrors.filter((error) => error.linkId === linkId),
    );
  };

  const getRelevantIcon = (type?: string): string => {
    switch (type) {
      case IQuestionnaireItemType.group:
        return styles.folderIcon;
      case IQuestionnaireItemType.display:
        return styles.messageIcon;
      default:
        return styles.questionIcon;
    }
  };

  return {
    validationClasses,
    getRelevantIcon,
  };
};
