import { Extension, Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { findExtensionByUrl, hasExtension } from "src/helpers/extensionHelper";
import {
  IExtensionType,
  ItemExtractionContext,
} from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { createError } from "../../validationHelper";
export const makeExpectedTypesText = (
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

export const findQuestionnaireItemInQuestionnaire = (
  questionnaireItem: QuestionnaireItem[] | undefined,
  condition: (item: QuestionnaireItem) => boolean,
): QuestionnaireItem | undefined => {
  for (const item of questionnaireItem || []) {
    if (condition(item)) {
      return item;
    }
    if (item.item && item.item.length > 0) {
      const foundInChild = findQuestionnaireItemInQuestionnaire(
        item.item,
        (item: QuestionnaireItem) =>
          hasExtension(item, IExtensionType.itemExtractionContext),
      );
      if (foundInChild) {
        return foundInChild;
      }
    }
  }
};
export const hasExtensionWithUrlAndValueUri = (
  url: string,
  valueUri: string,
  extensions?: Extension[],
): boolean => {
  const ext = findExtensionByUrl(extensions, url);
  return ext?.valueUri === valueUri;
};

export const ancestorHasConditionExtractionContext = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
  CONDITION_ANCHORS: readonly string[],
  findParentConditionFunction: (item: QuestionnaireItem) => boolean,
): ValidationError[] => {
  if (!questionnaire?.item?.length) return [];

  const definitionHitsAnchor =
    !!qItem.definition &&
    CONDITION_ANCHORS.some((def) => qItem.definition!.includes(def));

  if (!definitionHitsAnchor) return [];

  const parent = findQuestionnaireItemInQuestionnaire(
    questionnaire.item,
    findParentConditionFunction,
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
//Observation
export const OBS_COMPONENT_ANCHOR = "Observation#component";
export const OBS_DERIVED_FROM_ANCHOR = "Observation#derivedFrom";
export const OBS_EFFECTIVE_DATE_TIME_ANCHOR = "Observation#effectiveDateTime";
export const OBS_CODE_ANCHOR = "Observation#code";
export const OBS_CATEGORY_ANCHOR = "Observation#Category";
export const OBSERVATION_ANCHORS = [
  OBS_COMPONENT_ANCHOR,
  OBS_DERIVED_FROM_ANCHOR,
  OBS_EFFECTIVE_DATE_TIME_ANCHOR,
  OBS_CODE_ANCHOR,
  OBS_CATEGORY_ANCHOR,
] as const;
export type ObservationAnchor = (typeof OBSERVATION_ANCHORS)[number];

//Condition
export const COND_EVIDENCE_ANCHOR = "Condition#Evidence";
export const COND_RECORDED_DATE_ANCHOR = "Condition#RecordedDate";
export const COND_CODE_ANCHOR = "Condition#Code"; // <== casing fixed

export const CONDITION_ANCHORS = [
  COND_EVIDENCE_ANCHOR,
  COND_RECORDED_DATE_ANCHOR,
  COND_CODE_ANCHOR,
] as const;
export type ConditionAnchor = (typeof CONDITION_ANCHORS)[number];
