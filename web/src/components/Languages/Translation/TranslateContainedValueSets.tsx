import type React from "react";

import { useTranslation } from "react-i18next";
import {
  ErrorClassVariant,
  getSeverityClassByLevelAndTypeIfError,
} from "src/components/Validation/validationHelper";
import { ErrorLevel } from "src/components/Validation/validationTypes";

import type { ActionType, Languages } from "../../../store/treeStore/treeStore";
import type { ValueSet } from "fhir/r4";
import type { ExtendedLanguageLocales } from "src/types/LanguageTypes";

import { getValueSetValues } from "../../../helpers/valueSetHelper";
import { updateContainedValueSetTranslationAction } from "../../../store/treeStore/treeActions";
import FormField from "../../FormField/FormField";

type TranslateContainedValueSetsProps = {
  qContained?: ValueSet[];
  targetLanguage: ExtendedLanguageLocales;
  translations: Languages;
  dispatch: React.Dispatch<ActionType>;
};

const TranslateContainedValueSets = ({
  qContained,
  targetLanguage,
  translations,
  dispatch,
}: TranslateContainedValueSetsProps): React.JSX.Element | null => {
  const { t } = useTranslation();
  const containedTranslations = translations[targetLanguage].contained;

  const renderValueSetOptions = (valueSet: ValueSet): React.JSX.Element => {
    const codings = getValueSetValues(valueSet);
    const { id } = valueSet;
    if (!codings || !id) {
      return <></>;
    }
    return (
      <div>
        {codings.map((coding) => {
          const { code, display } = coding;
          if (!code) {
            return <></>;
          }
          const translatedText = containedTranslations[id]?.concepts[code];
          return (
            <div key={`${targetLanguage}-${code}`} className="translation-row">
              <FormField>
                <textarea defaultValue={display} disabled={true} />
              </FormField>
              <FormField>
                <textarea
                  defaultValue={translatedText}
                  className={getSeverityClassByLevelAndTypeIfError(
                    ErrorLevel.error,
                    ErrorClassVariant.highlight,
                    !translatedText?.trim(),
                  )}
                  onBlur={(event) => {
                    dispatch(
                      updateContainedValueSetTranslationAction(
                        targetLanguage,
                        id,
                        code,
                        event.target.value,
                      ),
                    );
                  }}
                />
              </FormField>
            </div>
          );
        })}
      </div>
    );
  };

  if (!qContained) {
    return null;
  }
  return (
    <div>
      <div className="translation-section-header">
        {t("Predefined valuesets")}
      </div>
      {qContained.map((valueSet: ValueSet) => {
        return (
          <div
            key={`${targetLanguage}-${valueSet.id}`}
            className="translation-group"
          >
            <div className="translation-group-header">{valueSet.title}</div>
            {renderValueSetOptions(valueSet)}
          </div>
        );
      })}
    </div>
  );
};

export default TranslateContainedValueSets;
