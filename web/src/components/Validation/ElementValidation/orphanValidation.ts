import { QuestionnaireItem, ValueSet } from "fhir/r4";
import { TFunction } from "react-i18next";
import { getValidationExtentionUrls } from "src/helpers/enumHelper";
import {
  findExtensionByUrl,
  getExtensionByCodeAndElement,
  hasExtension,
  hasOneOrMoreExtensions,
  isExtensionValueTrue,
} from "src/helpers/extensionHelper";
import {
  generarteQuestionnaireOrBundle,
  generateMainQuestionnaire,
} from "src/helpers/generateQuestionnaire";
import {
  isItemControlHelp,
  isItemControlHighlight,
  isItemControlInline,
  isItemControlSidebar,
  isRecipientList,
} from "src/helpers/itemControl";
import { isUriValid } from "src/helpers/uriHelper";
import { getValueSetValues } from "src/helpers/valueSetHelper";

import {
  ICodeSystem,
  IExtensionType,
  IOperator,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";
import { ScoringFormulaCodes } from "../../../types/scoringFormulas";

import {
  Items,
  OrderItem,
  TreeState,
} from "../../../store/treeStore/treeStore";
import {
  doesItemWithCodeExistInArray,
  isItemInArray,
  getAllItemTypes,
  doesAllAnswerOptionsInItemHaveExtenison,
} from "../../../utils/itemSearchUtils";
import { ValidationError } from "../../../utils/validationUtils";
import { createError } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";
import { validateChoice } from "./choiceValidation";
import { validateGroup } from "./groupValidation";
import { validateQuantity } from "./quantityValidation";
import { validateRepeatableItems } from "./repeatableValidation";
import { serviceRequestValidation } from "./serviceRequestValidation";

const validEnableWhenChoiceOperators = [IOperator.equal, IOperator.notEqual];

const validateReadonlyFields = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (qItem.readOnly === true) {
    const hasValidation =
      hasOneOrMoreExtensions(
        qItem.extension ?? [],
        getValidationExtentionUrls,
      ) ||
      (!isItemControlHelp(qItem) && !!qItem.maxLength);
    if (hasValidation) {
      errors.push(
        createError(
          qItem.linkId,
          "validation",
          t("Readonly fields should not have validation"),
        ),
      );
    }
  }
  return errors;
};

const validateMaxMinOnScore = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const hasMinValue = !!findExtensionByUrl(
    qItem.extension,
    IExtensionType.minValue,
  );
  const hasMaxValue = !!findExtensionByUrl(
    qItem.extension,
    IExtensionType.maxValue,
  );
  const isScoringField = !!getExtensionByCodeAndElement(
    qItem,
    ICodeSystem.score,
  );
  const errors: ValidationError[] = [];

  if (isScoringField && (hasMaxValue || hasMinValue)) {
    errors.push(
      createError(
        qItem.linkId,
        "minValue",
        t("MinValue and/or maxValue can not be set on scoring fields"),
      ),
    );
  }
  return errors;
};

const validateUniqueLinkId = (
  t: TFunction<"translation">,
  qItems: Items,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  const hasLinkIdCollision =
    Object.keys(qItems).filter((x) => x === qItem.linkId).length > 1;
  if (hasLinkIdCollision) {
    returnErrors.push(
      createError(qItem.linkId, "linkId", t("LinkId is already in use")),
    );
  }
  return returnErrors;
};

const validateRequiredItem = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (
    (qItem.type === IQuestionnaireItemType.group ||
      qItem.type === IQuestionnaireItemType.display ||
      isExtensionValueTrue(
        qItem.extension,
        IExtensionType.hidden,
        "valueBoolean",
      ) ||
      isItemControlInline(qItem) ||
      isItemControlHighlight(qItem) ||
      isItemControlHelp(qItem) ||
      isItemControlSidebar(qItem)) &&
    qItem.required
  ) {
    returnErrors.push(
      createError(
        qItem.linkId,
        "required",
        t("Question is required, but cannot be required"),
      ),
    );
  }
  return returnErrors;
};

const validateFhirpathDateValidation = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (
    qItem.type === IQuestionnaireItemType.date ||
    qItem.type === IQuestionnaireItemType.dateTime
  ) {
    (qItem.extension || []).forEach((extension, index) => {
      const isFhirPathExtension =
        extension.url === IExtensionType.fhirPathMinValue ||
        extension.url === IExtensionType.fhirPathMaxValue;
      if (
        isFhirPathExtension &&
        extension.valueString?.split(" ").filter(Boolean).length !== 1 &&
        extension.valueString?.split(" ").filter(Boolean).length !== 4
      ) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "extension",
            t("Error in FHIRpath date validation"),
            ErrorLevel.error,
            index,
          ),
        );
      }
    });
  }
  return returnErrors;
};

