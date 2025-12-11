import { createContext } from "react";

import type { ValueSetContextValueTypes } from "./ValueSetContextTypes";

export const ValueSetContext = createContext<
  ValueSetContextValueTypes | undefined
>(undefined);
