import { createContext } from "react";

import type { ValidationType } from "./ValidationContextTypes";

export const ValidationContext = createContext<ValidationType | undefined>(
  undefined,
);
