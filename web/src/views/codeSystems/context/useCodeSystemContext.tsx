import { useContext } from "react";

import { CodeSystemContext } from "./CodeSystemContext";
import { CodeSystemContextValueTypes } from "./CodeSystemContextTypes";

export const useCodeSystemContext = (): CodeSystemContextValueTypes => {
  const context = useContext(CodeSystemContext);
  if (context === undefined) {
    throw new Error(
      "useCodeSystemContext must be used within a CodeSystemProvider",
    );
  }
  return context;
};
