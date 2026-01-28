import React, { useContext, useState } from "react";

import { useTranslation } from "react-i18next";
import {
  ErrorClassVariant,
  getSeverityClassByLevelAndTypeIfError,
} from "src/components/Validation/validationHelper";
import { ErrorLevel } from "src/components/Validation/validationTypes";

import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";
import { TranslatableItemProperty } from "../../../types/LanguageTypes";
import type {
  Coding,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
} from "fhir/r4";

import { systemCodesToTranslate } from "./systemCodesToTranslate";
import TranslateOptionRow from "./TranslateOptionRow";
import {
  getItemCodeDisplayTranslation,
  getItemPropertyTranslation,
} from "../../../helpers/LanguageHelper";
import {
  getInitialText,
  getPlaceHolderText,
  getPrefix,
  getRepeatsText,
  getSublabel,
  getTextExtensionMarkdown,
  getValidationMessage,
  getItemCodes,
} from "../../../helpers/QuestionHelper";
import {
  updateItemOptionTranslationAction,
  updateItemTranslationAction,
  updateItemCodeTranslation,
  updateItemExtensionTranslation,
} from "../../../store/treeStore/treeActions";
import {
  type ItemTranslation,
  TreeContext,
} from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import MarkdownEditor from "../../MarkdownEditor/MarkdownEditor";

type TranslationRowProps = {
  targetLanguage: string;
  item: QuestionnaireItem;
  itemHeading: string;
};

