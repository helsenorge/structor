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
import Publish from '../components/Metadata/Publish';

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

    const createValueSetComposeIncludeConcept = (linkId: string, indent: number) => {
        // TODO: ignore items which cannot have enableWhen? (display, group, text.help, text.highlight...)
        const itemText = `${'\xA0'.repeat(indent * 4)}${getQItem(linkId).text || 'Ikke definert tittel'}`;
        const displayText = itemText.length > 120 ? `${itemText?.substr(0, 120)}...` : itemText;
        return {
            code: linkId,
            display: displayText,
        };
    };

    const expandSubTree = (order: OrderItem, indent: number): ValueSetComposeIncludeConcept[] => {
        return order.items.reduce((acc: ValueSetComposeIncludeConcept[], current: OrderItem) => {
            return [
                ...acc,
                createValueSetComposeIncludeConcept(current.linkId, indent),
                ...expandSubTree(current, indent + 1),
            ];
        }, []);
    };

    const getConditional = (parentArray: string[], linkId: string): ValueSetComposeIncludeConcept[] => {
        const search = (order: OrderItem[], searchArray: string[], indent: number): ValueSetComposeIncludeConcept[] => {
            if (searchArray.length === 0) {
                return [];
            }
            const currentLinkId = searchArray[0];
            const stopIndex = order.findIndex((x) => x.linkId === currentLinkId);
            const stopIndexWithoutSelfItem = searchArray.length > 1 ? stopIndex + 1 : stopIndex;
            return order
                .slice(0, stopIndexWithoutSelfItem)
                .reduce((acc: ValueSetComposeIncludeConcept[], current: OrderItem) => {
                    const expandedPart = current.linkId === currentLinkId ? [] : expandSubTree(current, indent + 1);
                    return [...acc, createValueSetComposeIncludeConcept(current.linkId, indent), ...expandedPart];
                }, [])
                .concat(search(order[stopIndex].items, searchArray.slice(1), indent + 1));
        };

        return search(state.qOrder, [...parentArray, linkId], 0);
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

    const [showResults, setShowAdminMenu] = React.useState(false);
    const onClick = () => setShowAdminMenu(!showResults);

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
                    <Btn title="Publiser" onClick={() => onClick()} />
                </div>
                {showResults && <Publish openModal={() => setShowPublishModal(!showPublishModal)} />}
            </header>

            {showPublishModal && <PublishModal close={() => setShowPublishModal(!showPublishModal)} />}

            {isIframeVisible ? (
                <>
                    <div className="overlay">
                        <div className="iframe-div">
                            <div className="title">
                                <IconBtn type="x" title="Lukk" onClick={() => setIsIframeVisible(!isIframeVisible)} />
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
                        <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{renderTree(state.qOrder)}</div>
                        <button className="section-button" onClick={dispatchNewRootItem}>
                            Opprett spørsmål
                        </button>
                    </div>
                </>
            )}
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
