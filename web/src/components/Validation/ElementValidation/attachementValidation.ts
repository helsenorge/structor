import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import {
  MAX_ATTACHMENT_ALLOWED,
  MAX_ATTACHMENT_SIZE_MB,
} from "src/helpers/constants";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import {
  getMaxOccursExtensionValue,
  getMaxSizeExtensionValue,
} from "@helsenorge/refero";

import { ErrorLevel, ValidationType } from "../validationTypes";

export const attachementValidation = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const attachmentValidation = validateMaxSize(t, qItem);
  const maxOccurrencesValidation = validateMaxOccurrencesAttachment(t, qItem);
  return [...attachmentValidation, ...maxOccurrencesValidation];
};
const validateMaxSize = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (qItem.type === IQuestionnaireItemType.attachment) {
    const maxSize = getMaxSizeExtensionValue(qItem);
    if (maxSize !== undefined && maxSize > MAX_ATTACHMENT_SIZE_MB) {
      errors.push({
        errorLevel: ErrorLevel.warning,
        errorProperty: ValidationType.extension,
        linkId: qItem.linkId,
        errorReadableText: t(
          "Attachment size exceeds maximum limit of {0}Mb".replace(
            "{0}",
            String(MAX_ATTACHMENT_SIZE_MB),
          ),
        ),
        index:
          qItem.extension?.findIndex(
            (ext) => ext.url === IExtensionType.maxSize,
          ) ?? -1,
      });
    }
  }
  return errors;
};
const validateMaxOccurrencesAttachment = (
  t: TFunction<"translation">,
  qItem: QuestionnaireItem,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (qItem.type === IQuestionnaireItemType.attachment) {
    const maxOccurrences = getMaxOccursExtensionValue(qItem);
    if (
      maxOccurrences !== undefined &&
      maxOccurrences > MAX_ATTACHMENT_ALLOWED
    ) {
      errors.push({
        errorLevel: ErrorLevel.warning,
        errorProperty: ValidationType.extension,
        linkId: qItem.linkId,
        errorReadableText: t(
          "Attachment exceeds maximum limit of {0}".replace(
            "{0}",
            String(MAX_ATTACHMENT_ALLOWED),
          ),
        ),
        index:
          qItem.extension?.findIndex(
            (ext) => ext.url === IExtensionType.maxOccurs,
          ) ?? -1,
      });
    }
  }
  return errors;
};
