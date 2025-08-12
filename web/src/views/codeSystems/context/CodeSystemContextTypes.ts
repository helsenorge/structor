import { CodeSystem } from "fhir/r4";

export type CodeSystemContextInputTypes = {
  children: React.ReactNode;
};
export type CodeSystemContextValueTypes = {
  setNewCodeSystem: React.Dispatch<React.SetStateAction<CodeSystem>>;
  newCodeSystem: CodeSystem;
  reset: () => void;
  handleEdit: (codeSystem: CodeSystem) => void;
  canEdit: (type?: string) => boolean;
};
