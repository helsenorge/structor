import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { hasExtension } from "src/helpers/extensionHelper";
import { ICodeSystem, IExtensionType } from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { ItemTypeConstants } from "@helsenorge/refero";

import { createError } from "../../validationHelper";
import { findQuestionnaireItemInQuestionnaire } from "../utils";

const reasonReference = "ServiceRequest#reasonReference";
const supportingInfo = "ServiceRequest#supportingInfo";
const definitions: string[] = [reasonReference, supportingInfo];
export const serviceRequestValidation = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  const validateReasonReferenceValidation = validateReasonReference(
    t,
    qItem,
    questionnaire,
  );
  const validateSupportingInfoValidation = validateSupportingInfo(t, qItem);
  return validateReasonReferenceValidation.concat(
    validateSupportingInfoValidation,
  );
};
const validateReasonReference = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  return [
    ...ancestorHasServiceRequestExtension(t, qItem, questionnaire),
    ...resourceMustBeCorrectType(
      t,
      qItem,
      "type",
      "reasonReference",
      [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      ICodeSystem.resourceTypes,
    ),
    ...resourceMustBeCorrectType(
      t,
      qItem,
      "identifier",
      "reasonReference",
      [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      ICodeSystem.resourceTypes,
    ),
    ...resourceMustBeCorrectType(t, qItem, "display", "reasonReference", [
      ItemTypeConstants.STRING,
      ItemTypeConstants.DISPLAY,
    ]),
    ...resourceMustBeCorrectType(t, qItem, "reference", "reasonReference", [
      ItemTypeConstants.STRING,
      ItemTypeConstants.DISPLAY,
    ]),
  ];
};
const validateSupportingInfo = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  return [
    ...resourceMustBeCorrectType(
      t,
      qItem,
      "type",
      "supportingInfo",
      [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      ICodeSystem.resourceTypes,
    ),
    ...resourceMustBeCorrectType(
      t,
      qItem,
      "identifier",
      "supportingInfo",
      [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      ICodeSystem.resourceTypes,
    ),
    ...resourceMustBeCorrectType(t, qItem, "display", "supportingInfo", [
      ItemTypeConstants.STRING,
      ItemTypeConstants.DISPLAY,
    ]),
    ...resourceMustBeCorrectType(t, qItem, "reference", "supportingInfo", [
      ItemTypeConstants.STRING,
      ItemTypeConstants.DISPLAY,
    ]),
  ];
};
const resourceMustBeCorrectType = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  resource: "type" | "identifier" | "display" | "reference",
  serviceRequestType: "reasonReference" | "supportingInfo",
  types: QuestionnaireItem["type"][] | string[],
  orCodeSystem?: string | boolean,
): ValidationError[] => {
  if (
    qItem.definition &&
    qItem.definition.includes(
      `ServiceRequest#${serviceRequestType}.${resource}`,
    )
  ) {
    if (!types.includes(qItem.type)) {
      const codeSystemOk =
        typeof orCodeSystem === "boolean"
          ? !orCodeSystem
          : !!qItem.code?.some((c) => c.system === orCodeSystem);

      if (codeSystemOk) {
        return [];
      } else {
        return [
          createError(
            qItem.linkId,
            "system",
            t(
              `Invalid type for item {0}. Expected choice, open-choice, or code. on {1}.`,
            )
              .replace("{0}", qItem.linkId)
              .replace("{1}", resource),
          ),
        ];
      }
    } else {
      return [];
    }
  }
  return [];
};

const ancestorHasServiceRequestExtension = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  if (!questionnaire || !questionnaire?.item) return [];
  if (
    qItem.definition &&
    definitions.some((def) => qItem.definition?.includes(def))
  ) {
    const parent = findQuestionnaireItemInQuestionnaire(
      questionnaire.item,
      (itm: QuestionnaireItem) =>
        hasExtension(itm, IExtensionType.itemExtractionContext),
    );
    const child = findQuestionnaireItemInQuestionnaire(
      parent?.item,
      (itm: QuestionnaireItem) =>
        !!(
          itm.definition &&
          definitions.some((def) => itm.definition?.includes(def))
        ),
    );
    if (!parent) {
      return [
        createError(
          qItem.linkId,
          "system",
          t(`no item with extension {0} found as parent to {1}`)
            .replace("{0}", IExtensionType.itemExtractionContext)
            .replace("{1}", qItem.linkId),
        ),
      ];
    } else if (parent && !child) {
      return [
        createError(
          qItem.linkId,
          "system",
          t(`no item with definition {0} or {1} found as child to {2}`)
            .replace("{0}", `${reasonReference}`)
            .replace("{1}", `${supportingInfo}`)
            .replace("{2}", qItem.linkId),
        ),
      ];
    }
  }
  return [];
};
