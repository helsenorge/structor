import type { TreeState } from "../store/treeStore/treeStore";
import type { ValueSet } from "fhir/r4";
import type { ErrorLevel } from "src/components/Validation/validationTypes";
import type { ExtendedLanguageLocales } from "src/types/LanguageTypes";

import { getUsedValueSet } from "../helpers/generateQuestionnaire";

export interface ValidationError {
  linkId: string;
  index?: number;
  errorProperty: string;
  errorLevel: ErrorLevel;
  errorReadableText: string;
  languagecode?: ExtendedLanguageLocales;
}

export const getValueSetToTranslate = (
  state: TreeState,
): ValueSet[] | undefined => {
  const usedValueSet = getUsedValueSet(state);
  return state.qContained
    ?.filter((x) => x.resourceType === "ValueSet")
    .filter((x) => x.id && usedValueSet?.includes(x.id) && x);
};