const validateItemCode = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  (qItem.code || []).forEach((code, index) => {
    if (!code.code) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "code.code",
          t('Code does not have "code" property'),
          ErrorLevel.error,
          index,
        ),
      );
    }
    if (!code.system) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "code.system",
          t('Code does not have "system" property'),
          ErrorLevel.error,
          index,
        ),
      );
    }
    if (code.system && !isUriValid(code.system)) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "code",
          t("Code does not have a valid system"),
          ErrorLevel.error,
          index,
        ),
      );
    }
  });
  return returnErrors;
};

const validatefhirPath = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (hasExtension(qItem, IExtensionType.fhirPath)) {
    const hasMinLength = hasExtension(qItem, IExtensionType.minLength);
    if (hasMinLength || qItem.maxLength) {
      errors.push(
        createError(
          qItem.linkId,
          "minLength",
          t("MinLength and/or maxLength can not be set on enrichment fields"),
        ),
      );
    }
    const isRequiredField = qItem.required;
    if (isRequiredField) {
      errors.push(
        createError(
          qItem.linkId,
          "required",
          t("Required can not be set on enrichment fields"),
        ),
      );
    }
    const hasRegex = hasExtension(qItem, IExtensionType.regEx);
    if (hasRegex) {
      errors.push(
        createError(
          qItem.linkId,
          "regex",
          t("Regular expressions can not be set on enrichment fields"),
        ),
      );
    }
  }
  return errors;
};

const validateScoring = (
  t: TFunction<"translation">,
  qItems: Items,
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  (qItem.code || []).forEach((code, index) => {
    if (code.code === ScoringFormulaCodes.sectionScore) {
      const allGroups = getAllItemTypes(
        qOrder,
        qItems,
        IQuestionnaireItemType.group,
      );
      const isItemInAGroup = isItemInArray(allGroups, qItem);
      if (!isItemInAGroup) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "code.code",
            t("A section score summation field must be inside a group"),
            ErrorLevel.error,
            index,
          ),
        );
      }
    }
    if (
      code.code === ScoringFormulaCodes.sectionScore ||
      code.code === ScoringFormulaCodes.totalScore
    ) {
      const doesQSExist = doesItemWithCodeExistInArray(
        qOrder,
        qItems,
        ScoringFormulaCodes.questionScore,
      );
      if (!doesQSExist) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "code.code",
            t(
              "A summation field requires that a scoring field exists in the questionnaire",
            ),
            ErrorLevel.error,
            index,
          ),
        );
      }
      const hasCalculatedExpressionExtension = hasExtension(
        qItem,
        IExtensionType.calculatedExpression,
      );
      if (hasCalculatedExpressionExtension) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "code.code",
            t("A summation field cannot have a calculation formula"),
            ErrorLevel.error,
            index,
          ),
        );
      }
    }
    if (code.code === ScoringFormulaCodes.questionScore) {
      const doesSSOrTSExist =
        doesItemWithCodeExistInArray(
          qOrder,
          qItems,
          ScoringFormulaCodes.sectionScore,
        ) ||
        doesItemWithCodeExistInArray(
          qOrder,
          qItems,
          ScoringFormulaCodes.totalScore,
        );
      if (!doesSSOrTSExist) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "code.code",
            t(
              "A scoring field requires that a summation field exists in the questionnaire",
            ),
            ErrorLevel.error,
            index,
          ),
        );
      }
      const doesAllAnswerOptionsInItemHaveOrdinalValueExtenison =
        doesAllAnswerOptionsInItemHaveExtenison(
          qItem,
          IExtensionType.ordinalValue,
        );
      if (!doesAllAnswerOptionsInItemHaveOrdinalValueExtenison) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "code.code",
            t(
              "A scoring field must have a scoring value in all answer options",
            ),
            ErrorLevel.error,
            index,
          ),
        );
      }
    }
  });
  returnErrors.push(...validateMaxMinOnScore(t, qItem));
  return returnErrors;
};

const validateAnswerOptionSystem = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.answerOption) {
    if (
      !qItem.answerOption[0].valueCoding?.system ||
      !isUriValid(qItem.answerOption[0].valueCoding?.system)
    ) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "system",
          t("answerOption system cannot be empty or have not a valid format"),
          ErrorLevel.error,
          0,
        ),
      );
    }
  }
  return returnErrors;
};

