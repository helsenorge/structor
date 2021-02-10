import React, { useContext } from 'react';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import IconBtn from '../IconBtn/IconBtn';

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
                <iframe
                    id="schemeFrame"
                    style={{
                        width: '100%',
                        height: '70vh',
                    }}
                    onLoad={iFrameLoaded}
                    src="../../../iframe/index.html"
                ></iframe>
            </div>
        </div>
    );
};

export default FormFiller;
