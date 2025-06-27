import { createContext } from "react";

import { ValidationType } from "./ValidationContextTypes";

export const ValidationContext = createContext<ValidationType | undefined>(
  undefined,
);
