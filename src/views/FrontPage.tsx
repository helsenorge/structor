import React, { useContext, useEffect, useRef, useState } from 'react';
import { TreeContext, TreeState } from '../store/treeStore/treeStore';
import { getStateFromDb } from '../store/treeStore/indexedDbHelper';
import { resetQuestionnaireAction } from '../store/treeStore/treeActions';
import { mapToTreeState } from '../helpers/FhirToTreeStateMapper';
import Confirm from '../components/Modal/Confirm';
import Modal from '../components/Modal/Modal';
import SpinnerBox from '../components/Spinner/SpinnerBox';
import { useTranslation } from 'react-i18next';
import FormBuilder from './FormBuilder';

const FrontPage = (): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const [stateFromStorage, setStateFromStorage] = useState<TreeState>();
    const [isLoading, setIsLoading] = useState(false);
    const [isFormBuilderShown, setIsFormBuilderShown] = useState<boolean>(false);
    const uploadRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getStoredQuestionnaire();
    }, []);

    const getStoredQuestionnaire = async () => {
        const indexedDbState = await getStateFromDb();
        setStateFromStorage(indexedDbState);
    };

    const onReaderLoad = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
            const questionnaireObj = JSON.parse(event.target.result as string);
            const importedState = mapToTreeState(questionnaireObj);
            dispatch(resetQuestionnaireAction(importedState));
            setIsLoading(false);
            setIsFormBuilderShown(true);
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
            {suggestRestore && (
                <Confirm
                    onConfirm={() => {
                        dispatch(resetQuestionnaireAction(stateFromStorage));
                        setStateFromStorage(undefined);
                        setIsFormBuilderShown(true);
                    }}
                    onDeny={() => {
                        dispatch(resetQuestionnaireAction());
                        setStateFromStorage(undefined);
                    }}
                    title={t('Restore questionnaire...')}
                >
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
            {isFormBuilderShown ? (
                <FormBuilder />
            ) : (
                <>
                    <div>What would you like to do?</div>
                    <div>You can start a new questionnaire, or upload an existing one</div>
                    <input
                        type="file"
                        ref={uploadRef}
                        onChange={uploadQuestionnaire}
                        accept="application/JSON"
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => {
                            setIsFormBuilderShown(true);
                        }}
                    >
                        {t('New questionnaire')}
                    </button>
                    <button
                        onClick={() => {
                            uploadRef.current?.click();
                        }}
                    >
                        {t('Upload questionnaire')}
                    </button>
                </>
            )}
        </>
    );
};

export default FrontPage;
