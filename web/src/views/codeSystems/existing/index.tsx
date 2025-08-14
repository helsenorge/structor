import { useContext } from "react";

import { CodeSystem } from "fhir/r4";
import { removeCodeSystemAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";
import { Preview } from "src/views/components/preview/Preview";
import FeedBack from "src/views/components/upload/FeedBack";

import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";

import { useCodeSystemContext } from "../context/useCodeSystemContext";

import styles from "./existing-code-systems.module.scss";
type Props = {
  navigateToNewTab: () => void;
};

const ExistingCodeSystems = ({
  navigateToNewTab,
}: Props): React.JSX.Element => {
  const { state, dispatch } = useContext(TreeContext);
  const { handleEdit } = useCodeSystemContext();
  const dispatchDelete = (codeSystem: CodeSystem): void => {
    if (codeSystem.id) {
      dispatch(removeCodeSystemAction(codeSystem));
    }
  };
  const existingCodeSystem = state.qContained?.filter(
    (item): item is CodeSystem => item.resourceType === "CodeSystem",
  );
  return (
    <div className={styles.existingCodeSystems}>
      {(existingCodeSystem || []).length > 0 ? (
        <ExpanderList childPadding color="white">
          {existingCodeSystem?.map((codeSystem, i) => (
            <ExpanderList.Expander
              key={codeSystem.id || i}
              expanded={i === 0}
              title={`${codeSystem.title} (${codeSystem.name || codeSystem.id})`}
            >
              <Preview
                deleteResource={() => dispatchDelete(codeSystem)}
                handleEdit={() => {
                  handleEdit(codeSystem);
                  navigateToNewTab();
                }}
                canDelete={true}
                canDownload={true}
                canEdit={true}
                fhirResource={codeSystem}
                resourceType={codeSystem.resourceType}
              />
            </ExpanderList.Expander>
          ))}
        </ExpanderList>
      ) : (
        <FeedBack show text="Ingen eksisterende kodeverk funnet." />
      )}
    </div>
  );
};

export default ExistingCodeSystems;
