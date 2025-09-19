import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { getValidationError } from "src/components/Validation/validationHelper";
import {
  getTextValidationErrorClassName,
  getValidationClassName,
} from "src/helpers/validationClassHelper";
import { ValidationError } from "src/utils/validationUtils";

import {
  MetadataProperty,
  TranslatableMetadataProperty,
} from "../../../types/LanguageTypes";

import { updateMetadataTranslationAction } from "../../../store/treeStore/treeActions";
import { ActionType, TreeState } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import MarkdownEditor from "../../MarkdownEditor/MarkdownEditor";

type TranslateMetaDataRowProps = {
  dispatch: React.Dispatch<ActionType>;
  metadataProperty: MetadataProperty;
  state: TreeState;
  targetLanguage: string;
  validationErrors: ValidationError[];
};

const TranslateMetaDataRow = ({
  dispatch,
  metadataProperty,
  state,
  targetLanguage,
  validationErrors,
}: TranslateMetaDataRowProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { propertyName, label, markdown, validate } = metadataProperty;
  const baseValue = state.qMetadata[propertyName];
  const translatedMetadata =
    state.qAdditionalLanguages && state.qAdditionalLanguages[targetLanguage]
      ? state.qAdditionalLanguages[targetLanguage]?.metaData
      : {};
  const [translatedValue, setTranslatedValue] = useState(
    translatedMetadata[propertyName],
  );
  const validationMessage = validate
    ? t(validate(translatedValue, state, targetLanguage))
    : "";

  const dispatchPropertyUpdate = (text: string): void => {
    if (!validationMessage) {
      dispatch(
        updateMetadataTranslationAction(targetLanguage, propertyName, text),
      );
    }
  };

  const renderBaseValue = (): JSX.Element => (
    <>
      {markdown && <MarkdownEditor data={baseValue || ""} disabled={true} />}
      {!markdown && <textarea defaultValue={baseValue} disabled={true} />}
    </>
  );

  const validationError = getValidationError(propertyName, validationErrors);

  const getClassName = (): string | undefined => {
    if (propertyName === TranslatableMetadataProperty.title) {
      if (!translatedValue?.trim()) {
        return "error-highlight";
      }
    }
    if (
      propertyName === TranslatableMetadataProperty.url &&
      !!validationError
    ) {
      return getValidationClassName(validationError);
    }
  };

  const renderTranslation = (): JSX.Element => (
    <>
      {markdown ? (
        <div className={getClassName()}>
          <MarkdownEditor
            data={translatedValue}
            onBlur={(value) => {
              dispatchPropertyUpdate(value);
            }}
            placeholder={t("Enter translation..")}
          />
          {validationError?.errorReadableText && (
            <div
              className={getTextValidationErrorClassName(validationError)}
              aria-live="polite"
            >
              {validationError.errorReadableText}
            </div>
          )}
        </div>
      ) : (
        <>
          <textarea
            defaultValue={translatedValue}
            onBlur={(event) => {
              dispatchPropertyUpdate(event.target.value);
            }}
            className={getClassName()}
            onChange={(event) => {
              setTranslatedValue(event.target.value);
            }}
            placeholder={t("Enter translation..")}
          />
          {validationError?.errorReadableText && (
            <div
              className={getTextValidationErrorClassName(validationError)}
              aria-live="polite"
            >
              {validationError.errorReadableText}
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div key={`${targetLanguage}-${propertyName}`}>
      <div className="translation-group-header">{t(label)}</div>
      <div className="translation-row">
        <FormField>{renderBaseValue()}</FormField>
        <FormField>
          {renderTranslation()}
          {validationMessage && (
            <div className="msg-error" aria-live="polite">
              {validationMessage}
            </div>
          )}
        </FormField>
      </div>
    </div>
  );
};

export default TranslateMetaDataRow;
