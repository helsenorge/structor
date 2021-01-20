import React, { useContext } from 'react';
import './FormBuilder.css';
import { OrderItem, TreeContext } from '../store/treeStore/treeStore';
import Question from '../components/Question/Question';
import { newItemAction, updateQuestionnaireMetadataAction } from '../store/treeStore/treeActions';
import { generateQuestionnaire } from '../helpers/generateQuestionnaire';
import IconBtn from '../components/IconBtn/IconBtn';
import Btn from '../components/Btn/Btn';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadataType } from '../types/IQuestionnaireMetadataType';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import { Link } from 'react-router-dom';
import PublishModal from '../components/PublishModal/PublishModal';
import MetadataEditor from '../components/Metadata/MetadataEditor';
import { getEnableWhenConditionals } from '../helpers/enableWhenValidConditional';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = React.useState<boolean>(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = React.useState<boolean>(false);
    const [showPublishModal, setShowPublishModal] = React.useState<boolean>(false);

    function iFrameLoaded() {
        const questionnaireString = generateQuestionnaire(state);
        const schemeDisplayer = document.getElementById('schemeFrame');
        if (schemeDisplayer) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schemeDisplayer.contentWindow.postMessage(
                {
                    questionnaireString: questionnaireString,
                    showFooter: false,
                },
                '*',
            );
        }
    }

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
                <div key={x.linkId}>
                    <Question
                        item={state.qItems[x.linkId]}
                        parentArray={parentArray}
                        questionNumber={questionNumber}
                        conditionalArray={getConditional(parentArray, x.linkId)}
                        getItem={getQItem}
                        containedResources={state.qContained}
                    />
                    {renderTree(x.items, [...parentArray, x.linkId], questionNumber)}
                </div>
            );
        });
    };

    function exportToJsonAndDownload() {
        const questionnaire = generateQuestionnaire(state);
        const filename = state.qMetadata.title || 'skjema' + '.json';
        const contentType = 'application/json;charset=utf-8;';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const blob = new Blob([decodeURIComponent(encodeURI(questionnaire))], {
                type: contentType,
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(questionnaire);
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    return (
        <>
            <header>
                <Link to="/">
                    <IconBtn type="back" title="Tilbake" />
                </Link>

                <div className="left"></div>

                <div className="pull-right">
                    <Btn title="Forhåndsvisning" onClick={() => setIsIframeVisible(!isIframeVisible)} />
                    <Btn title="JSON" onClick={() => setIsShowingFireStructure(!isShowingFireStructure)} />
                    <Btn title="Lagre" onClick={() => exportToJsonAndDownload()} />
                    <Btn title="Publiser" onClick={() => setShowPublishModal(!showPublishModal)} />
                </div>
            </header>

            {showPublishModal && <PublishModal close={() => setShowPublishModal(!showPublishModal)} />}

            <div style={{ display: 'flex', paddingBottom: '180px' }}>
                <AnchorMenu />
                {isIframeVisible ? (
                    <>
                        <div className="overlay">
                            <div className="iframe-div">
                                <div className="title">
                                    <IconBtn
                                        type="x"
                                        title="Lukk"
                                        onClick={() => setIsIframeVisible(!isIframeVisible)}
                                    />
                                    <h1>Forhåndsvisning</h1>
                                </div>
                                <iframe
                                    id="schemeFrame"
                                    style={{
                                        width: '100%',
                                        height: '70vh',
                                    }}
                                    onLoad={iFrameLoaded}
                                    src="../../iframe/index.html"
                                ></iframe>
                            </div>
                        </div>
                    </>
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
                <div className="structor-helper">
                    <div className="title">
                        <IconBtn
                            type="x"
                            title="Tilbake"
                            onClick={() => setIsShowingFireStructure(!isShowingFireStructure)}
                        />
                        <h1>JSON struktur</h1>
                    </div>
                    <code className="json">
                        {JSON.stringify(JSON.parse(generateQuestionnaire(state)), undefined, 2)}
                    </code>
                </div>
            )}
        </>
    );
};

export default FormBuilder;
