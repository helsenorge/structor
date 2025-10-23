import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { hasExtension } from "src/helpers/extensionHelper";
import { IExtensionType } from "src/types/IQuestionnareItemType";

import { validateMetadataTranslation } from "./translateMetadataValidation";
import { isItemControlSidebar } from "../../../helpers/itemControl";
import {
  getRepeatsText,
  getSublabel,
  getValidationMessage,
  getInitialText,
  getPlaceHolderText,
  isHiddenItem,
} from "../../../helpers/QuestionHelper";
import { getValueSetValues } from "../../../helpers/valueSetHelper";
import {
  Items,
  TreeState,
  Translation,
} from "../../../store/treeStore/treeStore";
import {
  getValueSetToTranslate,
  ValidationError,
} from "../../../utils/validationUtils";
import { createError } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";

const validateItemTranslations = (
  t: TFunction<"translation">,
  languageCode: string,
  qItems: Items,
  translation: Translation,
  errors: ValidationError[],
): void => {
  Object.keys(qItems).forEach((linkId, index) => {
    const qItem = qItems[linkId];
    if (!isHiddenItem(qItem)) {
      if (isItemControlSidebar(qItem)) {
        validateSidebarTranslations(
          t,
          languageCode,
          qItem,
          translation,
          errors,
        );
        return;
      }

      if (translation.items[linkId]) {
        validateItemText(t, languageCode, qItem, index, translation, errors);
        validateItemPrefix(t, languageCode, qItem, index, translation, errors);
        validateItemSublabel(
          t,
          languageCode,
          qItem,
          index,
          translation,
          errors,
        );
        validateItemRepeatText(
          t,
          languageCode,
          qItem,
          index,
          translation,
          errors,
        );
        validateItemValidationText(
          t,
          languageCode,
          qItem,
          index,
          translation,
          errors,
        );
        validateItemEntryFormatText(
          t,
          languageCode,
          qItem,
          index,
          translation,
          errors,
        );
        validateItemInitialText(
          t,
          languageCode,
          qItem,
          index,
          translation,
          errors,
        );
        validateItemAnswerOptions(
          t,
          languageCode,
          qItem,
          index,
          translation,
          errors,
        );
      } else {
        addErrorForItemElement(t, languageCode, linkId, index, "text", errors);
      }
    }
  });
};

const validateItemText = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (!translation.items[qItem.linkId].text) {
    addErrorForItemElement(
      t,
      languageCode,
      qItem.linkId,
      index,
      "text",
      errors,
    );
  }
};

const validateItemPrefix = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (qItem.prefix && !translation.items[qItem.linkId].prefix) {
    addErrorForItemElement(
      t,
      languageCode,
      qItem.linkId,
      index,
      "prefix",
      errors,
    );
  }
};

const validateItemRepeatText = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (getRepeatsText(qItem) && !translation.items[qItem.linkId].repeatsText) {
    addErrorForItemElement(
      t,
      languageCode,
      qItem.linkId,
      index,
      "repeatsText",
      errors,
    );
  }
};

const validateItemEntryFormatText = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (
    getPlaceHolderText(qItem) &&
    !translation.items[qItem.linkId].entryFormatText
  ) {
    addErrorForItemElement(
      t,
      languageCode,
      qItem.linkId,
      index,
      "entryFormatText",
      errors,
    );
  }
};

const validateItemInitialText = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (getInitialText(qItem) && !translation.items[qItem.linkId].initial) {
    addErrorForItemElement(
      t,
      languageCode,
      qItem.linkId,
      index,
      "initial",
      errors,
    );
  }
};

const validateItemAnswerOptions = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (qItem.answerOption) {
    validateAnsweroptions(t, languageCode, qItem, translation, index, errors);
  }
};

const validateItemValidationText = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (
    getValidationMessage(qItem) &&
    !translation.items[qItem.linkId].validationText
  ) {
    addErrorForItemElement(
      t,
      languageCode,
      qItem.linkId,
      index,
      "validationText",
      errors,
    );
  }
};

