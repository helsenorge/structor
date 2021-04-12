import './FormBuilder.css';

import { TreeContext } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import React, { useCallback, useContext, useState } from 'react';
import { newItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
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
import Sidebar from '../components/Sidebar/Sidebar';
import LanguageAccordion from '../components/Languages/LanguageAccordion';
import PredefinedValueSetModal from '../components/PredefinedValueSetModal/PredefinedValueSetModal';
import { calculateItemNumber } from '../helpers/treeHelper';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showResults, setShowAdminMenu] = useState(false);
    const [showContained, setShowContained] = useState(false);
    const [showFormDetails, setShowFormDetails] = useState(false);

    const dispatchNewRootItem = () => {
        dispatch(newItemAction(IQuestionnaireItemType.group, []));
    };

    const dispatchUpdateQuestionnaireMetadata = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const getConditional = (parentArray: string[], linkId: string): ValueSetComposeIncludeConcept[] => {
        return getEnableWhenConditionals(state, parentArray, linkId);
    };

    const getQItem = (linkId: string): QuestionnaireItem => {
        return state.qItems[linkId];
    };

    const toggleFormDetails = useCallback(() => {
        setShowFormDetails(!showFormDetails);
    }, [showFormDetails]);

    return (
        <>
            <Navbar
                showAdmin={() => setShowAdminMenu(!showResults)}
                showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)}
                showImportValueSet={() => setShowImportValueSet(!showImportValueSet)}
                showContained={() => setShowContained(!showContained)}
            />

            {showResults && <PublishModal close={() => setShowAdminMenu(!showResults)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}
            {isShowingFireStructure && (
                <JSONView showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)} />
            )}
            {showContained && <PredefinedValueSetModal close={() => setShowContained(!showContained)} />}
            {isIframeVisible && (
                <FormFiller
                    showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                    language={state.qMetadata.language}
                />
            )}

            <div className="editor">
                <div className="anchor-wrapper">
                    <AnchorMenu
                        dispatch={dispatch}
                        qOrder={state.qOrder}
                        qItems={state.qItems}
                        toggleFormDetails={toggleFormDetails}
                    />
                </div>
                <div className="page-wrapper">
                    {showFormDetails && (
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
                    )}

                    <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>
                        {state.qCurrentItem && (
                            <Question
                                key={`${state.qCurrentItem.linkId}`}
                                item={state.qItems[state.qCurrentItem.linkId]}
                                parentArray={state.qCurrentItem.parentArray}
                                questionNumber={calculateItemNumber(
                                    state.qCurrentItem.linkId,
                                    state.qCurrentItem.parentArray,
                                    state.qOrder,
                                    state.qItems,
                                )}
                                conditionalArray={getConditional(
                                    state.qCurrentItem.parentArray,
                                    state.qCurrentItem.linkId,
                                )}
                                getItem={getQItem}
                                containedResources={state.qContained}
                                dispatch={dispatch}
                            />
                        )}
                    </div>
                    <button className="section-button" onClick={dispatchNewRootItem}>
                        Legg til element
                    </button>
                </div>
            </div>
        </>
    );
};

export default FormBuilder;
