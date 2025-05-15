import { TFunction } from "react-i18next";
import { isValidTitle } from "src/helpers/MetadataHelper";
import { Translation } from "src/store/treeStore/treeStore";
import { TranslatableMetadataProperty } from "src/types/LanguageTypes";
import { ValidationError } from "src/utils/validationUtils";

import { createError, ValidateUrl } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";

export const validateMetadataTranslation = (
  t: TFunction<"translation">,
  languageCode: string,
  translation: Translation,
  errors: ValidationError[],
): void => {
  const titleValidationError = validateTitle(t, translation, languageCode);
  if (titleValidationError) {
    errors.push(titleValidationError);
  }

  const validationError = ValidateUrl(
    translation.metaData.url,
    translation.metaData.id,
    t,
  );
  if (validationError) {
    validationError.languagecode = languageCode;
    errors.push(validationError);
  }
};

const validateTitle = (
  t: TFunction<"translation">,
  translation: Translation,
  languageCode: string,
): ValidationError | undefined => {
  if (!translation.metaData.title) {
    return createError(
      "",
      TranslatableMetadataProperty.title,
      t(`Translation not found for title`),
      ErrorLevel.error,
      undefined,
      languageCode,
    );
  }

  if (
    !!translation.metaData.title &&
    !isValidTitle(translation.metaData.title.trim())
  ) {
    return createError(
      "",
      TranslatableMetadataProperty.title,
      t("Title cannot have any special characters []{}/\\<>`´;:|\"'$£#@%*¤"),
      ErrorLevel.error,
    );
  }
};
