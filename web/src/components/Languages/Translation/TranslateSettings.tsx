import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionType, Languages } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import { Extension } from '../../../types/fhir';
import { translatableSettings } from '../../../helpers/LanguageHelper';
import { updateSettingTranslationAction } from '../../../store/treeStore/treeActions';

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
}: TranslateSettingsProps): JSX.Element | null => {
    const { t } = useTranslation();

    const translatedSettings = translations[targetLanguage].settings;
    const getTranslation = (extension: IExtentionType) => {
        return translatedSettings[extension];
    };

    const dispatchTranslation = (extension: IExtentionType, value: Extension | null) => {
        dispatch(updateSettingTranslationAction(targetLanguage, extension, value));
    };

    return (
        <div>
            <div className="translation-section-header">{t('Questionnaire settings')}</div>
            {Object.values(translatableSettings).map((extensionToTranslate) => {
                if (!extensionToTranslate) return;

                const mainExtension = (extensions || []).find((e) => e.url === extensionToTranslate.extension);
                let baseValue;
                if (mainExtension) {
                    baseValue = extensionToTranslate.getValue(mainExtension);
                }

                const translatedExtension = getTranslation(extensionToTranslate.extension);
                let translatedValue;
                if (translatedExtension) {
                    translatedValue = extensionToTranslate.getValue(translatedExtension);
                }

                return (
                    <div key={`${targetLanguage}-${extensionToTranslate}`} className="translation-group">
                        <div className="translation-group-header">{t(extensionToTranslate.label)}</div>
                        <div className="translation-row">
                            <FormField>
                                <textarea defaultValue={baseValue} disabled={true} />
                            </FormField>
                            <FormField>
                                <textarea
                                    defaultValue={translatedValue}
                                    onBlur={(event) => {
                                        const extension = extensionToTranslate.generate(event.target.value);
                                        dispatchTranslation(
                                            extensionToTranslate.extension,
                                            event.target.value ? extension : null,
                                        );
                                    }}
                                    placeholder={t('Enter translation..')}
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
