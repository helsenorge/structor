import { CodeSystemFilter } from "fhir/r4";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialCodeSystemFilter } from "../../utils";

type ReturnType = {
  filter: CodeSystemFilter[] | undefined;
  updateFilter: (filter: CodeSystemFilter, index: number) => void;
  addNewFilter: () => void;
  removeFilter: (index: number) => void;
};

const useCodeSystemFilter = (): ReturnType => {
  const { newCodeSystem, setNewCodeSystem } = useCodeSystemContext();
  const updateFilter = (filter: CodeSystemFilter, index: number): void => {
    setNewCodeSystem((prev) => {
      const updatedFilters = prev.filter ? [...prev.filter] : [];
      updatedFilters[index] = filter;
      return {
        ...prev,
        filter: updatedFilters,
      };
    });
  };
  const addNewFilter = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      filter: [...(prev?.filter || []), initialCodeSystemFilter()],
    }));
  };
  const removeFilter = (index: number): void =>
    setNewCodeSystem((prev) => ({
      ...prev,
      filter: prev.filter?.filter((_, i) => i !== index),
    }));
  return {
    filter: newCodeSystem.filter,
    updateFilter,
    addNewFilter,
    removeFilter,
  };
};
export default useCodeSystemFilter;
