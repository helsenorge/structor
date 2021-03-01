import './FormBuilder.css';

import { OrderItem, TreeContext } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import React, { useContext, useState } from 'react';
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
import { isIgnorableItem } from '../helpers/itemControl';
import Languages from '../components/Languages/Languages';
import TranslationModal from '../components/Languages/Translation/TranslationModal';
import Sidebar from '../components/Sidebar/Sidebar';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showResults, setShowAdminMenu] = useState(false);
    const [showTranslations, setShowTranslations] = useState(false);

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

    const removeUnsupportedChildren = (items: OrderItem[]) => {
        return items.filter((x) => !isIgnorableItem(state.qItems[x.linkId]));
    };

    const renderTree = (
        items: Array<OrderItem>,
        questionArray: Array<JSX.Element>,
        parentArray: Array<string> = [],
        parentQuestionNumber = '',
    ): void => {
        removeUnsupportedChildren(items).forEach((x, index) => {
            const questionNumber =
                parentQuestionNumber === '' ? `${index + 1}` : `${parentQuestionNumber}.${index + 1}`;

            const questionEl = (
                <Question
                    key={`${index}${x.linkId}`}
                    item={state.qItems[x.linkId]}
                    parentArray={parentArray}
                    questionNumber={questionNumber}
                    getConditionalArray={getConditional}
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
                showAdmin={() => setShowAdminMenu(!showResults)}
                showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)}
                showImportValueSet={() => setShowImportValueSet(!showImportValueSet)}
            />

            {showResults && <PublishModal close={() => setShowAdminMenu(!showResults)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}
            {isShowingFireStructure && (
                <JSONView showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)} />
            )}
            {showTranslations && <TranslationModal close={() => setShowTranslations(!showTranslations)} />}

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
                            <Languages showTranslationEditor={() => setShowTranslations(!showTranslations)} />
                            <div className="form-intro">
                                <div className="form-intro-header">
                                    <h2>Skjemainformasjon</h2>
                                </div>
                                <div className="form-intro-field">
                                    <label htmlFor="questionnaire-title">Tittel:</label>
                                    <br />
                                    <input
                                        placeholder="Tittel"
                                        value={state.qMetadata.title}
                                        id="questionnaire-title"
                                        onChange={(event) => {
                                            dispatchUpdateQuestionnaireMetadata(
                                                IQuestionnaireMetadataType.title,
                                                event.target.value,
                                            );
                                        }}
                                    />
                                </div>

                                <MetadataEditor />
                                <Sidebar />
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
