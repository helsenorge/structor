import { TFunction } from "react-i18next";
import { isValidTitle } from "src/helpers/MetadataHelper";
import { TreeState } from "src/store/treeStore/treeStore";
import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "src/types/IQuestionnaireMetadataType";
import { ValidationError } from "src/utils/validationUtils";

import { createError, ValidateUrl } from "../validationHelper";
import { ErrorLevel } from "../validationTypes";

export const validateMetadata = (
  t: TFunction<"translation">,
  state: TreeState,
): ValidationError[] => {
  return validate(t, state.qMetadata);
};

const validate = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  errors.push(...validateTitle(t, qMetadata));
  errors.push(...validateTechnicalName(t, qMetadata));
  errors.push(...validateUrl(t, qMetadata));

  return errors;
};

const validateTitle = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (!qMetadata.title?.trim()) {
    returnErrors.push(
      createError(
        "",
        IQuestionnaireMetadataType.title,
        t("Form does not have a title"),
        ErrorLevel.error,
      ),
    );
  }
  if (!!qMetadata.title && !isValidTitle(qMetadata.title.trim())) {
    returnErrors.push(
      createError(
        "",
        IQuestionnaireMetadataType.title,
        t("Title cannot have any special characters []{}/\\<>`´;:|\"'$£#@%*¤"),
        ErrorLevel.error,
      ),
    );
  }
  return returnErrors;
};

const validateTechnicalName = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];
  if (!qMetadata.name?.trim()) {
    returnErrors.push(
      createError(
        "",
        IQuestionnaireMetadataType.name,
        t("Form does not have a technical name"),
        ErrorLevel.error,
      ),
    );
  }
  return returnErrors;
};

const validateUrl = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const returnErrors: ValidationError[] = [];

  const validation = ValidateUrl(qMetadata.url, qMetadata.id, t);
  if (validation) {
    returnErrors.push(validation);
  }

  return returnErrors;
};
