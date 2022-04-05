import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languageToIsoString, translateQuestionnaire } from '../../helpers/FhirToTreeStateMapper';
import { generateMainQuestionnaire, getUsedValueSet } from '../../helpers/generateQuestionnaire';
import { supportedLanguages, getLanguageFromCode, getLanguagesInUse } from '../../helpers/LanguageHelper';
import {
    addQuestionnaireLanguageAction,
    removeQuestionnaireLanguageAction,
    updateQuestionnaireMetadataAction,
} from '../../store/treeStore/treeActions';
import { Translation, TreeContext } from '../../store/treeStore/treeStore';
import { Meta, Questionnaire } from '../../types/fhir';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import Accordion from '../Accordion/Accordion';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import Select from '../Select/Select';
import { exportTranslations } from '../../helpers/exportTranslations';

interface LanguageAccordionProps {
    setTranslateLang: (language: string) => void;
}

const LanguageAccordion = (props: LanguageAccordionProps): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const { qItems, qMetadata, qContained, qAdditionalLanguages } = state;
    const uploadRef = React.useRef<HTMLInputElement>(null);

    const [selectedLang, setSelectedLang] = useState('');
    const [fileUploadError, setFileUploadError] = useState<string>('');

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string | Meta) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    function buildTranslationBase(): Translation {
        return { items: {}, sidebarItems: {}, metaData: {}, contained: {}, settings: {} };
    }

    const dispatchAddLanguage = (selectedLanguage: string, translation: Translation) => {
        const isoLanguage = languageToIsoString(selectedLanguage);
        if (isoLanguage && qAdditionalLanguages !== undefined && !qAdditionalLanguages[isoLanguage]) {
            dispatch(addQuestionnaireLanguageAction(isoLanguage, translation));
        }
    };

    const removeAdditionalLanguage = (language: string) => {
        const isoLanguage = languageToIsoString(language);
        if (qAdditionalLanguages !== undefined && qAdditionalLanguages[isoLanguage]) {
            dispatch(removeQuestionnaireLanguageAction(isoLanguage));
        }
    };

    const validateUploadedLanguageFile = (
        translatedQuestionnaire: Questionnaire,
        mainQuestionnaire: Questionnaire,
    ): string => {
        const isoLanguage = translatedQuestionnaire.language
            ? languageToIsoString(translatedQuestionnaire.language)
            : '';

        // validate that this file is a questionnaire:
        if (translatedQuestionnaire.resourceType !== 'Questionnaire') {
            return 'Uploaded file is not a questionnaire';
        }
        // validate that name is the same as the main questionnaire:
        else if (translatedQuestionnaire.name && mainQuestionnaire.name !== translatedQuestionnaire.name) {
            return 'Technical name of uploaded questionnaire is not equal to questionnaire technical name';
        }
        // validate that a questionnaire with this language does not already exist
        else if (
            (qAdditionalLanguages && qAdditionalLanguages[isoLanguage]) ||
            mainQuestionnaire.language === isoLanguage
        ) {
            return 'Questionnaire with the same language as uploaded questionnaire already exists';
        }
        return '';
    };

    const onLoadUploadedFile = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
            try {
                const translatedQuestionnaire = JSON.parse(event.target.result as string);
                const mainQuestionnaire = generateMainQuestionnaire(state);
                const isoLanguage = translatedQuestionnaire.language
                    ? languageToIsoString(translatedQuestionnaire.language)
                    : '';

                const error = validateUploadedLanguageFile(translatedQuestionnaire, mainQuestionnaire);
                if (error) {
                    setFileUploadError(error);
                } else {
                    const translation = translateQuestionnaire(mainQuestionnaire, translatedQuestionnaire);
                    dispatchAddLanguage(isoLanguage || '', translation);
                }
            } catch {
                setFileUploadError('Could not read uploaded file');
            }

            // Reset file input
            if (uploadRef.current) {
                uploadRef.current.value = '';
            }
        }
    };

    const uploadLangaugeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = onLoadUploadedFile;
        reader.onerror = () => {
            setFileUploadError('Could not read uploaded file');
        };
        if (event.target.files && event.target.files[0]) {
            reader.readAsText(event.target.files[0]);
            setFileUploadError('');
        }
    };

    const languageInUse = getLanguagesInUse(state).map((x) => x.code);
    const additionalLanguagesInUse = languageInUse.filter((x) => x.toLowerCase() !== qMetadata.language?.toLowerCase());

    const getUnusedLanguage = supportedLanguages
        .filter((language) => language.code !== qMetadata.language)
        .filter((language) => !languageInUse.includes(language.code))
        .map((x) => {
            return { code: x.code, display: x.display };
        });

    return (
        <>
            <Accordion title={t('Translations')}>
                <FormField label={t('Main language')}>
                    <Select
                        value={qMetadata.language || ''}
                        options={supportedLanguages}
                        onChange={(e) => {
                            const display = supportedLanguages.find((x) => x.code === e.target.value)?.localDisplay;
                            const newMeta = {
                                ...qMetadata.meta,
                                tag: qMetadata.meta?.tag?.map((x) =>
                                    x.system === 'urn:ietf:bcp:47'
                                        ? {
                                              system: 'urn:ietf:bcp:47',
                                              code: e.target.value,
                                              display: display,
                                          }
                                        : x,
                                ),
                            };
                            updateMeta(IQuestionnaireMetadataType.language, e.target.value);
                            updateMeta(IQuestionnaireMetadataType.meta, newMeta);
                        }}
                    ></Select>
                </FormField>
                {getUnusedLanguage.length > 0 && (
                    <div className="horizontal equal">
                        <FormField label={t('Add support for additional language')}>
                            <Select
                                placeholder={t('Select a language..')}
                                options={getUnusedLanguage}
                                value={selectedLang}
                                onChange={(event) => setSelectedLang(event.target.value)}
                            />
                        </FormField>
                        <div>
                            <Btn
                                title={t('+ Add new language')}
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    dispatchAddLanguage(selectedLang, buildTranslationBase());
                                    setSelectedLang('');
                                }}
                            />
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    ref={uploadRef}
                    onChange={uploadLangaugeFile}
                    accept="application/JSON"
                    style={{ display: 'none' }}
                />
                <div className="horizontal equal">
                    <div>
                        <Btn
                            title={t('Upload questionnaire in additional language')}
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                uploadRef.current?.click();
                            }}
                        />
                    </div>
                    <div>
                        <Btn
                            title={t('Export translations')}
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                const usedValueSet = getUsedValueSet(state);
                                const valueSetsToTranslate = qContained?.filter(
                                    (x) => x.id && usedValueSet?.includes(x.id) && x,
                                );
                                exportTranslations(
                                    qMetadata,
                                    qItems,
                                    valueSetsToTranslate || [],
                                    additionalLanguagesInUse,
                                    qAdditionalLanguages,
                                );
                            }}
                        />
                    </div>
                </div>
                {fileUploadError && (
                    <ul className="item-validation-error-summary">
                        <li>{t(fileUploadError)}</li>
                    </ul>
                )}
                {additionalLanguagesInUse.length > 0 && (
                    <div>
                        <p>{t('Additional languages')}</p>
                        {additionalLanguagesInUse.map((language, index) => (
                            <div key={index} className="enablewhen-box align-everything">
                                <div>{getLanguageFromCode(language)?.display} </div>
                                <div className="pull-right btn-group">
                                    <Btn
                                        title={t('Delete')}
                                        type="button"
                                        variant="secondary"
                                        onClick={() => removeAdditionalLanguage(language)}
                                    />
                                    <Btn
                                        title={t('Translate')}
                                        type="button"
                                        variant="primary"
                                        onClick={() => {
                                            props.setTranslateLang(language);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Accordion>
        </>
    );
};

export default LanguageAccordion;
