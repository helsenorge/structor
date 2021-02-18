import React, { useContext } from 'react';

import IconBtn from '../IconBtn/IconBtn';
import { TreeContext } from '../../store/treeStore/treeStore';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';

type Props = {
    showFormFiller: () => void;
};

const FormFiller = ({ showFormFiller }: Props): JSX.Element => {
    const { state } = useContext(TreeContext);

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

    return (
        <div className="overlay">
            <div className="iframe-div">
                <div className="title">
                    <IconBtn type="x" title="Lukk" onClick={showFormFiller} />
                    <h1>Forhåndsvisning</h1>
                </div>
                <h2 className="q-title">{state.qMetadata.title}</h2>
                <iframe
                    id="schemeFrame"
                    style={{
                        width: 'calc(100% - 40px)',
                        height: '70vh',
                        padding: '20px',
                    }}
                    onLoad={iFrameLoaded}
                    src="../../../iframe/index.html"
                ></iframe>
            </div>
        </div>
    );
};

export default FormFiller;
