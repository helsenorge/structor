import { CodeSystemConceptProperty } from "fhir/r4";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialProperty } from "../../utils";

type ReturnType = {
  updateProperty: (
    key: keyof CodeSystemConceptProperty,
    value: string | boolean,
    conceptIndex: number,
    index: number,
  ) => void;
  removeCodeSystemProperty: (index: number, conceptIndex: number) => void;
  handleAddNewProperty: (conceptIndex: number) => void;
};

const useNewCodeSystemProperties = (): ReturnType => {
  const { setNewCodeSystem } = useCodeSystemContext();
  const updateProperty = (
    key: keyof CodeSystemConceptProperty,
    value: string | boolean,
    conceptIndex: number,
    index: number,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, idx) =>
        idx === conceptIndex
          ? {
              ...c,
              property: c.property?.map((p, i) =>
                i === index ? { ...p, [key]: value } : p,
              ),
            }
          : c,
      ),
    }));
  };
  const removeCodeSystemProperty = (
    index: number,
    conceptIndex: number,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, idx) =>
        idx === conceptIndex
          ? {
              ...c,
              property: c.property?.filter((_, i) => i !== index),
            }
          : c,
      ),
    }));
  };
  const handleAddNewProperty = (conceptIndex: number): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, idx) =>
        idx === conceptIndex
          ? {
              ...c,
              property: [...(c.property || []), initialProperty()],
            }
          : c,
      ),
    }));
  };
  return {
    updateProperty,
    removeCodeSystemProperty,
    handleAddNewProperty,
  };
};
export default useNewCodeSystemProperties;
