import {
  IExtensionType,
  ItemExtractionContext,
} from "src/types/IQuestionnareItemType";

import type { Questionnaire, QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "i18next";
import type { ValidationError } from "src/utils/validationUtils";

import { ItemTypeConstants } from "@helsenorge/refero";

import {
  type ConditionAnchor,
  ancestorHasConditionExtractionContext,
  COND_EVIDENCE_ANCHOR,
  CONDITION_ANCHORS,
  hasExtensionWithUrlAndValueUri,
  resourceMustBeCorrectType,
} from "./utils";

type resourceType =
  | "detail.type"
  | "detail.identifier"
  | "detail.display"
  | "detail.reference"
  | "code";

export const conditionValidation = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  const conditionEvidenceValidation = validateConditionEvidence(
    t,
    qItem,
    questionnaire,
    CONDITION_ANCHORS,
  );
  return conditionEvidenceValidation;
};

const validateConditionEvidence = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
  CONDITION_ANCHORS: readonly string[],
): ValidationError[] => {
  return [
    ...ancestorHasConditionExtractionContext(
      t,
      qItem,
      questionnaire,
      CONDITION_ANCHORS,
      (itm: QuestionnaireItem) =>
        hasExtensionWithUrlAndValueUri(
          IExtensionType.itemExtractionContext,
          ItemExtractionContext.condition,
          itm.extension,
        ),
    ),
    ...resourceMustBeCorrectType<ConditionAnchor, resourceType>({
      t,
      qItem,
      resource: "detail.type",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ConditionAnchor, resourceType>({
      t,
      qItem,
      resource: "detail.identifier",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ConditionAnchor, resourceType>({
      t,
      qItem,
      resource: "detail.display",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
    ...resourceMustBeCorrectType<ConditionAnchor, resourceType>({
      t,
      qItem,
      resource: "detail.reference",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
    ...resourceMustBeCorrectType<ConditionAnchor, resourceType>({
      t,
      qItem,
      resource: "code",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
  ];
};
