import { FhirResource, ValueSet } from "fhir/r4";

import { TreeState } from "./treeStore";

export const getValueSetsFromState = (state: TreeState): ValueSet[] => {
  return (
    state.qContained?.filter(
      (item): item is ValueSet => item.resourceType === "ValueSet",
    ) || []
  );
};
export const getFhirResourcesFromState = (
  state: TreeState,
  resourceType: FhirResource["resourceType"],
): FhirResource[] => {
  return (
    state.qContained?.filter(
      (item): item is FhirResource => item.resourceType === resourceType,
    ) || []
  );
};
