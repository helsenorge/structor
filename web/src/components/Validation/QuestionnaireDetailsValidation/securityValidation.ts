import { Coding } from "fhir/r4";
import { TFunction } from "react-i18next";
import {
  filterMetaSecurity,
  tilgangsstyringsCode,
} from "src/helpers/MetadataHelper";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import { MetaSecuritySystem } from "src/types/IQuestionnareItemType";
import { ValidationError } from "src/utils/validationUtils";

import { createError } from "../validationHelper";
import { ErrorLevel, ValidationType } from "../validationTypes";

const hasSperretAdresse = (kanUtforesAv: Coding[]): boolean => {
  return !!kanUtforesAv.find(
    (f: Coding) => f.code === tilgangsstyringsCode.sperretAdresse,
  );
};

const hasAgeGroup13And16 = (kanUtforesAv: Coding[]): boolean => {
  return !!kanUtforesAv.find(
    (f: Coding) => f.code === tilgangsstyringsCode.innbyggerMellom13Og16,
  );
};

export const metaSecurityValidation = (
  t: TFunction<"translation">,
  qMetadata: IQuestionnaireMetadata,
): ValidationError[] => {
  const securityValidation: ValidationError[] = [];
  const kanUtforesAv = filterMetaSecurity(
    qMetadata,
    MetaSecuritySystem.kanUtforesAv,
  );

  if (kanUtforesAv) {
    if (hasSperretAdresse(kanUtforesAv)) {
      securityValidation.push(
        createError(
          "",
          ValidationType.security,
          t("There is a security code with blocked address access"),
          ErrorLevel.info,
        ),
      );
    }
    if (hasAgeGroup13And16(kanUtforesAv)) {
      securityValidation.push(
        createError(
          "",
          ValidationType.security,
          t(
            "There is a security code with access for citizens with age between 13 - 16",
          ),
          ErrorLevel.info,
        ),
      );
    }
  }

  return securityValidation;
};
