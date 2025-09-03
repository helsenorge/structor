import { Extension, Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { findExtensionByUrl } from "src/helpers/extensionHelper";
import {
  IExtensionType,
  ItemExtractionContext,
} from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { ItemTypeConstants } from "@helsenorge/refero";

import { createError } from "../../validationHelper";
import { findQuestionnaireItemInQuestionnaire } from "../utils";

const COND_EVIDENCE_ANCHOR = "Condition#Evidence";
const COND_RECORDED_DATE_ANCHOR = "Condition#RecordedDate";
const COND_CODE_ANCHOR = "Condition#Code"; // <== casing fixed

const CONDITION_ANCHORS = [
  COND_EVIDENCE_ANCHOR,
  COND_RECORDED_DATE_ANCHOR,
  COND_CODE_ANCHOR,
] as const;

const makeExpectedTypesText = (
  t: TFunction<"translation">,
  types: Array<QuestionnaireItem["type"] | string>,
  orCodeSystem?: string | boolean,
): string => {
  const uniq = Array.from(new Set(types));
  const list = uniq.join(", ");
  if (orCodeSystem) {
    return t(`Expected one of [{0}] or a code.`).replace("{0}", list);
  }
  return t(`Expected one of [{0}].`).replace("{0}", list);
};

export const conditionValidation = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  const conditionEvidenceValidation = validateConditionEvidence(
    t,
    qItem,
    questionnaire,
  );
  return conditionEvidenceValidation;
};
const hasExtensionWithUrlAndValueUri = (
  url: string,
  valueUri: string,
  extensions?: Extension[],
): boolean => {
  const ext = findExtensionByUrl(extensions, url);
  return ext?.valueUri === valueUri;
};
const validateConditionEvidence = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  return [
    ...ancestorHasConditionExtractionContext(t, qItem, questionnaire),
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

const ancestorHasConditionExtractionContext = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  if (!questionnaire?.item?.length) return [];

  const definitionHitsAnchor =
    !!qItem.definition &&
    CONDITION_ANCHORS.some((def) => qItem.definition!.includes(def));

  if (!definitionHitsAnchor) return [];

  const parent = findQuestionnaireItemInQuestionnaire(
    questionnaire.item,
    (itm: QuestionnaireItem) =>
      hasExtensionWithUrlAndValueUri(
        IExtensionType.itemExtractionContext,
        ItemExtractionContext.condition,
        itm.extension,
      ),
  );

  const child = findQuestionnaireItemInQuestionnaire(
    parent?.item,
    (itm: QuestionnaireItem) =>
      !!itm.definition &&
      CONDITION_ANCHORS.some((def) => itm.definition!.includes(def)),
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
  }

  if (parent && !child) {
    const anchorsText = CONDITION_ANCHORS.join(" or ");
    return [
      createError(
        qItem.linkId,
        "system",
        t(`no item with definition {0} found as child to {1}`)
          .replace("{0}", anchorsText)
          .replace("{1}", qItem.linkId),
      ),
    ];
  }

  return [];
};
