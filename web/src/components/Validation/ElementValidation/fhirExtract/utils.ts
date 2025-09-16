import { Extension, Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { findExtensionByUrl, hasExtension } from "src/helpers/extensionHelper";
import { IExtensionType } from "src/types/IQuestionnareItemType";
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

export const findQuestionnaireItemsInQuestionnaire = (
  questionnaireItems: QuestionnaireItem[] | undefined,
  condition: (item: QuestionnaireItem) => boolean,
): QuestionnaireItem[] => {
  const results: QuestionnaireItem[] = [];

  for (const item of questionnaireItems ?? []) {
    if (condition(item)) {
      results.push(item);
    }

    if (item.item?.length) {
      results.push(
        ...findQuestionnaireItemsInQuestionnaire(item.item, condition),
      );
    }
  }

  return results;
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
    CONDITION_ANCHORS.some((def) => qItem.definition?.includes(def));

  if (!definitionHitsAnchor) return [];

  const parents = findQuestionnaireItemsInQuestionnaire(
    questionnaire.item,
    findParentConditionFunction,
  );
  if (parents.length === 0) {
    return [
      createError(
        qItem.linkId,
        "system",
        t(`no item with extension {0} found`).replace(
          "{0}",
          IExtensionType.itemExtractionContext,
        ),
      ),
    ];
  }

  for (const parent of parents) {
    const hits = findQuestionnaireItemsInQuestionnaire(
      parent.item ?? [],
      (itm: QuestionnaireItem) => itm.linkId === qItem.linkId,
    );
    if (hits.length > 0) {
      return [];
    }
  }

  return [
    createError(
      qItem.linkId,
      "system",
      t(`no item with extension {0} found as parent to {1}`)
        .replace("{0}", IExtensionType.itemExtractionContext)
        .replace("{1}", qItem.linkId),
    ),
  ];
};
export const resourceMustBeCorrectType = <
  T extends string,
  ResourceType extends string,
>({
  t,
  qItem,
  anchor,
  resource,
  allowedTypes,
  orCodeSystem,
}: {
  t: TFunction<"translation">;
  qItem: QuestionnaireItem;
  anchor: T;
  resource?: ResourceType;
  allowedTypes: Array<QuestionnaireItem["type"] | string>;
  orCodeSystem?: string | true;
}): ValidationError[] => {
  if (
    qItem.definition &&
    (resource
      ? qItem.definition.includes(`${anchor}.${resource}`)
      : qItem.definition.endsWith(anchor))
  ) {
    const typeOk = allowedTypes.includes(qItem.type);

    const codeSystemOk =
      typeof orCodeSystem === "boolean"
        ? qItem.code && qItem.code?.length > 0
        : !!qItem.code?.some((c) => c.system === orCodeSystem);

    if (typeOk || codeSystemOk) {
      return [];
    }

    return [
      createError(
        qItem.linkId,
        "system",
        t(`Invalid type for item {0}. {1}${resource ? ` on {2}` : ""}`)
          .replace("{0}", qItem.linkId)
          .replace("{1}", makeExpectedTypesText(t, allowedTypes, orCodeSystem))
          .replace("{2}", resource || ""),
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
export const COND_CODE_ANCHOR = "Condition#Code";

export const CONDITION_ANCHORS = [
  COND_EVIDENCE_ANCHOR,
  COND_RECORDED_DATE_ANCHOR,
  COND_CODE_ANCHOR,
] as const;
export type ConditionAnchor = (typeof CONDITION_ANCHORS)[number];

//ServiceRequest
export const SR_REASON_REFERENCE_ANCHOR = "ServiceRequest#reasonReference";
export const SR_SUPPORTING_INFO_ANCHOR = "ServiceRequest#supportingInfo";

export const SERVICE_REQUEST_ANCHORS = [
  SR_REASON_REFERENCE_ANCHOR,
  SR_SUPPORTING_INFO_ANCHOR,
] as const;
export type ServiceRequestAnchor = (typeof SERVICE_REQUEST_ANCHORS)[number];
