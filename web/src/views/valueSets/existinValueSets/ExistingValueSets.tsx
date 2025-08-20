import React, { useContext } from "react";

import { FhirResource, Questionnaire, ValueSet } from "fhir/r4";
import { generarteQuestionnaireOrBundle } from "src/helpers/generateQuestionnaire";
import { removeFhirResourceAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";
import { Preview } from "src/views/components/preview/Preview";

import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";

import { useValueSetContext } from "../context/useValueSetContext";

import styles from "./existinValueSets.module.scss";

type Props = {
  scrollToTarget: () => void;
};

const ExistingValueSets = ({ scrollToTarget }: Props): React.JSX.Element => {
  const { state, dispatch } = useContext(TreeContext);
  const q = generarteQuestionnaireOrBundle(state);
  const { canEdit, handleEdit } = useValueSetContext();
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
  return (
    <div className={styles.existingValueSets}>
      <ExpanderList childPadding color="white">
        {state.qContained
          ?.filter((item): item is ValueSet => item.resourceType === "ValueSet")
          .map((valueSet, i) => (
            <ExpanderList.Expander
              key={valueSet.id || i}
              expanded={i === 0}
              title={`${valueSet.title} (${valueSet.name || valueSet.id})`}
            >
              <Preview
                handleEdit={editValueSet}
                canEdit={canEdit(valueSet.url)}
                deleteResource={handleDeleteResource}
                resourceType="ValueSet"
                key={valueSet.id}
                fhirResource={valueSet}
                scrollToTarget={scrollToTarget}
                canDelete={
                  !existingValueSetsInQuestionnaire
                    .map((vs) => vs.id)
                    .includes(valueSet.id)
                }
              />
            </ExpanderList.Expander>
          ))}
      </ExpanderList>
    </div>
  );
};
export default ExistingValueSets;
