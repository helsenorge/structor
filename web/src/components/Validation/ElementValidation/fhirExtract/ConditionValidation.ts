import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import {
  IExtensionType,
  ItemExtractionContext,
} from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { ItemTypeConstants } from "@helsenorge/refero";

import {
  ancestorHasConditionExtractionContext,
  COND_EVIDENCE_ANCHOR,
  CONDITION_ANCHORS,
  hasExtensionWithUrlAndValueUri,
  makeExpectedTypesText,
} from "./utils";
import { createError } from "../../validationHelper";

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
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "detail.type",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "detail.identifier",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "detail.display",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "detail.reference",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "code",
      anchor: COND_EVIDENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
  ];
};

const resourceMustBeCorrectType = ({
  t,
  qItem,
  anchor,
  resource,
  allowedTypes,
  orCodeSystem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
  anchor: (typeof CONDITION_ANCHORS)[number];
  resource:
    | "detail.type"
    | "detail.identifier"
    | "detail.display"
    | "detail.reference"
    | "code";
  allowedTypes: Array<QuestionnaireItem["type"] | string>;
  orCodeSystem?: string | boolean;
}): ValidationError[] => {
  if (qItem.definition && qItem.definition.includes(`${anchor}.${resource}`)) {
    const typeOk = allowedTypes.includes(qItem.type);

    const codeSystemOk =
      typeof orCodeSystem === "boolean"
        ? !orCodeSystem
        : !!qItem.code?.some((c) => c.system === orCodeSystem);

    if (typeOk || codeSystemOk) {
      return [];
    }

    return [
      createError(
        qItem.linkId,
        "system",
        t(`Invalid type for item {0}. {1} on {2}.`)
          .replace("{0}", qItem.linkId)
          .replace("{1}", makeExpectedTypesText(t, allowedTypes, orCodeSystem))
          .replace("{2}", resource),
      ),
    ];
  }
  return [];
};
