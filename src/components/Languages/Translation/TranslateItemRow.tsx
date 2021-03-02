import React, { useContext, useState } from 'react';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateItemOptionTranslationAction, updateItemTranslationAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import TranslateOptionRow from './TranslateOptionRow';
import { getPlaceHolderText, getValidationMessage } from '../../../helpers/QuestionHelper';
import { getItemPropertyTranslation } from '../../../helpers/LanguageHelper';
import { TranslatableItemProperty } from '../../../types/LanguageTypes';

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

    function dispatchUpdateItemTranslation(text: string, propertyName: TranslatableItemProperty) {
        dispatch(updateItemTranslationAction(targetLanguage, item.linkId, propertyName, text));
    }

    function dispatchUpdateOptionTranslation(text: string, optionCode?: string) {
        if (optionCode) {
            dispatch(updateItemOptionTranslationAction(targetLanguage, item.linkId, text, optionCode));
        }
    }

    function getInputField(): JSX.Element {
        if (isMarkdown) {
            return (
                <MarkdownEditor
                    data={translatedText}
                    onChange={(text) => dispatchUpdateItemTranslation(text, TranslatableItemProperty.text)}
                />
            );
        }
        return (
            <input
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                onBlur={(e) => dispatchUpdateItemTranslation(e.target.value, TranslatableItemProperty.text)}
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
        <>
            <div className="translation-group-header">{`Element ${itemNumber}`}</div>
            <div className="translation-row">
                <FormField>{getReadOnlyInputField()}</FormField>
                <FormField>{getInputField()}</FormField>
            </div>
            {getValidationMessage(item) && (
                <div className="translation-row">
                    <FormField>
                        <input defaultValue={getValidationMessage(item)} disabled={true} />
                    </FormField>
                    <FormField>
                        <input
                            defaultValue={getItemPropertyTranslation(
                                targetLanguage,
                                state.qAdditionalLanguages,
                                item.linkId,
                                TranslatableItemProperty.validationText,
                            )}
                            onBlur={(event) =>
                                dispatchUpdateItemTranslation(
                                    event.target.value,
                                    TranslatableItemProperty.validationText,
                                )
                            }
                        />
                    </FormField>
                </div>
            )}
            {getPlaceHolderText(item) && (
                <div className="translation-row">
                    <FormField>
                        <input defaultValue={getPlaceHolderText(item)} disabled={true} />
                    </FormField>
                    <FormField>
                        <input
                            defaultValue={getItemPropertyTranslation(
                                targetLanguage,
                                state.qAdditionalLanguages,
                                item.linkId,
                                TranslatableItemProperty.entryFormatText,
                            )}
                            onBlur={(event) =>
                                dispatchUpdateItemTranslation(
                                    event.target.value,
                                    TranslatableItemProperty.entryFormatText,
                                )
                            }
                        />
                    </FormField>
                </div>
            )}
            {item.answerOption && (
                <>
                    {item.answerOption.map((option) => {
                        return getOptionRow(option);
                    })}
                </>
            )}
        </>
    );
};

export default TranslateItemRow;
