import React from "react";

import { useTranslation } from "react-i18next";
import { getTextValidationErrorClassName } from "src/helpers/validationClassHelper";

import {
  ErrorClassVariant,
  getErrorMessagesAndSeverityClasses,
  getSeverityClassByLevelAndType,
} from "./validationHelper";
import { ErrorLevel } from "./validationTypes";
import { Languages } from "../../store/treeStore/treeStore";
import { ValidationError } from "../../utils/validationUtils";
import Modal from "../Modal/Modal";

interface ValidationErrorsModalProps {
  validationErrors: ValidationError[];
  translationErrors: ValidationError[];
  questionnaireDetailsErrors: ValidationError[];
  markdownWarning: ValidationError | undefined;
  qAdditionalLanguages: Languages | undefined;
  onClose: () => void;
}

export const ValidationErrorsModal = (
  props: ValidationErrorsModalProps,
): React.JSX.Element => {
  const { t } = useTranslation();
  const renderTranslateErrorMessages = (): React.JSX.Element[] | undefined => {
    if (props.translationErrors.length > 0) {
      const translationErrors = translationErrorMessages();
      const elements: React.JSX.Element[] = [];
      translationErrors?.map((message) => {
        elements.push(
          <p
            className={getSeverityClassByLevelAndType(
              ErrorLevel.error,
              ErrorClassVariant.text,
            )}
          >
            {message}
          </p>,
        );
      });
      return elements;
    }
  };
  const translationErrorMessages = (): string[] => {
    const messages: string[] = [];
    const languages = [
      ...new Set(props.translationErrors.map((item) => item.languagecode)),
    ];
    languages.forEach((language) => {
      if (language) {
        const count = props.translationErrors.filter(
          (item) => item.languagecode === language,
        ).length;
        const message = t("{0}: Found {1} missing translation(s).")
          .replace("{0}", language)
          .replace("{1}", count.toString());
        messages.push(message);
      }
    });
    return messages;
  };

  const renderQuestionnaireDetailsErrorMessages = ():
    | React.JSX.Element[]
    | undefined => {
    if (props.questionnaireDetailsErrors.length > 0) {
      const elements: React.JSX.Element[] = [];
      getErrorMessagesAndSeverityClasses(
        ErrorClassVariant.text,
        props.questionnaireDetailsErrors,
      )?.forEach((error) => {
        elements.push(<p className={error.severityClass}>{error.message}</p>);
      });
      return elements;
    }
  };
  const renderValidationErrorMessages = (): React.JSX.Element | undefined => {
    if (props.validationErrors.length > 0) {
      const errors = props.validationErrors.filter(
        (x) => x.errorLevel === ErrorLevel.error,
      );
      const warnings = props.validationErrors.filter(
        (x) => x.errorLevel === ErrorLevel.warning,
      );
      return (
        <>
          {errors.length > 0 ? (
            <p
              className={getSeverityClassByLevelAndType(
                ErrorLevel.error,
                ErrorClassVariant.text,
              )}
            >
              {t(
                "Found {0} errors. Questions with errors are marked with a red border.",
              ).replace("{0}", errors.length.toString())}
            </p>
          ) : null}
          {warnings.length > 0 ? (
            <p
              className={getSeverityClassByLevelAndType(
                ErrorLevel.warning,
                ErrorClassVariant.text,
              )}
            >
              {t(
                "Found {0} warnings. Questions with warnings are marked with a yellow border.",
              ).replace("{0}", warnings.length.toString())}
            </p>
          ) : null}
        </>
      );
    }
  };
  const renderWarningMessages = (): React.JSX.Element | undefined => {
    if (props.markdownWarning) {
      return (
        <p
          className={getSeverityClassByLevelAndType(
            ErrorLevel.warning,
            ErrorClassVariant.text,
          )}
        >
          {props.markdownWarning.errorReadableText}
        </p>
      );
    }
  };
  const renderNoValidationErrormessage = (): React.JSX.Element | undefined => {
    if (
      props.validationErrors?.length === 0 &&
      props.translationErrors?.length === 0 &&
      props.questionnaireDetailsErrors?.length === 0
    ) {
      return <p>{t("Found no validation errors!")}</p>;
    }
  };

  return (
    <Modal
      close={props.onClose}
      title={t("Validation")}
      buttonSecondaryText={t("Close")}
    >
      <>{renderValidationErrorMessages()}</>
      <>{renderQuestionnaireDetailsErrorMessages()}</>
      <>{renderTranslateErrorMessages()}</>
      <>{renderNoValidationErrormessage()}</>
      <>{renderWarningMessages()}</>
    </Modal>
  );
};
