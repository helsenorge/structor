import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { getQuestionnaireItemWithChildren } from "src/helpers/codeHelper";
import { Items, OrderItem, TreeState } from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";

import { validateTableCommonFunction } from "./commonTableValidation";
import { validateGTable } from "./gTableValidation";
import { validateTableHn1 } from "./tableHn1Validation";
import { validateTableHn2 } from "./tableHn2Validation";
import { validateTable } from "./tableValidation";

export const validateTableElements = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  state.qOrder.forEach((item) =>
    validate(t, item, state.qItems, state.qOrder, errors, state),
  );

  return errors;
};

const validate = (
  t: TFunction<"translation">,
  currentItem: OrderItem,
  qItems: Items,
  qOrder: OrderItem[],
  errors: ValidationError[],
  state: TreeState,
): void => {
  const qItem = qItems[currentItem.linkId];
  const item = getQuestionnaireItemWithChildren({
    linkId: qItem.linkId,
    qItems,
    qOrder,
  }) as QuestionnaireItem;
  errors.push(...validateTable(t, item, state));
  errors.push(...validateTableHn2({ t, qItem: item }));
  errors.push(...validateTableHn1({ t, qItem: item }));
  errors.push(...validateTableCommonFunction({ t, qItem: item }));
  errors.push(...validateGTable({ t, qItem: item }));
  currentItem.items.forEach((item) =>
    validate(t, item, qItems, qOrder, errors, state),
  );
};
