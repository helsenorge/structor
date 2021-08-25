import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, getLanguageFromCode, getLanguagesInUse } from '../../helpers/LanguageHelper';
import {
    addQuestionnaireLanguageAction,
    removeQuestionnaireLanguageAction,
    updateQuestionnaireMetadataAction,
} from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
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

    const [selectedLang, setSelectedLang] = useState('');

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string | Meta) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const dispatchAddLanguage = (selectedLanguage: string) => {
        if (selectedLanguage && qAdditionalLanguages !== undefined && !qAdditionalLanguages[selectedLanguage]) {
            dispatch(addQuestionnaireLanguageAction(selectedLanguage));
        }
    };

    const removeAdditionalLanguage = (language: string) => {
        if (qAdditionalLanguages !== undefined && qAdditionalLanguages[language]) {
            dispatch(removeQuestionnaireLanguageAction(language));
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
                        <div style={{ marginBottom: 10, width: '100%' }}>
                            <FormField label={t('Add support for additional language')}>
                                <Select
                                    placeholder={t('Select a language..')}
                                    options={getUnusedLanguage}
                                    value={selectedLang}
                                    onChange={(event) => setSelectedLang(event.target.value)}
                                />
                            </FormField>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <Btn
                                title={t('+ Add new language')}
                                type="button"
                                size="small"
                                variant="primary"
                                onClick={() => {
                                    dispatchAddLanguage(selectedLang);
                                    setSelectedLang('');
                                }}
                            />
                        </div>
                    </div>
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
                                        size="small"
                                        variant="secondary"
                                        onClick={() => removeAdditionalLanguage(language)}
                                    />
                                    <Btn
                                        title={t('Translate')}
                                        type="button"
                                        size="small"
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
