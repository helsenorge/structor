import React, { useContext } from "react";

import { TreeContext } from "src/store/treeStore/treeStore";

import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";

import { PreviewValueSet } from "./previewValueSet/PreviewValueSet";

import styles from "./existinValueSets.module.scss";

type Props = {
  scrollToTarget: () => void;
};

const ExistingValueSets = ({ scrollToTarget }: Props): React.JSX.Element => {
  const {
    state: { qContained },
  } = useContext(TreeContext);
  return (
    <div className={styles.existingValueSets}>
      <ExpanderList childPadding color="white">
        {qContained?.map((x, i) => (
          <ExpanderList.Expander
            key={x.id || i}
            expanded={i === 0}
            title={`${x.title} (${x.name || x.id})`}
          >
            <PreviewValueSet
              key={x.id}
              valueSet={x}
              scrollToTarget={scrollToTarget}
              valueSetIndex={i}
              canDelete={true}
            />
          </ExpanderList.Expander>
        ))}
      </ExpanderList>
    </div>
  );
};
export default ExistingValueSets;