const validateItemSublabel = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  index: number,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (getSublabel(qItem) && !translation.items[qItem.linkId].sublabel) {
    addErrorForItemElement(
      t,
      languageCode,
      qItem.linkId,
      index,
      "sublabel",
      errors,
    );
  }
};

const validateAnsweroptions = (
  t: TFunction<"translation">,
  languageCode: string,
  qItem: QuestionnaireItem,
  translation: Translation,
  itemIndex: number,
  errors: ValidationError[],
): void => {
  const extension = hasExtension(qItem, IExtensionType.copyExpression);
  if (extension) {
    return;
  }
  qItem.answerOption?.forEach((f) => {
    const valueCode = f.valueCoding?.code ?? "";
    if (!translation.items[qItem.linkId].answerOptions?.[valueCode]) {
      errors.push(
        createError(
          qItem.linkId,
          "items.answerOptions",
          t(
            `${languageCode}: Translation not found for form item answerOptions ${valueCode}`,
          ),
          ErrorLevel.error,
          itemIndex,
          languageCode,
        ),
      );
    }
  });
};

const addErrorForItemElement = (
  t: TFunction<"translation">,
  languageCode: string,
  linkId: string,
  itemIndex: number,
  element: string,
  errors: ValidationError[],
): void => {
  errors.push(
    createError(
      linkId,
      `items.${element}`,
      t(`${languageCode}: Translation not found for form ${element}`),
      ErrorLevel.error,
      itemIndex,
      languageCode,
    ),
  );
};

const validateSidebarTranslations = (
  t: TFunction<"translation">,
  languageCode: string,
  item: QuestionnaireItem,
  translation: Translation,
  errors: ValidationError[],
): void => {
  if (
    !translation.sidebarItems[item.linkId] ||
    !translation.sidebarItems[item.linkId].markdown
  ) {
    errors.push(
      createError(
        item.linkId,
        "sidebarItems.markdown",
        t(`${languageCode}: Translation not found for SOT`),
        ErrorLevel.error,
        undefined,
        languageCode,
      ),
    );
  }
};

const validateValueSetTranslations = (
  t: TFunction<"translation">,
  languageCode: string,
  state: TreeState,
  translation: Translation,
  errors: ValidationError[],
): void => {
  const valuesets = getValueSetToTranslate(state);
  valuesets?.forEach((valueset) => {
    const valuesetId = valueset.id ?? "";
    if (!translation.contained || !translation.contained[valuesetId]) {
      errors.push(
        createError(
          "",
          `contained.${valuesetId}`,
          t(
            `${languageCode}: Translation not found for Valueset ${valuesetId}`,
          ),
          ErrorLevel.error,
          undefined,
          languageCode,
        ),
      );
    } else {
      const values = getValueSetValues(valueset);
      values.forEach((value) => {
        if (!translation.contained[valuesetId].concepts[value.code ?? ""]) {
          errors.push(
            createError(
              "",
              `contained.${valuesetId}`,
              t(
                `${languageCode}: Translation not found for Valueset code ${value.code}`,
              ),
              ErrorLevel.error,
              undefined,
              languageCode,
            ),
          );
        }
      });
    }
  });
};

export const validateTranslations = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  const translationErrors: ValidationError[] = [];
  if (state.qAdditionalLanguages) {
    const translations = state.qAdditionalLanguages ?? {};
    Object.keys(translations).forEach((languageCode) => {
      validateMetadataTranslation(
        t,
        languageCode,
        translations[languageCode],
        translationErrors,
      );
      validateItemTranslations(
        t,
        languageCode,
        state.qItems,
        translations[languageCode],
        translationErrors,
      );
      validateValueSetTranslations(
        t,
        languageCode,
        state,
        translations[languageCode],
        translationErrors,
      );
    });
  }
  return translationErrors;
};

export const warnMarkdownInTranslations = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError | undefined => {
  const translations = state.qAdditionalLanguages ?? {};
  const itemsWithMarkdown = Object.values(state.qItems).filter(
    (item) => !isHiddenItem(item) && item._text,
  );
  return Object.keys(translations).length > 0 && itemsWithMarkdown.length > 0
    ? ({
        errorReadableText: t(
          "There are elements marked in translation that need attention.",
        ),
      } as ValidationError)
    : undefined;
};
