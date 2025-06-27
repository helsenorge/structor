import { useContext } from "react";

import { ValidationContext } from "./ValidationContext";
import { ValidationType } from "./ValidationContextTypes";

export const useValidationContext = (): ValidationType => {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error(
      "useValidationContext must be used within a ValidationProvider",
    );
  }
  return context;
};
