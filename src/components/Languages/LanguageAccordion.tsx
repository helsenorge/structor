import React, { useContext, useState } from 'react';
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
import TranslationModal from './Translation/TranslationModal';

const LanguageAccordion = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata, qAdditionalLanguages } = state;

    const [showModal, setModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState('');
    const [translateLang, setTranslateLang] = useState('');

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
    const additionalLanguagesInUse = languageInUse.filter((x) => x !== qMetadata.language);

    const getUnusedLanguage = supportedLanguages
        .filter((language) => language.code !== qMetadata.language)
        .filter((language) => !languageInUse.includes(language.code))
        .map((x) => {
            return { code: x.code, display: x.display };
        });

    return (
        <>
            {showModal && <TranslationModal close={() => setModal(false)} targetLanguage={translateLang} />}
            <Accordion title="Språk">
                <FormField label="Hovedspråk:">
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
                            <FormField label="Legg til støtte for tilleggsspråk">
                                <Select
                                    placeholder="Velg et språk.."
                                    options={getUnusedLanguage}
                                    value={selectedLang}
                                    onChange={(event) => setSelectedLang(event.target.value)}
                                />
                            </FormField>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <Btn
                                title="+ Legg til nytt språk"
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
                        <p>Tilleggsspråk:</p>
                        {additionalLanguagesInUse.map((language, index) => (
                            <div key={index} className="enablewhen-box align-everything">
                                <div>{getLanguageFromCode(language)?.display} </div>
                                <div className="pull-right btn-group">
                                    <Btn
                                        title="Slett"
                                        type="button"
                                        size="small"
                                        variant="secondary"
                                        onClick={() => removeAdditionalLanguage(language)}
                                    />
                                    <Btn
                                        title="Oversett"
                                        type="button"
                                        size="small"
                                        variant="primary"
                                        onClick={() => {
                                            setModal(true);
                                            setTranslateLang(language);
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
