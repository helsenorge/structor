import React from "react";

import { ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { getValueSetValues } from "../../../helpers/valueSetHelper";
import { updateContainedValueSetTranslationAction } from "../../../store/treeStore/treeActions";
import { ActionType, Languages } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

type TranslateContainedValueSetsProps = {
  qContained?: ValueSet[];
  targetLanguage: string;
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
                  className={!translatedText?.trim() ? "error-highlight" : ""}
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
