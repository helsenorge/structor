import { useContext } from "react";

import type { ValueSetContextValueTypes } from "./ValueSetContextTypes";

import { ValueSetContext } from "./ValuseSetContext";

export const useValueSetContext = (): ValueSetContextValueTypes => {
  const context = useContext(ValueSetContext);
  if (context === undefined) {
    throw new Error(
      "useValueSetContext must be used within a ValueSetProvider",
    );
  }
  return context;
};
