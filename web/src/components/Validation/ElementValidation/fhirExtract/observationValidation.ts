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
  hasExtensionWithUrlAndValueUri,
  OBSERVATION_ANCHORS,
  OBS_CODE_ANCHOR,
  ObservationAnchor,
  ancestorHasConditionExtractionContext,
  resourceMustBeCorrectType,
  OBS_DERIVED_FROM_ANCHOR,
} from "./utils";

type ResourceType =
  | "value[x]"
  | "code"
  | "type"
  | "identifier"
  | "display"
  | "reference";

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
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
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
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      resource: "code",
      anchor: OBS_COMPONENT_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      anchor: OBS_COMPONENT_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      anchor: OBS_CODE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      anchor: OBS_CATEGORY_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.DISPLAY],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      anchor: OBS_EFFECTIVE_DATE_TIME_ANCHOR,
      allowedTypes: [ItemTypeConstants.DATE, ItemTypeConstants.DATETIME],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      resource: "type",
      anchor: OBS_DERIVED_FROM_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      resource: "identifier",
      anchor: OBS_DERIVED_FROM_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      resource: "display",
      anchor: OBS_DERIVED_FROM_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
    ...resourceMustBeCorrectType<ObservationAnchor, ResourceType>({
      t,
      qItem,
      resource: "reference",
      anchor: OBS_DERIVED_FROM_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
  ];
};
