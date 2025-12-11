import { useContext } from "react";

import type { CodeSystemContextValueTypes } from "./CodeSystemContextTypes";

import { CodeSystemContext } from "./CodeSystemContext";

export const useCodeSystemContext = (): CodeSystemContextValueTypes => {
  const context = useContext(CodeSystemContext);
  if (context === undefined) {
    throw new Error(
      "useCodeSystemContext must be used within a CodeSystemProvider",
    );
  }
  return context;
};
