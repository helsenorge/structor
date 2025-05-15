import { TFunction } from "react-i18next";
import { TreeState } from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";

import { validateMetadata } from "./metadataValidation";
import { metaSecurityValidation } from "./securityValidation";
import { validateQuestionnaireSettings } from "./settingsValidation";
import { validateSidebar } from "./sidebarValidation";

export const validateQuestionnaireDetails = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const metadataValidation = validateMetadata(t, state);
  const sidebarValidation = validateSidebar(t, state);
  const settingValidation = validateQuestionnaireSettings(t, state);
  const securityValidation = metaSecurityValidation(t, state.qMetadata);
  return metadataValidation
    .concat(sidebarValidation)
    .concat(settingValidation)
    .concat(securityValidation);
};
