import { createContext } from "react";

import type { CodeSystemContextValueTypes } from "./CodeSystemContextTypes";

export const CodeSystemContext = createContext<
  CodeSystemContextValueTypes | undefined
>(undefined);
