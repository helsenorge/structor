import { useContext } from "react";

import { CodeSystem } from "fhir/r4";
import {
  removeFhirResourceAction,
  updateFhirResourceAction,
} from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import { useCodeSystemContext } from "../context/useCodeSystemContext";

type InputParams = {
  scrollToTarget: () => void;
};

type ReturnType = {
  startNewValueSet: () => void;
  dispatchValueSet: () => void;
  dispatchDeleteValueSet: () => void;
  isNewCodeSystem: boolean;
  newCodeSystem: CodeSystem;
};

const useNewCodeSystem = ({ scrollToTarget }: InputParams): ReturnType => {
  const {
    dispatch,
    state: { qContained },
  } = useContext(TreeContext);
  const { newCodeSystem, reset } = useCodeSystemContext();

  const startNewValueSet = (): void => {
    reset();
    scrollToTarget();
  };
  const dispatchValueSet = (): void => {
    dispatch(
      updateFhirResourceAction({
        ...newCodeSystem,
        count: newCodeSystem.concept?.length,
      }),
    );
    scrollToTarget();
  };
  const dispatchDeleteValueSet = (): void => {
    if (newCodeSystem.id) {
      dispatch(removeFhirResourceAction(newCodeSystem));
      reset();
      scrollToTarget();
    }
  };
  const isNewCodeSystem =
    !newCodeSystem.id || !qContained?.some((x) => x.id === newCodeSystem.id);

  return {
    startNewValueSet,
    dispatchValueSet,
    dispatchDeleteValueSet,
    isNewCodeSystem,
    newCodeSystem,
  };
};
export default useNewCodeSystem;
