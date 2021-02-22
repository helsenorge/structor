import './FormBuilder.css';

import { OrderItem, TreeContext } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import React, { useContext, useState } from 'react';
import { newItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import FormFiller from '../components/FormFiller/FormFiller';
import { IExtentionType, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import ImportValueSet from '../components/ImportValueSet/ImportValueSet';
import JSONView from '../components/JSONView/JSONView';
import MetadataEditor from '../components/Metadata/MetadataEditor';
import Navbar from '../components/Navbar/Navbar';
import PublishModal from '../components/PublishModal/PublishModal';
import Question from '../components/Question/Question';
import { getEnableWhenConditionals } from '../helpers/enableWhenValidConditional';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showResults, setShowAdminMenu] = useState(false);

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

    const willIgnoreItem = (linkId: string) => {
        const hasItemControlExtention = state.qItems[linkId].extension?.find(
            (x) => x.url === IExtentionType.itemControl,
        );

        const ignoreItem =
            state.qItems[linkId].extension !== undefined &&
            hasItemControlExtention !== undefined &&
            hasItemControlExtention.valueCodeableConcept?.coding !== undefined &&
            hasItemControlExtention.valueCodeableConcept.coding[0].code === 'help';

        return ignoreItem;
    };

    const renderTree = (
        items: Array<OrderItem>,
        questionArray: Array<JSX.Element>,
        parentArray: Array<string> = [],
        parentQuestionNumber = '',
    ): void => {
        items.map((x, index) => {
            const questionNumber =
                parentQuestionNumber === '' ? `${index + 1}` : `${parentQuestionNumber}.${index + 1}`;
            if (willIgnoreItem(x.linkId)) {
                return;
            }

            const questionEl = (
                <Question
                    key={x.linkId}
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
                showAdmin={() => setShowAdminMenu(!showResults)}
                showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)}
                showImportValueSet={() => setShowImportValueSet(!showImportValueSet)}
            />

            {showPublishModal && <PublishModal close={() => setShowPublishModal(!showPublishModal)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}

            <div className="editor">
                <div className="anchor-wrapper">
                    <AnchorMenu />
                </div>
                {isIframeVisible ? (
                    <FormFiller showFormFiller={() => setIsIframeVisible(!isIframeVisible)} />
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
                            </div>

                            <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{flatQuestionArray}</div>
                            <button className="section-button" onClick={dispatchNewRootItem}>
                                Legg til element
                            </button>
                        </div>
                    </>
                )}
            </div>

            {isShowingFireStructure && (
                <JSONView showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)} />
            )}
        </>
    );
};

export default FormBuilder;