const TranslateItemRow = ({
  targetLanguage,
  item,
  itemHeading,
}: TranslationRowProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);

  const qAdditionalLanguages = state.qAdditionalLanguages || {};
  const itemTranslation: ItemTranslation = qAdditionalLanguages
    ? qAdditionalLanguages[targetLanguage].items[item.linkId] || {}
    : {};
  const [translatedText, setTranslatedText] = useState(
    itemTranslation.text || "",
  );
  const isMarkdown: boolean = item._text ? true : false;

  function dispatchUpdateItemTranslation(
    text: string,
    propertyName: Exclude<TranslatableItemProperty, "code" | "extension">,
  ): void {
    dispatch(
      updateItemTranslationAction(
        targetLanguage,
        item.linkId,
        propertyName,
        text,
      ),
    );
  }
  function setExtensionValue(index: number, value: string | undefined): void {
    const extensions = item.extension ? [...item.extension] : [];
    const extension = extensions[index];
    if (extension) {
      const updatedExtension = { ...extension };
      if (typeof value === "string") {
        updatedExtension.valueString = value;
      } else {
        updatedExtension.valueString = undefined;
      }
      extensions[index] = updatedExtension;
      dispatch(
        updateItemExtensionTranslation({
          languageCode: targetLanguage,
          linkId: item.linkId,
          extension: extensions,
        }),
      );
    }
  }
  function dispatchUpdateItemCodeTranslation(
    newDisplayText: string,
    code: Coding,
  ): void {
    dispatch(
      updateItemCodeTranslation(
        targetLanguage,
        item.linkId,
        newDisplayText,
        code,
      ),
    );
  }
  function dispatchUpdateOptionTranslation(
    text: string,
    optionCode?: string,
  ): void {
    if (optionCode) {
      dispatch(
        updateItemOptionTranslationAction(
          targetLanguage,
          item.linkId,
          text,
          optionCode,
        ),
      );
    }
  }
  function getReadOnlyFhirPathExtensions(): React.JSX.Element {
    const fhirPathExtensions =
      item.extension
        ?.map((ext, idx) => ({ ext, originalIndex: idx }))
        ?.filter((pair) => pair.ext.url === IExtensionType.fhirPath) ?? [];

    const extensions = fhirPathExtensions.map(({ ext, originalIndex }) => (
      <textarea key={`${ext.url}-${originalIndex}-readonly`} disabled={true}>
        {ext.valueString}
      </textarea>
    ));
    return <>{extensions}</>;
  }
  function getFhirPathExtensions(): React.JSX.Element {
    const fhirPathExtensions =
      item.extension
        ?.map((ext, idx) => ({ ext, originalIndex: idx }))
        ?.filter((pair) => pair.ext.url === IExtensionType.fhirPath) ?? [];

    const extensions = fhirPathExtensions.map(({ ext, originalIndex }) => (
      <textarea
        key={`${ext.url}-${originalIndex}`}
        onBlur={(event) => setExtensionValue(originalIndex, event.target.value)}
      >
        {itemTranslation.extension?.[originalIndex]?.valueString
          ? itemTranslation.extension?.[originalIndex]?.valueString
          : ext?.valueString}
      </textarea>
    ));
    return <>{extensions}</>;
  }

  function getInputField(): React.JSX.Element {
    if (isMarkdown) {
      return (
        <div
          className={getSeverityClassByLevelAndTypeIfError(
            ErrorLevel.error,
            ErrorClassVariant.highlight,
            !itemTranslation.text?.trim(),
          )}
        >
          <MarkdownEditor
            data={translatedText}
            onBlur={(text) =>
              dispatchUpdateItemTranslation(text, TranslatableItemProperty.text)
            }
          />
        </div>
      );
    }
    return (
      <textarea
        value={translatedText}
        className={getSeverityClassByLevelAndTypeIfError(
          ErrorLevel.error,
          ErrorClassVariant.highlight,
          !itemTranslation.text?.trim(),
        )}
        onChange={(e) => setTranslatedText(e.target.value)}
        onBlur={(e) =>
          dispatchUpdateItemTranslation(
            e.target.value,
            TranslatableItemProperty.text,
          )
        }
      />
    );
  }

  function getReadOnlyInputField(input: string | undefined): React.JSX.Element {
    if (isMarkdown) {
      return <MarkdownEditor data={input || item.text || ""} disabled={true} />;
    }
    return <textarea defaultValue={input || ""} disabled={true} />;
  }

  function getOptionRow(
    option: QuestionnaireItemAnswerOption,
  ): React.JSX.Element | null {
    if (option.valueCoding?.code) {
      const translation = itemTranslation.answerOptions
        ? itemTranslation.answerOptions[option.valueCoding.code] || ""
        : "";
      return (
        <TranslateOptionRow
          key={`${targetLanguage}-${item.linkId}-${option.valueCoding.code}`}
          option={option}
          translation={translation}
          onBlur={(text: string) =>
            dispatchUpdateOptionTranslation(text, option.valueCoding?.code)
          }
        />
      );
    }
    return null;
  }

  function getTranslatableField(
    header: string,
    textValue: string,
    propertyName: Exclude<TranslatableItemProperty, "code" | "extension">,
    isMarkdownField: boolean,
  ): React.JSX.Element {
    const itemPropertyTranslation = getItemPropertyTranslation(
      targetLanguage,
      qAdditionalLanguages,
      item.linkId,
      propertyName,
    );
    const handleOnBlurText = (
      event: React.FocusEvent<HTMLTextAreaElement, Element>,
    ): void => {
      dispatchUpdateItemTranslation(event.target.value, propertyName);
    };
    const handleOnBlurMarkdown = (newValue: string): void => {
      dispatchUpdateItemTranslation(newValue, propertyName);
    };
    return (
      <>
        <div className="translation-group-header">{header}</div>
        <div className="translation-row">
          <FormField>
            {isMarkdownField ? (
              <MarkdownEditor data={textValue} disabled={true} />
            ) : (
              <textarea defaultValue={textValue} disabled={true} />
            )}
          </FormField>
          <FormField>
            {isMarkdownField ? (
              <div
                className={`${getSeverityClassByLevelAndTypeIfError(
                  ErrorLevel.error,
                  ErrorClassVariant.highlight,
                  !itemPropertyTranslation?.trim(),
                )}`}
              >
                <MarkdownEditor
                  data={itemPropertyTranslation}
                  onBlur={handleOnBlurMarkdown}
                />
              </div>
            ) : (
              <textarea
                className={getSeverityClassByLevelAndTypeIfError(
                  ErrorLevel.error,
                  ErrorClassVariant.highlight,
                  !itemPropertyTranslation?.trim(),
                )}
                defaultValue={itemPropertyTranslation}
                onBlur={handleOnBlurText}
              />
            )}
          </FormField>
        </div>
      </>
    );
  }
  function getTranslatableCodeField(
    header: string,
    code: Coding,
  ): React.JSX.Element {
    const itemPropertyTranslation = getItemCodeDisplayTranslation(
      targetLanguage,
      qAdditionalLanguages,
      item.linkId,
      code,
    );

    const handleOnBlurText = (
      event: React.FocusEvent<HTMLTextAreaElement, Element>,
    ): void => {
      dispatchUpdateItemCodeTranslation(event.target.value, code);
    };
    return (
      <React.Fragment key={`${code.system}-${code.code}`}>
        <div className="translation-group-header">{`System: ${header}`}</div>
        <div className="translation-group-header">{`Code: ${code.code}`}</div>
        <div className="translation-row">
          <FormField>
            <textarea defaultValue={code.display} disabled={true} />
          </FormField>
          <FormField>
            <textarea
              className={getSeverityClassByLevelAndTypeIfError(
                ErrorLevel.error,
                ErrorClassVariant.highlight,
                !itemPropertyTranslation?.trim(),
              )}
              defaultValue={itemPropertyTranslation}
              onBlur={handleOnBlurText}
            />
          </FormField>
        </div>
      </React.Fragment>
    );
  }
  const itemCodes = getItemCodes(item);
  const fhirPath = item.extension?.find(
    (x) => x.url === IExtensionType.fhirPath,
  );

  return (
    <>
      <div className="translation-group-header">{itemHeading}</div>
      <div className="translation-row">
        <FormField>
          {getReadOnlyInputField(
            isMarkdown ? getTextExtensionMarkdown(item) : item.text,
          )}
        </FormField>
        <FormField>{getInputField()}</FormField>
      </div>

      {getSublabel(item) &&
        getTranslatableField(
          t("Sublabel"),
          getSublabel(item),
          TranslatableItemProperty.sublabel,
          true,
        )}
      {getRepeatsText(item) &&
        getTranslatableField(
          t("Repeat button text"),
          getRepeatsText(item),
          TranslatableItemProperty.repeatsText,
          false,
        )}
      {getValidationMessage(item) &&
        getTranslatableField(
          t("Error message for validation error"),
          getValidationMessage(item),
          TranslatableItemProperty.validationText,
          false,
        )}
      {getPlaceHolderText(item) &&
        getTranslatableField(
          t("Placeholder text"),
          getPlaceHolderText(item),
          TranslatableItemProperty.entryFormatText,
          false,
        )}
      {getPrefix(item) &&
        getTranslatableField(
          t("Prefix"),
          getPrefix(item),
          TranslatableItemProperty.prefix,
          false,
        )}
      {(item.type === IQuestionnaireItemType.text ||
        item.type === IQuestionnaireItemType.string) &&
        getInitialText(item) &&
        getTranslatableField(
          t("Initial value"),
          getInitialText(item),
          TranslatableItemProperty.initial,
          false,
        )}

      {item.answerOption &&
        item.answerOption.map((option) => {
          return getOptionRow(option);
        })}
      {itemCodes
        ?.filter((code: Coding) =>
          systemCodesToTranslate.includes(code.system || ""),
        )
        ?.map((code) =>
          getTranslatableCodeField(code.system || "system", code),
        )}
      {fhirPath?.valueString && (
        <div className="translation-group-header">
          <span>{"FhirPath"}</span>
          <div className="translation-row">
            <FormField>{getReadOnlyFhirPathExtensions()}</FormField>
            <FormField>{getFhirPathExtensions()}</FormField>
          </div>
        </div>
      )}
    </>
  );
};

export default TranslateItemRow;