const validateExtensions = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  (qItem.extension || []).forEach((extension, index) => {
    if (Object.keys(extension).indexOf("url") === -1) {
      // extension without url
      returnErrors.push(
        createError(
          qItem.linkId,
          "extension",
          t('Extension has no "url" property'),
          ErrorLevel.error,
          index,
        ),
      );
    }
    const valueProps = Object.keys(extension).filter(
      (key: string) => key.substring(0, 5) === "value",
    );
    if (valueProps.length !== 1) {
      // extension with wrong number of value[x]
      returnErrors.push(
        createError(
          qItem.linkId,
          "extension",
          t("Extension does not have value[x], or has more than one value[x]"),
          ErrorLevel.error,
          index,
        ),
      );
    }
  });
  return returnErrors;
};

const validateInitial = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  qContained: ValueSet[],
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (qItem.initial && qItem.initial[0].valueCoding) {
    if (qItem.answerOption) {
      const isMatch = qItem.answerOption.find(
        (x) =>
          qItem.initial &&
          qItem.initial[0] &&
          qItem.initial[0].valueCoding?.code === x.valueCoding?.code &&
          qItem.initial[0].valueCoding?.system === x.valueCoding?.system,
      );
      if (!isMatch) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "initial",
            t("Initial value is not a possible value"),
          ),
        );
      }
    } else if (qItem.answerValueSet) {
      const valueSetToCheck = qContained.find(
        (x) => `#${x.id}` === qItem.answerValueSet,
      );
      if (valueSetToCheck) {
        const isMatch = getValueSetValues(valueSetToCheck).find(
          (x) =>
            qItem.initial &&
            qItem.initial[0] &&
            qItem.initial[0].valueCoding?.code === x.code &&
            qItem.initial[0].valueCoding?.system === x.system,
        );
        if (!isMatch) {
          returnErrors.push(
            createError(
              qItem.linkId,
              "initial",
              t("Initial value is not a possible value"),
            ),
          );
        }
      } else {
        // valueSet does not exist
        returnErrors.push(
          createError(
            qItem.linkId,
            "initial",
            t("ValueSet of initial value does not exist"),
          ),
        );
      }
    }
  }
  return returnErrors;
};

