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
import stylesRaw from "./validation.module.scss";
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

export const ErrorClassVariant = {
  highlight: "highlight",
  text: "text",
  box: "box",
} as const;

export type ErrorClassVariant =
  (typeof ErrorClassVariant)[keyof typeof ErrorClassVariant];

export interface ExtensionError {
  errorLevel: ErrorLevel | string;
}

type SeverityKey =
  | "error-highlight"
  | "warning-highlight"
  | "info-highlight"
  | "error-text"
  | "warning-text"
  | "info-text"
  | "error-highlight-box"
  | "warning-highlight-box"
  | "info-highlight-box";

export type CssModule = Record<SeverityKey, string>;

const LEVEL_PRIORITY: ErrorLevel[] = [
  ErrorLevel.error,
  ErrorLevel.warning,
  ErrorLevel.info,
];

export const ERROR_CLASS_KEYS = {
  [ErrorLevel.error]: {
    highlight: "error-highlight",
    text: "error-text",
    box: "error-highlight-box",
  },
  [ErrorLevel.warning]: {
    highlight: "warning-highlight",
    text: "warning-text",
    box: "warning-highlight-box",
  },
  [ErrorLevel.info]: {
    highlight: "info-highlight",
    text: "info-text",
    box: "info-highlight-box",
  },
} as const;

type SeverityClasses = {
  level: ErrorLevel | null;
  classes: { highlight: string; text: string; box: string };
};
export const getSeverityClassByLevelAndType = (
  level: ErrorLevel,
  variant: ErrorClassVariant,
): string => {
  const keys = ERROR_CLASS_KEYS[level];
  return styles?.[keys[variant]] ?? keys[variant];
};
export function getSeverityLevel(
  errors?: ReadonlyArray<ExtensionError>,
): ErrorLevel | null {
  if (!errors?.length) return null;
  const present = new Set(errors.map((e) => e.errorLevel));
  for (const level of LEVEL_PRIORITY) if (present.has(level)) return level;
  return null;
}

export function getSeverityClassesCore(
  errors?: ReadonlyArray<ExtensionError>,
  styles?: Partial<CssModule>,
): SeverityClasses {
  const level = getSeverityLevel(errors);
  if (!level)
    return { level: null, classes: { highlight: "", text: "", box: "" } };

  const keys = ERROR_CLASS_KEYS[level];
  const highlight = styles?.[keys.highlight] ?? keys.highlight;
  const text = styles?.[keys.text] ?? keys.text;
  const box = styles?.[keys.box] ?? keys.box;
  return { level, classes: { highlight, text, box } };
}

export function getSeverityClassCore(
  variant: ErrorClassVariant,
  errors?: ReadonlyArray<ExtensionError>,
  styles?: Partial<CssModule>,
): string {
  return getSeverityClassesCore(errors, styles).classes[variant];
}
const styles = stylesRaw as unknown as CssModule;

export const getSeverityClass = (
  variant: ErrorClassVariant,
  errors?: ReadonlyArray<ExtensionError>,
): string => getSeverityClassCore(variant, errors, styles);

export const getErrorMessagesAndSeverityClasses = (
  variant: ErrorClassVariant,
  errors?: ReadonlyArray<ValidationError>,
): { message: string; severityClass: string }[] | undefined => {
  if (!errors?.length) return undefined;
  return errors.map((error) => ({
    message: error.errorReadableText,
    severityClass: getSeverityClass(variant, [error]),
  }));
};

export const getValidationErrorByErrorProperty = (
  errorProperty: string,
  validationErrors: ReadonlyArray<ValidationError>,
): ValidationError[] | undefined => {
  return getValidationErrorByKey(
    "errorProperty",
    errorProperty,
    validationErrors,
  )?.filter((error) => error.errorProperty === errorProperty);
};
export const getValidationErrorByKey = (
  errorKey: keyof ValidationError,
  value: ValidationError[keyof ValidationError],
  validationErrors: ReadonlyArray<ValidationError>,
): ValidationError[] | undefined => {
  return (
    validationErrors?.filter((error) => error[errorKey] === value) || undefined
  );
};
export const getSeverityClassByLevelAndTypeIfError = (
  level: ErrorLevel,
  variant: ErrorClassVariant,
  hasError: boolean,
): string => (hasError ? getSeverityClassByLevelAndType(level, variant) : "");
