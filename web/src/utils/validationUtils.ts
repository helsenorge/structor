import { getUsedValueSet } from "../helpers/generateQuestionnaire";
import { TreeState } from "../store/treeStore/treeStore";
import { ValueSet } from "fhir/r4";

export interface ValidationErrors {
    linkId: string;
    index?: number;
    errorProperty: string;
    errorReadableText: string;
    languagecode?: string;
}

export const getValueSetToTranslate = (state: TreeState): ValueSet[] | undefined => {
    const usedValueSet = getUsedValueSet(state);
    return state.qContained?.filter((x) => x.id && usedValueSet?.includes(x.id) && x);
};
