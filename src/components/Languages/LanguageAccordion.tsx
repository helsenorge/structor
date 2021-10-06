import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languageToIsoString, translateQuestionnaire } from '../../helpers/FhirToTreeStateMapper';
import { generateMainQuestionnaire } from '../../helpers/generateQuestionnaire';
import { supportedLanguages, getLanguageFromCode, getLanguagesInUse } from '../../helpers/LanguageHelper';
import {
    addQuestionnaireLanguageAction,
    removeQuestionnaireLanguageAction,
    updateQuestionnaireMetadataAction,
} from '../../store/treeStore/treeActions';
import { Translation, TreeContext } from '../../store/treeStore/treeStore';
import { Meta } from '../../types/fhir';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import Accordion from '../Accordion/Accordion';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import Select from '../Select/Select';

interface LanguageAccordionProps {
    setTranslateLang: (language: string) => void;
}

const LanguageAccordion = (props: LanguageAccordionProps): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata, qAdditionalLanguages } = state;
    const uploadRef = React.useRef<HTMLInputElement>(null);

    const [selectedLang, setSelectedLang] = useState('');
    const [fileUploadErrors, setFileUploadErrors] = useState<string[]>([]);

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string | Meta) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    function buildTranslationBase(): Translation {
        return { items: {}, sidebarItems: {}, metaData: {}, contained: {} };
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

    const onLoadUploadedFile = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
            try {
                const translatedQuestionnaire = JSON.parse(event.target.result as string);
                const mainQuestionnaire = generateMainQuestionnaire(state);
                const isoLanguage = translatedQuestionnaire.language
                    ? languageToIsoString(translatedQuestionnaire.language)
                    : '';

                const errors: string[] = [];
                // validate that this file is a questionnaire:
                if (translatedQuestionnaire.resourceType !== 'Questionnaire') {
                    errors.push('Uploaded file is not a questionnaire');
                }
                // validate that name is the same as the main questionnaire:
                else if (translatedQuestionnaire.name && mainQuestionnaire.name !== translatedQuestionnaire.name) {
                    errors.push(
                        'Technical name of uploaded questionnaire is not equal to questionnaire technical name',
                    );
                }
                // validate that a questionnaire with this language does not already exist
                else if (
                    (qAdditionalLanguages && qAdditionalLanguages[isoLanguage]) ||
                    mainQuestionnaire.language === isoLanguage
                ) {
                    errors.push('Questionnaire with the same language as uploaded questionnaire already exists');
                }

                if (errors.length > 0) {
                    setFileUploadErrors(errors);
                } else {
                    const translation = translateQuestionnaire(mainQuestionnaire, translatedQuestionnaire);
                    dispatchAddLanguage(isoLanguage || '', translation);
                }
            } catch {
                setFileUploadErrors(['Could not read uploaded file']);
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
            setFileUploadErrors(['Could not read uploaded file']);
        };
        if (event.target.files && event.target.files[0]) {
            reader.readAsText(event.target.files[0]);
            setFileUploadErrors([]);
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
                {fileUploadErrors.length > 0 && (
                    <ul className="item-validation-error-summary">
                        {fileUploadErrors.map((x: string) => {
                            return <li key={x}>{t(x)}</li>;
                        })}
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