const validateEnableWhen = (
  t: TFunction<"translation">,
  qItems: Items,
  qItem: QuestionnaireItem,
  qContained: ValueSet[],
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  qItem.enableWhen?.forEach((ew, index) => {
    // does the question exist?
    const itemExists = !!qItems[ew.question];
    if (!itemExists) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "enableWhen.question",
          t(
            "This enableWhen refers to a question with linkId which does not exist",
          ),
          ErrorLevel.error,
          index,
        ),
      );
    }

    // does enableWhen object have the correct keys?
    if (Object.keys(ew).length !== 3) {
      returnErrors.push(
        createError(
          qItem.linkId,
          "enableWhen",
          t(
            "enableWhen is not configured correctly. There are too many answer[x]-properties",
          ),
          ErrorLevel.error,
          index,
        ),
      );
    }

    // does the Coding exist or the quantity system and code match?
    if (
      itemExists &&
      qItems[ew.question].type === IQuestionnaireItemType.quantity &&
      ew.operator !== IOperator.exists
    ) {
      const quantityExtension = qItems[ew.question].extension?.find(
        (x) => x.url === IExtensionType.questionnaireUnit,
      );

      const isMatch =
        quantityExtension &&
        ew.answerQuantity?.system === quantityExtension.valueCoding?.system &&
        ew.answerQuantity?.code === quantityExtension.valueCoding?.code;

      if (!isMatch) {
        returnErrors.push(
          createError(
            qItem.linkId,
            "enableWhen.answerQuantity",
            t("Quantity does not match system and code"),
            ErrorLevel.error,
            index,
          ),
        );
      }
    }

    // if choice, does the Coding exist (or reference if question item is mottaker)?
    if (
      itemExists &&
      (qItems[ew.question].type === IQuestionnaireItemType.choice ||
        qItems[ew.question].type === IQuestionnaireItemType.openChoice)
    ) {
      if (
        isRecipientList(qItems[ew.question]) &&
        ew.operator !== IOperator.exists
      ) {
        // does the reference exist?
        const isMatch = qItems[ew.question].extension?.find(
          (x) => x.valueReference?.reference === ew.answerReference?.reference,
        );
        if (!isMatch) {
          returnErrors.push(
            createError(
              qItem.linkId,
              "enableWhen.answerReference",
              t("Recipient set in this enableWhen does not exist"),
              ErrorLevel.error,
              index,
            ),
          );
        }
      } else if (
        qItems[ew.question].answerOption &&
        ew.operator !== IOperator.exists
      ) {
        if (
          validEnableWhenChoiceOperators.indexOf(ew.operator as IOperator) ===
          -1
        ) {
          returnErrors.push(
            createError(
              qItem.linkId,
              "enableWhen.operator",
              t("Operator used in this enableWhen is not supported"),
              ErrorLevel.error,
              index,
            ),
          );
        } else {
          const isMatch = qItems[ew.question].answerOption?.find(
            (x) =>
              x.valueCoding?.system === ew.answerCoding?.system &&
              x.valueCoding?.code === ew.answerCoding?.code,
          );
          if (!isMatch) {
            returnErrors.push(
              createError(
                qItem.linkId,
                "enableWhen.answerCoding",
                t("Coding expected in this enableWhen does not exist"),
                ErrorLevel.error,
                index,
              ),
            );
          }
        }
      } else if (
        qItems[ew.question].answerValueSet &&
        ew.operator !== IOperator.exists
      ) {
        if (
          validEnableWhenChoiceOperators.indexOf(ew.operator as IOperator) ===
          -1
        ) {
          returnErrors.push(
            createError(
              qItem.linkId,
              "enableWhen.operator",
              t("Operator used in this enableWhen is not supported"),
              ErrorLevel.error,
              index,
            ),
          );
        } else {
          // check contained valueSets
          const valueSetToCheck = qContained.find(
            (x) => `#${x.id}` === qItems[ew.question].answerValueSet,
          );
          if (valueSetToCheck) {
            const isMatch = getValueSetValues(valueSetToCheck).find(
              (x) =>
                ew.answerCoding &&
                x.code === ew.answerCoding.code &&
                x.system === ew.answerCoding.system,
            );
            if (!isMatch) {
              returnErrors.push(
                createError(
                  qItem.linkId,
                  "enableWhen.answerCoding",
                  t("Coding expected in this enableWhen does not exist"),
                  ErrorLevel.error,
                  index,
                ),
              );
            }
          } else {
            // valueSet does not exist
            returnErrors.push(
              createError(
                qItem.linkId,
                "enableWhen.answerCoding",
                t("The ValueSet referenced in this enableWhen does not exist"),
                ErrorLevel.error,
                index,
              ),
            );
          }
        }
      }
    }
  });
  return returnErrors;
};

export const validateOrphanedElements = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  state.qOrder.forEach((item) =>
    validate(
      t,
      errors,
      item,
      state.qItems,
      state.qOrder,
      state.qContained,
      state,
    ),
  );

  return errors;
};
const validate = (
  t: TFunction<"translation">,
  errors: ValidationError[],
  currentItem: OrderItem,
  qItems: Items,
  qOrder: OrderItem[],
  qContained: ValueSet[] = [],
  state: TreeState,
): void => {
  const questionnaires = generateMainQuestionnaire(state);

  const qItem = qItems[currentItem.linkId];

  //validate group item
  errors.push(...validateGroup(t, qItem, qItems, qOrder));

  //validate that readonly fields
  errors.push(...validateReadonlyFields(t, qItem));

  //validate enriched fields
  errors.push(...validatefhirPath(t, qItem));

  // validate that this item has a unique linkId:
  errors.push(...validateUniqueLinkId(t, qItems, qItem));

  // validate required item which cannot have an answer
  errors.push(...validateRequiredItem(t, qItem));

  // validate fhirpath date extensions
  errors.push(...validateFhirpathDateValidation(t, qItem));

  // validate item.code
  errors.push(...validateItemCode(t, qItem));

  // validate scoring
  errors.push(...validateScoring(t, qItems, qItem, qOrder));

  // validate system in answerOptions
  errors.push(...validateAnswerOptionSystem(t, qItem));

  // validate quantity
  errors.push(...validateQuantity(t, qItem));

  // validate dead extensions
  errors.push(...validateExtensions(t, qItem));

  // validate initial for Coding (choice + open-choice):
  errors.push(...validateInitial(t, qItem, qContained));

  // validate enableWhen
  errors.push(...validateEnableWhen(t, qItems, qItem, qContained));

  // validate choice
  errors.push(...validateChoice(t, qItem));

  // validate repeatable items
  errors.push(...validateRepeatableItems(t, qItem, qOrder));
  errors.push(...serviceRequestValidation(t, qItem, questionnaires));

  currentItem.items.forEach((item) =>
    validate(t, errors, item, qItems, qOrder, qContained, state),
  );
};
