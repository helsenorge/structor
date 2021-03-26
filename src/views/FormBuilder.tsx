import './FormBuilder.css';

import { OrderItem, TreeContext, TreeState } from '../store/treeStore/treeStore';
import { Questionnaire, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import React, { useContext, useEffect, useState } from 'react';
import {
    newItemAction,
    resetQuestionnaireAction,
    updateQuestionnaireMetadataAction,
} from '../store/treeStore/treeActions';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import FormFiller from '../components/FormFiller/FormFiller';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import ImportValueSet from '../components/ImportValueSet/ImportValueSet';
import JSONView from '../components/JSONView/JSONView';
import MetadataEditor from '../components/Metadata/MetadataEditor';
import Navbar from '../components/Navbar/Navbar';
import PublishModal from '../components/PublishModal/PublishModal';
import Question from '../components/Question/Question';
import { getEnableWhenConditionals } from '../helpers/enableWhenValidConditional';
import { isIgnorableItem } from '../helpers/itemControl';
import Sidebar from '../components/Sidebar/Sidebar';
import LanguageAccordion from '../components/Languages/LanguageAccordion';
import PredefinedValueSetModal from '../components/PredefinedValueSetModal/PredefinedValueSetModal';
import mapToTreeState from '../helpers/FhirToTreeStateMapper';
import Modal from '../components/Modal/Modal';
import SpinnerBox from '../components/Spinner/SpinnerBox';
import { getStateFromDb } from '../store/treeStore/indexedDbHelper';
import Confirm from '../components/Modal/Confirm';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showResults, setShowAdminMenu] = useState(false);
    const [showContained, setShowContained] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [stateFromStorage, setStateFromStorage] = useState<TreeState>();

    const getStoredQuestionnaire = async () => {
        const indexedDbState = await getStateFromDb();
        setStateFromStorage(indexedDbState);
    };

    const getConfirmContent = (): JSX.Element => {
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

    useEffect(() => {
        const startTime = performance.now();
        getStoredQuestionnaire();
        console.log(`Loading state from indexedDb took ${Math.round(performance.now() - startTime)}ms`);
    }, []);

    const dispatchNewRootItem = () => {
        dispatch(newItemAction(IQuestionnaireItemType.group, []));
    };

    const dispatchUpdateQuestionnaireMetadata = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const reuploadJSONFile = (questionnaireObj: Questionnaire) => {
        const importedState = mapToTreeState(questionnaireObj);
        dispatch(resetQuestionnaireAction(importedState));
    };

    const onReaderLoad = (event: ProgressEvent<FileReader>) => {
        if (event.target && event.target.result) {
            const obj = JSON.parse(event.target.result as string);
            reuploadJSONFile(obj);
            setIsLoading(false);
        }
    };

    const uploadQuestionnaire = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        if (event.target.files && event.target.files[0]) reader.readAsText(event.target.files[0]);
    };

    const getConditional = (parentArray: string[], linkId: string): ValueSetComposeIncludeConcept[] => {
        return getEnableWhenConditionals(state, parentArray, linkId);
    };

    const getQItem = (linkId: string): QuestionnaireItem => {
        return state.qItems[linkId];
    };

    const removeUnsupportedChildren = (items: OrderItem[], parentArray: Array<string>) => {
        let parentItem: QuestionnaireItem;
        if (parentArray.length > 0) {
            parentItem = state.qItems[parentArray[parentArray.length - 1]];
        }
        return items.filter((x) => !isIgnorableItem(state.qItems[x.linkId], parentItem));
    };

    const renderTree = (
        items: Array<OrderItem>,
        questionArray: Array<JSX.Element>,
        parentArray: Array<string> = [],
        parentQuestionNumber = '',
    ): void => {
        removeUnsupportedChildren(items, parentArray).forEach((x, index) => {
            const questionNumber =
                parentQuestionNumber === '' ? `${index + 1}` : `${parentQuestionNumber}.${index + 1}`;

            const questionEl = (
                <Question
                    key={`${index}${x.linkId}`}
                    item={state.qItems[x.linkId]}
                    parentArray={parentArray}
                    questionNumber={questionNumber}
                    conditionalArray={getConditional(parentArray, x.linkId)}
                    getItem={getQItem}
                    containedResources={state.qContained}
                    dispatch={dispatch}
                />
            );
            questionArray.push(questionEl);

            renderTree(x.items, questionArray, [...parentArray, x.linkId], questionNumber);
        });
    };

    const flatQuestionArray: JSX.Element[] = [];
    renderTree(state.qOrder, flatQuestionArray);

    return (
        <>
            <Navbar
                newQuestionnaire={() => dispatch(resetQuestionnaireAction())}
                showAdmin={() => setShowAdminMenu(!showResults)}
                showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)}
                showImportValueSet={() => setShowImportValueSet(!showImportValueSet)}
                showContained={() => setShowContained(!showContained)}
                uploadQuestionnaire={uploadQuestionnaire}
            />
            {stateFromStorage && (
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
                    {getConfirmContent()}
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
            {showResults && <PublishModal close={() => setShowAdminMenu(!showResults)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}
            {isShowingFireStructure && (
                <JSONView showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)} />
            )}
            {showContained && <PredefinedValueSetModal close={() => setShowContained(!showContained)} />}

            <div className="editor">
                <div className="anchor-wrapper">
                    <AnchorMenu qOrder={state.qOrder} qItems={state.qItems} dispatch={dispatch} />
                </div>
                {isIframeVisible ? (
                    <FormFiller
                        showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                        language={state.qMetadata.language}
                    />
                ) : (
                    <>
                        <div className="page-wrapper">
                            <div className="form-intro">
                                <div className="form-intro-header">
                                    <h2>Skjemainformasjon</h2>
                                </div>
                                <div className="form-intro-field">
                                    <label htmlFor="questionnaire-title">Tittel:</label>
                                    <br />
                                    <input
                                        placeholder="Tittel"
                                        defaultValue={state.qMetadata.title}
                                        id="questionnaire-title"
                                        onBlur={(event) => {
                                            dispatchUpdateQuestionnaireMetadata(
                                                IQuestionnaireMetadataType.title,
                                                event.target.value,
                                            );
                                        }}
                                    />
                                </div>

                                <MetadataEditor />
                                <Sidebar />
                                <LanguageAccordion />
                            </div>

                            <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{flatQuestionArray}</div>
                            <button className="section-button" onClick={dispatchNewRootItem}>
                                Legg til element
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default FormBuilder;
