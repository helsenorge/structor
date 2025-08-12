import { createContext } from "react";

import { CodeSystemContextValueTypes } from "./CodeSystemContextTypes";

export const CodeSystemContext = createContext<
  CodeSystemContextValueTypes | undefined
>(undefined);
