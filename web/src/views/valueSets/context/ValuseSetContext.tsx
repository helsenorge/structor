import { createContext } from "react";

import { ValueSetContextValueTypes } from "./ValueSetContextTypes";

export const ValueSetContext = createContext<
  ValueSetContextValueTypes | undefined
>(undefined);
