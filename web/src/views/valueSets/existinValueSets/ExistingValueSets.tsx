import React, { useContext } from "react";

import { FhirResource, Questionnaire, ValueSet } from "fhir/r4";
import {
  generarteQuestionnaireOrBundle,
  generateQuestionnaire,
} from "src/helpers/generateQuestionnaire";
import { TreeContext } from "src/store/treeStore/treeStore";

import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";

import { PreviewValueSet } from "./previewValueSet/PreviewValueSet";

import styles from "./existinValueSets.module.scss";

type Props = {
  scrollToTarget: () => void;
};

const ExistingValueSets = ({ scrollToTarget }: Props): React.JSX.Element => {
  const { state } = useContext(TreeContext);
  const q = generarteQuestionnaireOrBundle(state);
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
              <PreviewValueSet
                key={valueSet.id}
                valueSet={valueSet}
                scrollToTarget={scrollToTarget}
                valueSetIndex={i}
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
