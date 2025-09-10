import { TFunction } from "react-i18next";
import { TreeState } from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";

import { validateCalulatedExpressionElements } from "./calculatedExpressionValidation";
import { validateDataReceiverElements } from "./data-receiverValidation";
import { validateOrphanedElements } from "./orphanValidation";
import { validateTableElements } from "./tableValidation";

export const validateElements = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const orphanValidation = validateOrphanedElements(t, state);
  const tableValidation = validateTableElements(t, state);
  const dataReceiverValidation = validateDataReceiverElements(t, state);
  const calculatedValidation = validateCalulatedExpressionElements(t, state);
  const elementValidation = orphanValidation
    .concat(tableValidation)
    .concat(dataReceiverValidation)
    .concat(calculatedValidation);
  return elementValidation;
};
