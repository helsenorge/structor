/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { FormContext } from '../store/FormStore';
import JSONGenerator from '../helpers/JSONGenerator';
import { Button } from 'antd';

function Preview(): JSX.Element {
    const { state, dispatch } = React.useContext(FormContext);

    const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
        input !== null && input.tagName === 'IFRAME';

    function iFrameLoaded() {
        const questionnaireString = JSON.stringify(
            JSONGenerator(
                state.title,
                state.description,
                state.sectionOrder,
                state.sections,
                state.questions,
            ),
        );
        // const questionnaireString = JSON.stringify(koronaSkjema);

        const schemeDisplayer = document.getElementById('schemeFrame');
        if (isIFrame(schemeDisplayer) && schemeDisplayer.contentWindow) {
            console.log('Fant frame');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schemeDisplayer.contentWindow.postMessage(
                {
                    questionnaireString: questionnaireString,
                },
                '*',
            );
        }
    }

    return (
        <div style={{ height: '75vh', width: '100%' }}>
            <Button onClick={() => window.history.back()}>TIlbake</Button>
            <iframe
                id="schemeFrame"
                style={{
                    width: '100%',
                    height: '50rem',
                }}
                onLoad={iFrameLoaded}
                src="../../iframe/index.html"
            ></iframe>
        </div>
    );
    // const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState(
    //     '0',
    // );

    // const iframeLoaded = () => {
    //     let questionnaireString = '';
    //     if (selectedQuestionnaire === '1') {
    //         questionnaireString = JSON.stringify(koronaSkjema);
    //     } else if (selectedQuestionnaire === '2') {
    //         questionnaireString = JSON.stringify(bestillingsSkjema);
    //     } else if (selectedQuestionnaire === '3') {
    //         questionnaireString = JSON.stringify(reisevaksineSkjema);
    //     }
    //     // @ts-ignore
    //     document.getElementById('skjemaframe').contentWindow.postMessage({
    //         questionnaireString: questionnaireString,
    //     }, '*');
    // };

    // const onChangeQuestionnaire = (event: any) => {
    //     const value = event.target.value;
    //     if (document.getElementById('skjemaframe')) {
    //         // @ts-ignore
    //         document.getElementById('skjemaframe').src =
    //             'https://raw.githack.com/helsenorge/structor/skjemautfyller-eksempel/skjemautfyller-eksempel/iframe/index.html';
    //     }
    //     setSelectedQuestionnaire(value);
    // };

    // return (
    //     <>
    //         <label>
    //             <span>Vis skjema i iframe:</span>
    //             <select
    //                 onChange={onChangeQuestionnaire}
    //                 value={selectedQuestionnaire}
    //             >
    //                 <option value="0">Ingen</option>
    //                 <option value="1">Korona-kjema</option>
    //                 <option value="2">Bestillings-skjema</option>
    //                 <option value="3">Reisevaksine-skjema</option>
    //             </select>
    //         </label>
    //         {selectedQuestionnaire !== '0' && (
    //             <iframe
    //                 id="skjemaframe"
    //                 style={{ width: '100%', height: '25rem' }}
    //                 onLoad={iframeLoaded}
    //                 src="https://raw.githack.com/helsenorge/structor/skjemautfyller-eksempel/skjemautfyller-eksempel/iframe/index.html"
    //             ></iframe>
    //         )}
    //     </>
    // );
}

export default Preview;
