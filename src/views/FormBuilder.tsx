import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TreeContext, TreeState } from '../store/treeStore/treeStore';
import { getStateFromDb } from '../store/treeStore/indexedDbHelper';
import { Questionnaire } from '../types/fhir';
import { resetQuestionnaireAction } from '../store/treeStore/treeActions';
import mapToTreeState from '../helpers/FhirToTreeStateMapper';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import Confirm from '../components/Modal/Confirm';
import FormDetailsDrawer from '../components/Drawer/FormDetailsDrawer/FormDetailsDrawer';
import FormFiller from '../components/FormFiller/FormFiller';
import IconBtn from '../components/IconBtn/IconBtn';
import Modal from '../components/Modal/Modal';
import Navbar from '../components/Navbar/Navbar';
import QuestionDrawer from '../components/QuestionDrawer/QuestionDrawer';
import SpinnerBox from '../components/Spinner/SpinnerBox';

import './FormBuilder.css';
import { ValidationErrors } from '../helpers/orphanValidation';
import TranslationModal from '../components/Languages/Translation/TranslationModal';

const FormBuilder = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [showFormDetails, setShowFormDetails] = useState(false);
    const [stateFromStorage, setStateFromStorage] = useState<TreeState>();
    const [isLoading, setIsLoading] = useState(false);
    const [displayVerifyReset, setDisplayVerifyReset] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Array<ValidationErrors>>([]);
    const [translateLang, setTranslateLang] = useState('');
    const uploadRef = useRef<HTMLInputElement>(null);

    const toggleFormDetails = useCallback(() => {
        setShowFormDetails(!showFormDetails);
    }, [showFormDetails]);

    const getStoredQuestionnaire = async () => {
        const indexedDbState = await getStateFromDb();
        setStateFromStorage(indexedDbState);
    };

    const getConfirmRestoreContent = (): JSX.Element => {
        return (
            <div>
                <p>{t('It looks like you have previously worked with a questionnaire:')}</p>
                <div className="key-value">
                    <div>{t('Title')}</div>
                    <div>{stateFromStorage?.qMetadata.title}</div>
                </div>
                <div className="key-value">
                    <div>{t('Technical name')}</div>
                    <div>{stateFromStorage?.qMetadata.name}</div>
                </div>
                <div className="key-value">
                    <div>{t('Version')}</div>
                    <div>{stateFromStorage?.qMetadata.version}</div>
                </div>
                <p>{t('Do you wish to open this questionnaire?')}</p>
            </div>
        );
    };

    const resetQuestionnaire = () => {
        if (state.isDirty && state.qItems && Object.keys(state.qItems).length > 0) {
            setDisplayVerifyReset(true);
        } else {
            dispatch(resetQuestionnaireAction());
        }
    };

    useEffect(() => {
        getStoredQuestionnaire();
    }, []);

    const reuploadJSONFile = (questionnaireObj: Questionnaire) => {
        const importedState = mapToTreeState(questionnaireObj);
        dispatch(resetQuestionnaireAction(importedState));
    };

    const onReaderLoad = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
            const obj = JSON.parse(event.target.result as string);
            reuploadJSONFile(obj);
            setIsLoading(false);
            // Reset file input
            if (uploadRef.current) {
                uploadRef.current.value = '';
            }
        }
    };

    const uploadQuestionnaire = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        if (event.target.files && event.target.files[0]) reader.readAsText(event.target.files[0]);
    };

    const suggestRestore: boolean = stateFromStorage?.qItems ? Object.keys(stateFromStorage.qItems).length > 0 : false;

    return (
        <>
            <Navbar
                newQuestionnaire={resetQuestionnaire}
                showFormFiller={() => setShowPreview(!showPreview)}
                uploadRef={uploadRef}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
            />
            {suggestRestore && (
                <Confirm
                    onConfirm={() => {
                        dispatch(resetQuestionnaireAction(stateFromStorage));
                        setStateFromStorage(undefined);
                    }}
                    onDeny={() => {
                        dispatch(resetQuestionnaireAction());
                        setStateFromStorage(undefined);
                    }}
                    title={t('Restore questionnaire...')}
                    id="confirm-use-stored-state"
                >
                    {getConfirmRestoreContent()}
                </Confirm>
            )}
            {displayVerifyReset && (
                <Confirm
                    onConfirm={() => {
                        dispatch(resetQuestionnaireAction());
                        setDisplayVerifyReset(false);
                    }}
                    onDeny={() => {
                        setDisplayVerifyReset(false);
                    }}
                    title={t('Remember to save...')}
                    id="confirm-reset"
                >
                    {t(
                        'You have unsaved changes. Do you wish to start a new questionnaire? (Changes to existing questionnaire will be lost)',
                    )}
                </Confirm>
            )}
            {isLoading && (
                <Modal>
                    <div className="align-everything">
                        <SpinnerBox />
                    </div>
                    <p className="center-text">{t('Loading questionnaire...')}</p>
                </Modal>
            )}
            <div className="editor">
                <input
                    type="file"
                    ref={uploadRef}
                    onChange={uploadQuestionnaire}
                    accept="application/JSON"
                    style={{ display: 'none' }}
                />
                <AnchorMenu
                    dispatch={dispatch}
                    qOrder={state.qOrder}
                    qItems={state.qItems}
                    validationErrors={validationErrors}
                />
                {showPreview && (
                    <FormFiller
                        showFormFiller={() => setShowPreview(!showPreview)}
                        language={state.qMetadata.language}
                    />
                )}
                {translateLang && (
                    <TranslationModal close={() => setTranslateLang('')} targetLanguage={translateLang} />
                )}
            </div>
            <div className="page-wrapper">
                <div className="details-button">
                    <IconBtn
                        type="info"
                        title={t('Questionnaire details')}
                        color="black"
                        onClick={toggleFormDetails}
                        size="large"
                    />
                </div>
                <FormDetailsDrawer
                    setTranslateLang={(language: string) => {
                        setTranslateLang(language);
                        toggleFormDetails();
                    }}
                    closeDrawer={toggleFormDetails}
                    isOpen={showFormDetails}
                />
                <QuestionDrawer validationErrors={validationErrors} />
            </div>
        </>
    );
};

export default FormBuilder;
