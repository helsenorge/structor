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
import { QuestionnaireItem } from '../types/fhir';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = React.useState<boolean>(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = React.useState<boolean>(false);

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

    const getCurrentValueSet = (linkId: string) => {
        const currentValueSet = state.qValueSet[linkId + '-valueSet'];

        return currentValueSet?.compose?.include[0].concept || null;
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
                        valueSet={getCurrentValueSet(x.linkId)}
                        conditionalArray={getConditional(parentArray)}
                        getItem={getQItem}
                    />
                    {renderTree(x.items, [...parentArray, x.linkId], questionNumber)}
                </div>
            );
        });
    };

    return (
        <>
            <header>
                <IconBtn type="back" title="Tilbake" />
                <h1>Skjemabygger</h1>
                <div className="pull-right">
                    <Btn title="Forhåndsvisning" onClick={() => setIsIframeVisible(!isIframeVisible)} />
                    <Btn title="JSON" onClick={() => setIsShowingFireStructure(!isShowingFireStructure)} />
                </div>
            </header>

            {isIframeVisible ? (
                <div style={{ height: '100%', width: '100%' }} className="iframe-div">
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
                    <header>
                        <IconBtn
                            type="x"
                            title="Tilbake"
                            onClick={() => setIsShowingFireStructure(!isShowingFireStructure)}
                        />
                        <h1>JSON struktur</h1>
                    </header>
                    <code className="json">
                        {JSON.stringify(JSON.parse(generateQuestionnaire(state)), undefined, 2)}
                    </code>
                </div>
            )}
        </>
    );
};

export default FormBuilder;
