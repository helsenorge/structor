import React from "react";

import { Preview } from "src/views/components/preview/Preview";

import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";

import { useExistingValueSet } from "./useExistingValueSet";

import styles from "./existinValueSets.module.scss";

type Props = {
  scrollToTarget: () => void;
};

const ExistingValueSets = ({ scrollToTarget }: Props): React.JSX.Element => {
  const { canDelete, handleDeleteResource, editValueSet, canEdit, valueSets } =
    useExistingValueSet();

  return (
    <div className={styles.existingValueSets}>
      <ExpanderList childPadding color="white">
        {valueSets?.map((valueSet, i) => (
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
              canDelete={canDelete(valueSet.id)}
              showHeadline={false}
            />
          </ExpanderList.Expander>
        ))}
      </ExpanderList>
    </div>
  );
};
export default ExistingValueSets;
