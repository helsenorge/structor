import { CodeSystemConceptDesignation, Coding } from "fhir/r4";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialDesignation } from "../../utils";

type ReturnType = {
  handleAddDesignation: (conceptIndex: number) => void;
  updateDesignation: (
    key: keyof CodeSystemConceptDesignation,
    value: string | Coding,
    conceptIndex: number,
    index: number,
  ) => void;
  removeCodeSystemDesignation: (index: number, conceptIndex: number) => void;
};

const useCodeSystemDesignation = (): ReturnType => {
  const { setNewCodeSystem } = useCodeSystemContext();
  const handleAddDesignation = (conceptIndex: number): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, i) =>
        i === conceptIndex
          ? {
              ...c,
              designation: [...(c.designation || []), initialDesignation()],
            }
          : c,
      ),
    }));
  };

  const updateDesignation = (
    key: keyof CodeSystemConceptDesignation,
    value: string | Coding,
    conceptIndex: number,
    index: number,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, i) =>
        i === conceptIndex
          ? {
              ...c,
              designation: c.designation?.map((d, j) =>
                j === index ? { ...d, [key]: value } : d,
              ),
            }
          : c,
      ),
    }));
  };
  const removeCodeSystemDesignation = (
    index: number,
    conceptIndex: number,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, i) =>
        i === conceptIndex
          ? {
              ...c,
              designation: c.designation?.filter((_, j) => j !== index),
            }
          : c,
      ),
    }));
  };
  return {
    handleAddDesignation,
    updateDesignation,
    removeCodeSystemDesignation,
  };
};
export default useCodeSystemDesignation;
