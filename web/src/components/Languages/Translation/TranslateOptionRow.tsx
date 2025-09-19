import React, { useState } from "react";

import { QuestionnaireItemAnswerOption } from "fhir/r4";
import {
  ErrorClassVariant,
  getSeverityClassByLevelAndTypeIfError,
} from "src/components/Validation/validationHelper";
import { ErrorLevel } from "src/components/Validation/validationTypes";

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
          className={getSeverityClassByLevelAndTypeIfError(
            ErrorLevel.error,
            ErrorClassVariant.highlight,
            !translatedText?.trim(),
          )}
          onBlur={(event) => onBlur(event.target.value)}
        />
      </FormField>
    </div>
  );
};

export default TranslateOptionRow;
