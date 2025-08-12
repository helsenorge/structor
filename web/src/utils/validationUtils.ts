import { ValueSet } from "fhir/r4";
import { ErrorLevel } from "src/components/Validation/validationTypes";

import { getUsedValueSet } from "../helpers/generateQuestionnaire";
import { TreeState } from "../store/treeStore/treeStore";

export interface ValidationError {
  linkId: string;
  index?: number;
  errorProperty: string;
  errorLevel: ErrorLevel;
  errorReadableText: string;
  languagecode?: string;
}

export const getValueSetToTranslate = (
  state: TreeState,
): ValueSet[] | undefined => {
  const usedValueSet = getUsedValueSet(state);
  return state.qContained
    ?.filter((x) => x.resourceType === "ValueSet")
    .filter((x) => x.id && usedValueSet?.includes(x.id) && x);
};
