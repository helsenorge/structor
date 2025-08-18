import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { getLinkIdFromValueString } from "src/helpers/dataReceiverHelper";
import { OrderItem } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadataType } from "src/types/IQuestionnaireMetadataType";
import { isItemWithLinkIdInArray } from "src/utils/itemSearchUtils";
import { ValidationError } from "src/utils/validationUtils";

import { ErrorLevel } from "./validationTypes";

export const HelsenorgeUrlStartText = "Questionnaire/";
export const HelsenorgeBinaryStartText = "Binary/";
export const HelsenorgeEndpointStartText = "Endpoint/";

export const existDataReceiverLinkId = (
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
): boolean => {
  const linkId = getLinkIdFromValueString(qItem);
  const exists = isItemWithLinkIdInArray(qOrder, linkId);
  return exists;
};

export const createError = (
  linkId: string,
  errorProperty: string,
  errorText: string,
  level?: ErrorLevel,
  index?: number,
  languageCode?: string,
): ValidationError => {
  return {
    linkId: linkId,
    index: index,
    errorProperty: errorProperty,
    errorLevel: level || ErrorLevel.error,
    errorReadableText: errorText,
    languagecode: languageCode,
  };
};

export const ValidateUrl = (
  url: string | undefined,
  questionnaireId: string | undefined,
  t: TFunction<"translation">,
): ValidationError | undefined => {
  if (!url?.trim()) {
    return createError(
      "",
      IQuestionnaireMetadataType.url,
      t(
        "Form does not have an Url, In case of Helsenorge this field must be 'Questionnaire/<Id>'",
      ),
      ErrorLevel.warning,
    );
  }

  if (!url?.startsWith(HelsenorgeUrlStartText)) {
    return createError(
      "",
      IQuestionnaireMetadataType.url,
      t("In case of Helsenorge this field must be 'Questionnaire/<Id>'"),
      ErrorLevel.warning,
    );
  }

  if (url?.startsWith(HelsenorgeUrlStartText)) {
    if (GetValueAfterSlash(url) !== questionnaireId) {
      return createError(
        "",
        IQuestionnaireMetadataType.url,
        t("Url must be 'Questionnaire/<Id>'"),
        ErrorLevel.error,
      );
    }
  }
  return undefined;
};

export const GetValueAfterSlash = (value: string): string | undefined => {
  const splitValue = value.split("/");
  return splitValue.length === 2 ? splitValue[1] : undefined;
};

export const getValidationError = (
  propsname: string,
  validationErrors: ValidationError[],
): ValidationError | undefined => {
  const index = validationErrors.findIndex(
    (error) => error.errorProperty === propsname,
  );
  if (index > -1) {
    return validationErrors[index];
  }
  return undefined;
};
