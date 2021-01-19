import React, { useContext } from 'react';
import './FormBuilder.css';
import { OrderItem, TreeContext } from '../store/treeStore/treeStore';
import Question from '../components/Question/Question';
import { newItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { QuestionnaireItem } from '../types/fhir';

import PublishModal from '../components/PublishModal/PublishModal';
import Publish from '../components/Metadata/Publish';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import Navbar from '../components/Navbar/Navbar';
import FormFiller from '../components/FormFiller/FormFiller';
import JSONView from '../components/JSONView/JSONView';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = React.useState<boolean>(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = React.useState<boolean>(false);
    const [showPublishModal, setShowPublishModal] = React.useState<boolean>(false);

    const dispatchNewRootItem = () => {
        dispatch(newItemAction(IQuestionnaireItemType.group, []));
    };

    const dispatchUpdateQuestionnaireMetadata = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const getConditional = (parrentArray: string[]) => {
        const conditinals = parrentArray.map((x) => {
            return {
                code: x,
                display: state.qItems[x].text || 'Ikke definert tittel',
            };
        });

        return conditinals;
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
                <div key={x.linkId}>
                    <Question
                        item={state.qItems[x.linkId]}
                        parentArray={parentArray}
                        questionNumber={questionNumber}
                        conditionalArray={getConditional(parentArray)}
                        getItem={getQItem}
                        containedResources={state.qContained}
                    />
                    {renderTree(x.items, [...parentArray, x.linkId], questionNumber)}
                </div>
            );
        });
    };

    const [showResults, setShowAdminMenu] = React.useState(false);

    return (
        <>
            <Navbar
                showAdmin={() => setShowAdminMenu(!showResults)}
                showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)}
            />

            {showResults && <Publish openModal={() => setShowPublishModal(!showPublishModal)} />}
            {showPublishModal && <PublishModal close={() => setShowPublishModal(!showPublishModal)} />}

            <div style={{ display: 'flex', paddingBottom: '180px' }}>
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
