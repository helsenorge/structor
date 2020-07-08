import * as React from 'react';
import { CheckBox } from '@helsenorge/toolkit/components/atoms/checkbox';
import { koronaSkjema } from '../questionnaires/koronaSkjema';
import { bestillingsSkjema } from '../questionnaires/bestillingsSkjema';
import { reisevaksineSkjema } from '../questionnaires/reisevaksineSkjema';

const Iframetest = () => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState("0");
  const [isKnapperadEnabled, setIsKnapperadEnabled] = React.useState(true);

  const iframeLoaded = () => {
    let questionnaireString = '';
    if (selectedQuestionnaire === "1") {
      questionnaireString = JSON.stringify(koronaSkjema);
    } else if (selectedQuestionnaire === "2") {
      questionnaireString = JSON.stringify(bestillingsSkjema);
    } else if (selectedQuestionnaire === "3") {
      questionnaireString = JSON.stringify(reisevaksineSkjema);
    }
    document.getElementById("skjemaframe").contentWindow.postMessage({ 
      questionnaireString: questionnaireString,
      showFooter: isKnapperadEnabled 
    }, '*');
  }

  const onChangeQuestionnaire = (event) => {
    const value = event.target.value;
    if (document.getElementById("skjemaframe")) {
      document.getElementById("skjemaframe").src = "https://raw.githack.com/helsenorge/structor/skjemautfyller-eksempel/skjemautfyller-eksempel/iframe/index.html";
    }
    setSelectedQuestionnaire(value);
  }

  return (
    <>
      <label>
        <span>Vis skjema i iframe:</span>
        <select onChange={onChangeQuestionnaire} value={selectedQuestionnaire}>
          <option value="0">Ingen</option>
          <option value="1">Korona-skjema</option>
          <option value="2">Bestillings-skjema</option>
          <option value="3">Reisevaksine-skjema</option>
        </select>
      </label>
      <CheckBox
        label="Vis knapperad"
        onChange={() => setIsKnapperadEnabled(!isKnapperadEnabled)}
        id="knappeRadToggle"
        checked={isKnapperadEnabled}
      />
      { selectedQuestionnaire !== "0" && (
        <iframe id="skjemaframe" style={{ width: "100%", height: "25rem"}} onLoad={iframeLoaded} src="https://raw.githack.com/helsenorge/structor/skjemautfyller-eksempel/skjemautfyller-eksempel/iframe/index.html"></iframe>
      )}
    </>
  );
}

export default Iframetest;
