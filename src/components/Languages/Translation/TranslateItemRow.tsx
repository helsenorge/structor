import React, { useContext, useState } from 'react';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateItemTranslationAction, updateItemOptionTranslationAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import TranslateOptionRow from './TranslateOptionRow';

type TranslationRowProps = {
    targetLanguage: string;
    item: QuestionnaireItem;
    itemNumber: string;
};

const TranslateItemRow = ({ targetLanguage, item, itemNumber }: TranslationRowProps): JSX.Element | null => {
    const { state, dispatch } = useContext(TreeContext);

    if (!state.qAdditionalLanguages) {
        console.error('TranslationRow: should never get here if no translations exist');
        return null;
    }

    const itemTranslation = state.qAdditionalLanguages[targetLanguage].items[item.linkId];
    const [translatedText, setTranslatedText] = useState(itemTranslation.text);
    const isMarkdown: boolean = item._text ? true : false;

    function dispatchUpdateItemTranslation(text: string) {
        dispatch(updateItemTranslationAction(targetLanguage, item.linkId, text));
    }

    function dispatchUpdateOptionTranslation(text: string, optionCode?: string) {
        if (optionCode) {
            dispatch(updateItemOptionTranslationAction(targetLanguage, item.linkId, text, optionCode));
        }
    }

    function getInputField(): JSX.Element {
        if (isMarkdown) {
            return <MarkdownEditor data={translatedText} onChange={(text) => dispatchUpdateItemTranslation(text)} />;
        }
        return (
            <input
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                onBlur={(e) => dispatchUpdateItemTranslation(e.target.value)}
            />
        );
    }

    function getReadOnlyInputField(): JSX.Element {
        if (isMarkdown) {
            return <MarkdownEditor data={item.text || ''} disabled={true} />;
        }
        return <input defaultValue={item.text} disabled={true} />;
    }

    function getOptionRow(option: QuestionnaireItemAnswerOption): JSX.Element | null {
        if (itemTranslation.answerOptions && option.valueCoding.code) {
            const translation = itemTranslation.answerOptions[option.valueCoding.code];
            return (
                <TranslateOptionRow
                    key={`${item.linkId}-${option.valueCoding.code}`}
                    option={option}
                    translation={translation}
                    onBlur={(text: string) => dispatchUpdateOptionTranslation(text, option.valueCoding.code)}
                />
            );
        }
        return null;
    }

    return (
        <div className="translation-item">
            <div className="item-number">{itemNumber}</div>
            <div className="translation-row">
                <FormField>{getReadOnlyInputField()}</FormField>
                <FormField>{getInputField()}</FormField>
            </div>
            {item.answerOption && (
                <>
                    {item.answerOption.map((option) => {
                        return getOptionRow(option);
                    })}
                </>
            )}
        </div>
    );
};

export default TranslateItemRow;
