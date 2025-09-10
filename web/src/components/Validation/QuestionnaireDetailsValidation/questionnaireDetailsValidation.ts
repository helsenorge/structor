import { TFunction } from "react-i18next";
import { generarteQuestionnaireOrBundle } from "src/helpers/generateQuestionnaire";
import { TreeState } from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";

import { validateBundle } from "./bundleValidation";
import { validateLanguage } from "./languageValidation";
import { validateMetadata } from "./metadataValidation";
import { metaSecurityValidation } from "./securityValidation";
import { validateQuestionnaireSettings } from "./settingsValidation";
import { validateSidebar } from "./sidebarValidation";

export const validateQuestionnaireDetails = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const questionnaires = generarteQuestionnaireOrBundle(state);

  const metadataValidation = validateMetadata(t, state);
  const sidebarValidation = validateSidebar(t, state);
  const settingValidation = validateQuestionnaireSettings(t, state);
  const securityValidation = metaSecurityValidation(t, state.qMetadata);
  const bundleValidation = validateBundle(t, questionnaires, state);
  const languageValidation = validateLanguage(t, questionnaires);
  return metadataValidation
    .concat(sidebarValidation)
    .concat(settingValidation)
    .concat(securityValidation)
    .concat(bundleValidation)
    .concat(languageValidation);
};
