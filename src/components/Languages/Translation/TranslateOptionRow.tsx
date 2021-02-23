import React, { useState } from 'react';
import { QuestionnaireItemAnswerOption } from '../../../types/fhir';
import FormField from '../../FormField/FormField';

type TranslateOptionRowProps = {
    option: QuestionnaireItemAnswerOption;
    translation: string;
    onBlur: (text: string) => void;
};

const TranslateOptionRow = ({ option, translation, onBlur }: TranslateOptionRowProps): JSX.Element => {
    const [translatedText, setTranslatedText] = useState(translation);

    return (
        <div className="translation-row">
            <FormField>
                <input value={option.valueCoding.display} disabled={true} />
            </FormField>
            <FormField>
                <input
                    value={translatedText}
                    onChange={(event) => {
                        setTranslatedText(event.target.value);
                    }}
                    onBlur={(event) => onBlur(event.target.value)}
                />
            </FormField>
        </div>
    );
};

export default TranslateOptionRow;
