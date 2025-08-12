import { ValueSet } from "fhir/r4";

import { TreeState } from "./treeStore";

export const getValueSetsFromState = (state: TreeState): ValueSet[] => {
  return (
    state.qContained?.filter(
      (item): item is ValueSet => item.resourceType === "ValueSet",
    ) || []
  );
};
