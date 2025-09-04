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
  hasExtensionWithUrlAndValueUri,
  resourceMustBeCorrectType,
  SERVICE_REQUEST_ANCHORS,
  ServiceRequestAnchor,
  SR_REASON_REFERENCE_ANCHOR,
  SR_SUPPORTING_INFO_ANCHOR,
} from "./utils";

type ResourceType = "type" | "identifier" | "display" | "reference";

export const serviceRequestValidation = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
  questionnaire: Questionnaire,
): ValidationError[] => {
  const validateReasonReferenceValidation = validateReasonReference(
    t,
    qItem,
    questionnaire,
    SERVICE_REQUEST_ANCHORS,
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
          ItemExtractionContext.serviceRequest,
          itm.extension,
        ),
    ),
    ...resourceMustBeCorrectType<ServiceRequestAnchor, ResourceType>({
      t,
      qItem,
      anchor: SR_REASON_REFERENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      resource: "type",
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ServiceRequestAnchor, ResourceType>({
      t,
      qItem,
      resource: "identifier",
      anchor: SR_REASON_REFERENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType<ServiceRequestAnchor, ResourceType>({
      t,
      qItem,
      resource: "display",
      anchor: SR_REASON_REFERENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
    ...resourceMustBeCorrectType<ServiceRequestAnchor, ResourceType>({
      t,
      qItem,
      resource: "reference",
      anchor: SR_REASON_REFERENCE_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
  ];
};
const validateSupportingInfo = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  return [
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "type",
      anchor: SR_SUPPORTING_INFO_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "identifier",
      anchor: SR_SUPPORTING_INFO_ANCHOR,
      allowedTypes: [ItemTypeConstants.CHOICE, ItemTypeConstants.OPENCHOICE],
      orCodeSystem: true,
    }),
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "display",
      anchor: SR_SUPPORTING_INFO_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
    ...resourceMustBeCorrectType({
      t,
      qItem,
      resource: "reference",
      anchor: SR_SUPPORTING_INFO_ANCHOR,
      allowedTypes: [ItemTypeConstants.STRING, ItemTypeConstants.DISPLAY],
    }),
  ];
};
