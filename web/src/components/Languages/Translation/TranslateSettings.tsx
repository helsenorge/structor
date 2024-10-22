import React from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import { translatableSettings } from "../../../helpers/LanguageHelper";
import { updateSettingTranslationAction } from "../../../store/treeStore/treeActions";
import { ActionType, Languages } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

type TranslateSettingsProps = {
  targetLanguage: string;
  translations: Languages;
  extensions: Extension[] | undefined;
  dispatch: React.Dispatch<ActionType>;
};

const TranslateSettings = ({
  targetLanguage,
  translations,
  extensions,
  dispatch,
}: TranslateSettingsProps): React.JSX.Element | null => {
  const { t } = useTranslation();

  const translatedSettings = translations[targetLanguage].settings;
  const getTranslation = (extension: IExtensionType): Extension => {
    return translatedSettings[extension];
  };

  const dispatchTranslation = (
    extension: IExtensionType,
    value: Extension | null,
  ): void => {
    dispatch(updateSettingTranslationAction(targetLanguage, extension, value));
  };

  return (
    <div>
      <div className="translation-section-header">
        {t("Questionnaire settings")}
      </div>
      {Object.values(translatableSettings).map((extensionToTranslate) => {
        if (!extensionToTranslate) return;

        const mainExtension = (extensions || []).find(
          (e) => e.url === extensionToTranslate.extension,
        );
        let baseValue;
        if (mainExtension) {
          baseValue = extensionToTranslate.getValue(mainExtension);
        }

        const translatedExtension = getTranslation(
          extensionToTranslate.extension,
        );
        let translatedValue;
        if (translatedExtension) {
          translatedValue = extensionToTranslate.getValue(translatedExtension);
        }

        return (
          <div
            key={`${targetLanguage}-${extensionToTranslate}`}
            className="translation-group"
          >
            <div className="translation-group-header">
              {t(extensionToTranslate.label)}
            </div>
            <div className="translation-row">
              <FormField>
                <textarea defaultValue={baseValue} disabled={true} />
              </FormField>
              <FormField>
                <textarea
                  defaultValue={translatedValue}
                  onBlur={(event) => {
                    const extension = extensionToTranslate.generate(
                      event.target.value,
                    );
                    dispatchTranslation(
                      extensionToTranslate.extension,
                      event.target.value ? extension : null,
                    );
                  }}
                  placeholder={t("Enter translation..")}
                />
              </FormField>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TranslateSettings;
