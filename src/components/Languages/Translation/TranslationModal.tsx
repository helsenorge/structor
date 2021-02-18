import React, { useContext, useState } from 'react';
import Modal from '../../Modal/Modal';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { addQuestionnaireLanguageAction, updateItemTranslationAction } from '../../../store/treeStore/treeActions';
import Select from '../../Select/Select';
import './TranslationModal.css';
import TranslationRow from './TranslationRow';
import { getLanguageFromCode, supportedLanguages } from '../../../helpers/LanguageHelper';

type TranslationModalProps = {
    close: () => void;
    targetLanguage?: string;
};

const TranslationModal = (props: TranslationModalProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qItems, qAdditionalLanguages, qMetadata } = state;
    const [targetLanguage, setTargetLanguage] = useState(props.targetLanguage);
    const availableLanguages = [
        { code: '', display: 'Velg språk' },
        ...supportedLanguages.filter((lang) => lang.code.toLowerCase() !== qMetadata.language?.toLowerCase()),
    ];

    const questions = Object.values(qItems).filter((question) => {
        // Don't translate hidden items?
        return !question.extension?.some(
            (ext) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden' && ext.valueBoolean,
        );
    });

    function dispatchAddLanguage(selectedLanguage: string) {
        if (!qAdditionalLanguages || !qAdditionalLanguages[selectedLanguage]) {
            dispatch(addQuestionnaireLanguageAction(selectedLanguage));
        }
    }

    function dispatchUpdateItemTranslation(linkId: string, text: string) {
        if (targetLanguage) {
            dispatch(updateItemTranslationAction(targetLanguage, linkId, text));
        }
    }

    function getHeader(): JSX.Element {
        return (
            <div className="sticky-header">
                {qMetadata.language && (
                    <div className="horizontal equal">
                        <div>
                            <label>{getLanguageFromCode(qMetadata.language)?.display}</label>
                        </div>
                        <div>
                            <Select
                                value={targetLanguage}
                                options={availableLanguages}
                                onChange={(e) => {
                                    setTargetLanguage(e.target.value);
                                    dispatchAddLanguage(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    function showQuestions(): JSX.Element {
        if (questions && qAdditionalLanguages && targetLanguage) {
            return (
                <>
                    {questions.map((question) => {
                        return (
                            <TranslationRow
                                key={question.linkId}
                                item={question}
                                translation={qAdditionalLanguages[targetLanguage].items[question.linkId].text}
                                onChange={(text) => dispatchUpdateItemTranslation(question.linkId, text)}
                            />
                        );
                    })}
                </>
            );
        }
        return <></>;
    }

    return (
        <div className="translation-modal">
            <Modal close={props.close} title="Oversett skjema">
                {getHeader()}
                {showQuestions()}
            </Modal>
        </div>
    );
};

export default TranslationModal;
