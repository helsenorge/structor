import { CodeSystemConcept } from "fhir/r4";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialConcept } from "../../utils";

type ReturnType = {
  updateConcept: (
    key: keyof CodeSystemConcept,
    value: string,
    concept: CodeSystemConcept,
  ) => void;
  removeConcept: (concept: CodeSystemConcept) => void;
  addNewConcept: () => void;
  concept: CodeSystemConcept[] | undefined;
};

const useConcept = (): ReturnType => {
  const {
    newCodeSystem: { concept },
    setNewCodeSystem,
  } = useCodeSystemContext();

  const addNewConcept = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: [...(prev?.concept || []), initialConcept()],
    }));
  };

  const updateConcept = (
    key: keyof CodeSystemConcept,
    value: string,
    concept: CodeSystemConcept,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c) =>
        c.id === concept.id ? { ...c, [key]: value } : c,
      ),
    }));
  };
  const removeConcept = (concept: CodeSystemConcept): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.filter((c) => c.id !== concept.id),
    }));
  };
  return { removeConcept, updateConcept, addNewConcept, concept };
};

export default useConcept;
