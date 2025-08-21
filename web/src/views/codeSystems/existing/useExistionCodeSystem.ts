import { useContext } from "react";

import { CodeSystem } from "fhir/r4";
import { removeFhirResourceAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import { useCodeSystemContext } from "../context/useCodeSystemContext";

type ReturnType = {
  edit: (codeSystem: CodeSystem) => void;
  deleteCodeSystem: (codeSystem: CodeSystem) => void;
  codeSystems: CodeSystem[] | undefined;
};

type InputParams = {
  navigateToNewTab: () => void;
};

const useExistingCodeSystem = ({
  navigateToNewTab,
}: InputParams): ReturnType => {
  const { state, dispatch } = useContext(TreeContext);
  const { handleEdit } = useCodeSystemContext();
  const dispatchDelete = (codeSystem: CodeSystem): void => {
    if (codeSystem.id) {
      dispatch(removeFhirResourceAction(codeSystem));
    }
  };
  const existingCodeSystem = state.qContained?.filter(
    (item): item is CodeSystem => item.resourceType === "CodeSystem",
  );
  const edit = (codeSystem: CodeSystem): void => {
    handleEdit(codeSystem);
    navigateToNewTab();
  };
  return {
    edit,
    deleteCodeSystem: dispatchDelete,
    codeSystems: existingCodeSystem,
  };
};
export default useExistingCodeSystem;
