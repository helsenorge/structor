import React, { useState } from 'react';
import { QuestionnaireItem } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';

type TranslationRowProps = {
    // language: string;
    item: QuestionnaireItem;
    translation: string;
    onChange: (text: string) => void;
};

const TranslationRow = (props: TranslationRowProps): JSX.Element => {
    const [translatedText, setTranslatedText] = useState(props.translation);
    const isMarkdown: boolean = props.item._text ? true : false;

    function getInputField(): JSX.Element {
        if (isMarkdown) {
            return <MarkdownEditor data={translatedText} onChange={(text) => props.onChange(text)} />;
        }
        return (
            <input
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                onBlur={(e) => props.onChange(e.target.value)}
            />
        );
    }

    function getReadOnlyInputField(): JSX.Element {
        if (isMarkdown) {
            return <MarkdownEditor data={props.item.text || ''} onChange={() => console.log('changed')} />;
        }
        return <input defaultValue={props.item.text} readOnly={true} />;
    }

    return (
        <div className="horizontal equal">
            <FormField>
                <div>{getReadOnlyInputField()}</div>
            </FormField>
            <FormField>{getInputField()}</FormField>
        </div>
    );
};

export default TranslationRow;
