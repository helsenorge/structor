import { ValueSet } from "fhir/r4";

export type ValueSetContextInputTypes = {
  children: React.ReactNode;
};
export type ValueSetContextValueTypes = {
  setNewValueSet: React.Dispatch<React.SetStateAction<ValueSet>>;
  copyComposeIncludeConcept: (id?: string, includeIndex?: number) => void;
  newValueSet: ValueSet;
  reset: () => void;
  handleEdit: (valueSet: ValueSet) => void;
  canEdit: (type?: string) => boolean;
  valueSets: ValueSet[] | undefined;
};
