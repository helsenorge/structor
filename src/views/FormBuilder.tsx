import React, { useContext, useState } from 'react';
import './FormBuilder.css';
import { OrderItem, TreeContext } from '../store/treeStore/treeStore';
import Question from '../components/Question/Question';
import { newItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import PublishModal from '../components/PublishModal/PublishModal';
import MetadataEditor from '../components/Metadata/MetadataEditor';
import { getEnableWhenConditionals } from '../helpers/enableWhenValidConditional';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import Navbar from '../components/Navbar/Navbar';
import FormFiller from '../components/FormFiller/FormFiller';
import JSONView from '../components/JSONView/JSONView';
import ImportValueSet from '../components/ImportValueSet/ImportValueSet';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [currentQuestion, setCurrentQuestion] = useState('');
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

    const renderTree = (
        items: Array<OrderItem>,
        parentArray: Array<string> = [],
        parentQuestionNumber = '',
    ): Array<JSX.Element> => {
        return items.map((x, index) => {
            const questionNumber =
                parentQuestionNumber === '' ? `${index + 1}` : `${parentQuestionNumber}.${index + 1}`;
            return (
                <div key={index}>
                    <Question
                        item={state.qItems[x.linkId]}
                        parentArray={parentArray}
                        questionNumber={questionNumber}
                        conditionalArray={getConditional(parentArray, x.linkId)}
                        getItem={getQItem}
                        containedResources={state.qContained}
                        setCurrentQuestion={(linkId: string) => setCurrentQuestion(linkId)}
                        currentQuestion={currentQuestion}
                    />
                    {renderTree(x.items, [...parentArray, x.linkId], questionNumber)}
                </div>
            );
        });
    };

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
                <AnchorMenu />
                {isIframeVisible ? (
                    <FormFiller showFormFiller={() => setIsIframeVisible(!isIframeVisible)} />
                ) : (
                    <>
                        <div className="page-wrapper">
                            <div className="form-intro">
                                <input
                                    placeholder="Skjematittel.."
                                    value={state.qMetadata.title}
                                    onChange={(event) => {
                                        dispatchUpdateQuestionnaireMetadata(
                                            IQuestionnaireMetadataType.title,
                                            event.target.value,
                                        );
                                    }}
                                />
                                <textarea
                                    placeholder="Beskrivelse av skjema"
                                    value={state.qMetadata.description}
                                    onChange={(event) => {
                                        dispatchUpdateQuestionnaireMetadata(
                                            IQuestionnaireMetadataType.description,
                                            event.target.value,
                                        );
                                    }}
                                />
                            </div>
                            <MetadataEditor />
                            <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{renderTree(state.qOrder)}</div>
                            <button className="section-button" onClick={dispatchNewRootItem}>
                                Opprett spørsmål
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
