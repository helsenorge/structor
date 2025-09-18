import React from "react";

import { useTranslation } from "react-i18next";
import { getTextValidationErrorClassName } from "src/helpers/validationClassHelper";

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
        elements.push(<p className="msg-error">{message}</p>);
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
      props.questionnaireDetailsErrors.forEach((error) => {
        elements.push(
          <p className={getTextValidationErrorClassName(error)}>
            {error.errorReadableText}
          </p>,
        );
      });
      return elements;
    }
  };
  const renderVelidationErrorMessages = (): React.JSX.Element | undefined => {
    if (props.validationErrors.length > 0) {
      return (
        <>
          <p className="msg-error">
            {t(
              "Found {0} errors. Questions with errors are marked with a red border.",
            ).replace(
              "{0}",
              props.validationErrors
                .filter((x) => x.errorLevel === "error")
                .length.toString(),
            )}
          </p>
          <p className="msg-warning">
            {t(
              "Found {0} warnings. Questions with warnings are marked with a yellow border.",
            ).replace(
              "{0}",
              props.validationErrors
                .filter((x) => x.errorLevel === "warning")
                .length.toString(),
            )}
          </p>
        </>
      );
    }
  };
  const renderWarningMessages = (): React.JSX.Element | undefined => {
    if (props.markdownWarning) {
      return (
        <p className="msg-warning">{props.markdownWarning.errorReadableText}</p>
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
      <>{renderVelidationErrorMessages()}</>
      <>{renderQuestionnaireDetailsErrorMessages()}</>
      <>{renderTranslateErrorMessages()}</>
      <>{renderNoValidationErrormessage()}</>
      <>{renderWarningMessages()}</>
    </Modal>
  );
};
