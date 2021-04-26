import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { TreeContext, TreeState } from '../store/treeStore/treeStore';
import { getStateFromDb } from '../store/treeStore/indexedDbHelper';
import { Questionnaire } from '../types/fhir';
import { resetQuestionnaireAction } from '../store/treeStore/treeActions';
import mapToTreeState from '../helpers/FhirToTreeStateMapper';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import Confirm from '../components/Modal/Confirm';
import FormFiller from '../components/FormFiller/FormFiller';
import Modal from '../components/Modal/Modal';
import Navbar from '../components/Navbar/Navbar';
import QuestionDrawer from '../components/QuestionDrawer/QuestionDrawer';
import SpinnerBox from '../components/Spinner/SpinnerBox';

import './FormBuilder.css';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [showFormDetails, setShowFormDetails] = useState(true);

    const [stateFromStorage, setStateFromStorage] = useState<TreeState>();
    const [isLoading, setIsLoading] = useState(false);
    const [displayVerifyReset, setDisplayVerifyReset] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);

    const toggleFormDetails = useCallback(() => {
        setShowFormDetails(!showFormDetails);
    }, [showFormDetails]);

    const getStoredQuestionnaire = async () => {
        const indexedDbState = await getStateFromDb();
        setStateFromStorage(indexedDbState);
    };

    const suggestRestore = (): boolean => {
        return stateFromStorage?.qItems ? Object.keys(stateFromStorage.qItems).length > 0 : false;
    };

    const getConfirmRestoreContent = (): JSX.Element => {
        return (
            <div>
                <p>Det ser ut til at du har jobbet med et skjema tidligere:</p>
                <div className="key-value">
                    <div>Tittel:</div>
                    <div>{stateFromStorage?.qMetadata.title}</div>
                </div>
                <div className="key-value">
                    <div>Teknisk navn:</div>
                    <div>{stateFromStorage?.qMetadata.name}</div>
                </div>
                <div className="key-value">
                    <div>Versjon:</div>
                    <div>{stateFromStorage?.qMetadata.version}</div>
                </div>
                <p>Ønsker du å fortsette med dette skjemaet?</p>
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
        const startTime = performance.now();
        getStoredQuestionnaire();
        console.log(`Loading state from indexedDb took ${Math.round(performance.now() - startTime)}ms`);
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

    return (
        <>
            <Navbar
                newQuestionnaire={resetQuestionnaire}
                showFormFiller={() => setShowPreview(!showPreview)}
                uploadRef={uploadRef}
            />

            {suggestRestore() && (
                <Confirm
                    onConfirm={() => {
                        dispatch(resetQuestionnaireAction(stateFromStorage));
                        setStateFromStorage(undefined);
                    }}
                    onDeny={() => {
                        dispatch(resetQuestionnaireAction());
                        setStateFromStorage(undefined);
                    }}
                    title="Gjenopprett skjema..."
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
                    title="Husk å lagre..."
                    id="confirm-reset"
                >
                    Du har gjort endringer som ikke er lagret. Ønsker du allikevel å begynne på et nytt skjema?
                    (Endringene vil gå tapt)
                </Confirm>
            )}

            {isLoading && (
                <Modal>
                    <div className="align-everything">
                        <SpinnerBox />
                    </div>
                    <p className="center-text">Leser inn skjema...</p>
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
                <div className="anchor-wrapper">
                    <AnchorMenu
                        dispatch={dispatch}
                        qOrder={state.qOrder}
                        qItems={state.qItems}
                        toggleFormDetails={toggleFormDetails}
                        areFormDetailsVisible={showFormDetails}
                    />
                </div>
                {showPreview && (
                    <FormFiller
                        showFormFiller={() => setShowPreview(!showPreview)}
                        language={state.qMetadata.language}
                    />
                )}
                <div className="page-wrapper">
                    <QuestionDrawer />
                </div>
            </div>
        </>
    );
};

export default FormBuilder;
