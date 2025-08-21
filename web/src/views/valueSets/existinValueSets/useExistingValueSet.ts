import { useContext } from "react";

import { FhirResource, Questionnaire, ValueSet } from "fhir/r4";
import { generarteQuestionnaireOrBundle } from "src/helpers/generateQuestionnaire";
import { removeFhirResourceAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import { useValueSetContext } from "../context/useValueSetContext";

type ReturnType = {
  canDelete: (id: ValueSet["id"]) => boolean;
  handleDeleteResource: (resource: FhirResource) => void;
  editValueSet: (fhirResource: FhirResource) => void;
  canEdit: (type?: string | undefined) => boolean;
  valueSets: ValueSet[] | undefined;
};

export const useExistingValueSet = (): ReturnType => {
  const { state, dispatch } = useContext(TreeContext);

  const q = generarteQuestionnaireOrBundle(state);
  const { canEdit, handleEdit, valueSets } = useValueSetContext();

  const existingValueSetsInQuestionnaire: FhirResource[] = [];
  if (q.resourceType === "Questionnaire") {
    existingValueSetsInQuestionnaire.push(...(q?.contained || []));
  } else if (q.resourceType === "Bundle") {
    const questionnaires = q.entry?.filter(
      (e) => e.resource?.resourceType === "Questionnaire",
    ) as Questionnaire[];
    const valuesets = questionnaires
      ?.map((q) => (q?.contained || []).filter(Boolean))
      .flat();
    existingValueSetsInQuestionnaire.push(...valuesets);
  }

  const dispatchDeleteValueSet = (valueSet: ValueSet): void => {
    if (valueSet.id) {
      dispatch(removeFhirResourceAction(valueSet));
    }
  };
  const handleDeleteResource = (resource: FhirResource): void => {
    if (resource.resourceType === "ValueSet") {
      dispatchDeleteValueSet(resource);
    }
  };
  const editValueSet = (fhirResource: FhirResource): void => {
    if (fhirResource.resourceType === "ValueSet") {
      handleEdit(fhirResource);
    }
  };
  const canDelete = (id: ValueSet["id"]): boolean =>
    !existingValueSetsInQuestionnaire.map((vs) => vs.id).includes(id);

  return {
    canDelete,
    handleDeleteResource,
    editValueSet,
    canEdit,
    valueSets,
  };
};
