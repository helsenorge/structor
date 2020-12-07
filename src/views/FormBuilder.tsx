import React, { useContext } from 'react';
import './FormBuilder.css';
import { TreeContext, OrderItem } from '../store/treeStore/treeStore';
import Question from '../components/Question/Question';
import { newItemAction } from '../store/treeStore/treeActions';
import { generateQuestionnaire } from '../helpers/generateQuestionnaire';
import IconBtn from '../components/IconBtn/IconBtn';
import Btn from '../components/Btn/Btn';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';

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

    const renderTree = (items: Array<OrderItem>, parentArray: Array<string>): Array<JSX.Element> => {
        return items.map((x) => {
            return (
                <div key={x.linkId}>
                    <Question item={state.qItems[x.linkId]} parentArray={parentArray} />
                    {renderTree(x.items, [...parentArray, x.linkId])}
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
                            <input placeholder="Skjematittel.." />
                            <textarea placeholder="Beskrivelse av skjema" />
                        </div>
                        <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{renderTree(state.qOrder, [])}</div>
                        <button className="section-button" onClick={dispatchNewRootItem}>
                            Opprett spørsmål
                        </button>
                    </div>
                </>
            )}
            {isShowingFireStructure && (
                <div className="structor-helper">
                    <header>
                        <IconBtn type="x" title="Tilbake" />
                        <h1>JSON struktur</h1>
                    </header>
                    <code className="json">{JSON.stringify(state.qItems, undefined, 2)}</code>
                </div>
            )}
        </>
    );
};

export default FormBuilder;
