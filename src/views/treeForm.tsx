import React, { useContext } from 'react';
import { TreeContext, OrderItem, getValueSetId } from '../store/treeStore/treeStore';
import TreeItem from './treeItem';
import { newItemAction } from '../store/treeStore/treeActions';
import { generateQuestionnaire } from '../helpers/generateQuestionnaire';
import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';

const TreeForm = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = React.useState<boolean>(false);

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
                    <TreeItem
                        item={state.qItems[x.linkId]}
                        parentArray={parentArray}
                        valueSet={state.qValueSet[getValueSetId(x.linkId)]}
                    />
                    {renderTree(x.items, [...parentArray, x.linkId])}
                </div>
            );
        });
    };

    return (
        <>
            <button onClick={() => setIsIframeVisible(!isIframeVisible)}>Toggle preview</button>
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
                    <div style={{ textAlign: 'left', whiteSpace: 'pre' }}>{renderTree(state.qOrder, [])}</div>
                    <button onClick={dispatchNewRootItem}>Add root child</button>
                </>
            )}
        </>
    );
};

export default TreeForm;
