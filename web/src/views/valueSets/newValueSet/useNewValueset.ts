import { useContext } from "react";

import { ValueSet } from "fhir/r4";
import {
  removeFhirResourceAction,
  updateFhirResourceAction,
} from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import { useValueSetContext } from "../context/useValueSetContext";

type InputParams = {
  scrollToTarget: () => void;
};

type ReturnType = {
  startNewValueSet: () => void;
  dispatchValueSet: () => void;
  dispatchDeleteValueSet: () => void;
  isNewValueSet: boolean;
  newValueSet: ValueSet;
};

const useNewValueSet = ({ scrollToTarget }: InputParams): ReturnType => {
  const {
    dispatch,
    state: { qContained },
  } = useContext(TreeContext);
  const { newValueSet, reset } = useValueSetContext();

  const startNewValueSet = (): void => {
    reset();
    scrollToTarget();
  };
  const dispatchValueSet = (): void => {
    dispatch(updateFhirResourceAction(newValueSet));
    scrollToTarget();
  };
  const dispatchDeleteValueSet = (): void => {
    if (newValueSet.id) {
      dispatch(removeFhirResourceAction(newValueSet));
      reset();
      scrollToTarget();
    }
  };
  const isNewValueSet =
    !newValueSet.id || !qContained?.some((x) => x.id === newValueSet.id);
  return {
    startNewValueSet,
    dispatchValueSet,
    dispatchDeleteValueSet,
    isNewValueSet,
    newValueSet,
  };
};
export default useNewValueSet;
