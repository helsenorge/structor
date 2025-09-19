import React, { useState } from "react";

import { QuestionnaireItemAnswerOption } from "fhir/r4";

import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

type TranslateOptionRowProps = {
  option: QuestionnaireItemAnswerOption;
  translation: string;
  onBlur: (text: string) => void;
};

const TranslateOptionRow = ({
  option,
  translation,
  onBlur,
}: TranslateOptionRowProps): React.JSX.Element => {
  const [translatedText, setTranslatedText] = useState(translation);

  return (
    <div className="translation-row">
      <FormField>
        <InputField value={option.valueCoding?.display} disabled={true} />
      </FormField>
      <FormField>
        <InputField
          value={translatedText}
          onChange={(event) => {
            setTranslatedText(event.target.value);
          }}
          className={!translatedText?.trim() ? "error-highlight" : ""}
          onBlur={(event) => onBlur(event.target.value)}
        />
      </FormField>
    </div>
  );
};

export default TranslateOptionRow;
