import { CodeSystemProperty } from "fhir/r4";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialCodeSystemProperty } from "../../utils";
type ReturnType = {
  updateProperty: (
    key: keyof CodeSystemProperty,
    value: string,
    property: CodeSystemProperty,
  ) => void;
  removeProperty: (property: CodeSystemProperty) => void;
  addNewProperty: () => void;
  properties: CodeSystemProperty[] | undefined;
};
const useProperty = (): ReturnType => {
  const {
    setNewCodeSystem,
    newCodeSystem: { property },
  } = useCodeSystemContext();

  const updateProperty = (
    key: keyof CodeSystemProperty,
    value: string,
    property: CodeSystemProperty,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      property: prev?.property?.map((c) =>
        c.id === property.id ? { ...c, [key]: value } : c,
      ),
    }));
  };

  const removeProperty = (property: CodeSystemProperty): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      property: prev?.property?.filter((c) => c.id !== property.id),
    }));
  };

  const addNewProperty = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      property: [...(prev?.property || []), initialCodeSystemProperty()],
    }));
  };
  return {
    updateProperty,
    removeProperty,
    addNewProperty,
    properties: property,
  };
};
export default useProperty;
