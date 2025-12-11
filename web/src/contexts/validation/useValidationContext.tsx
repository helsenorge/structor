import { useContext } from "react";

import type { ValidationType } from "./ValidationContextTypes";

import { ValidationContext } from "./ValidationContext";

export const useValidationContext = (): ValidationType => {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error(
      "useValidationContext must be used within a ValidationProvider",
    );
  }
  return context;
};
