import { useCallback } from "react";

import type { ValidationError } from "../../../utils/validationUtils";

import {
  ErrorClassVariant,
  getSeverityClass,
} from "../../Validation/validationHelper";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAnchorMenuHelpers = () => {
  const validationClasses = useCallback(
    (linkId: string, validationErrors?: ValidationError[]): string => {
      return getSeverityClass(
        ErrorClassVariant.highlight,
        validationErrors?.filter((error) => error.linkId === linkId) ?? [],
      );
    },
    [],
  );

  return {
    validationClasses,
  };
};
