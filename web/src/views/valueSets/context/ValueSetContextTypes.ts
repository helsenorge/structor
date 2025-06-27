import { ValueSet } from "fhir/r4";

export type ValueSetContextInputTypes = {
  children: React.ReactNode;
};
export type ValueSetContextValueTypes = {
  setNewValueSet: React.Dispatch<React.SetStateAction<ValueSet>>;
  newValueSet: ValueSet;
  reset: () => void;
  handleEdit: (valueSet: ValueSet) => void;
  canEdit: (type?: string) => boolean;
};
