import { Questionnaire, QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import {
  IExtensionType,
  ItemExtractionContext,
} from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { ItemTypeConstants } from "@helsenorge/refero";

import {
  OBS_CATEGORY_ANCHOR,
  OBS_COMPONENT_ANCHOR,
  OBS_EFFECTIVE_DATE_TIME_ANCHOR,
  findQuestionnaireItemInQuestionnaire,
  hasExtensionWithUrlAndValueUri,
  makeExpectedTypesText,
  OBSERVATION_ANCHORS,
  OBS_CODE_ANCHOR,
  ObservationAnchor,
  ancestorHasConditionExtractionContext,
} from "./utils";
import { createError } from "../../validationHelper";

type ResourceType = "value[x]" | "code";

export const observationValidation = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  const observationValidationErrors = validateObservation<
    readonly ObservationAnchor[]
  >(t, qItem, questionnaire, OBSERVATION_ANCHORS);
  return observationValidationErrors;
};

const validateObservation = <T extends readonly string[]>(
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
  CONDITION_ANCHORS: T,
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
          ItemExtractionContext.observation,
          itm.extension,
        ),
    ),
    ...resourceMustBeCorrectType<ObservationAnchor>({
      t,
      qItem,
      resource: "value[x]",
      anchor: OBS_COMPONENT_ANCHOR,
      allowedTypes: [
        ItemTypeConstants.CHOICE,
        ItemTypeConstants.OPENCHOICE,
        ItemTypeConstants.QUANTITY,
        ItemTypeConstants.STRING,
        ItemTypeConstants.BOOLEAN,
        ItemTypeConstants.INTEGER,
        ItemTypeConstants.DECIMAL,
        ItemTypeConstants.DATE,
        ItemTypeConstants.DATETIME,
        ItemTypeConstants.DATE,
      ],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor>({
      t,
      qItem,
      resource: "code",
      anchor: OBS_COMPONENT_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor>({
      t,
      qItem,
      anchor: OBS_COMPONENT_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor>({
      t,
      qItem,
      anchor: OBS_CODE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor>({
      t,
      qItem,
      anchor: OBS_CATEGORY_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor>({
      t,
      qItem,
      anchor: OBS_EFFECTIVE_DATE_TIME_ANCHOR,
      allowedTypes: [ItemTypeConstants.DATE, ItemTypeConstants.DATETIME],
      orCodeSystem: true,
    }),
  ];
};

const resourceMustBeCorrectType = <T extends string>({
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
  orCodeSystem?: string | boolean;
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
        ? !orCodeSystem
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
