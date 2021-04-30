import React, { useContext, useState } from 'react';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateItemOptionTranslationAction, updateItemTranslationAction } from '../../../store/treeStore/treeActions';
import { ItemTranslation, TreeContext } from '../../../store/treeStore/treeStore';
import TranslateOptionRow from './TranslateOptionRow';
import { getInitialText, getPlaceHolderText, getValidationMessage } from '../../../helpers/QuestionHelper';
import { getItemPropertyTranslation } from '../../../helpers/LanguageHelper';
import { TranslatableItemProperty } from '../../../types/LanguageTypes';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';

type TranslationRowProps = {
    targetLanguage: string;
    item: QuestionnaireItem;
    itemHeading: string;
};

const TranslateItemRow = ({ targetLanguage, item, itemHeading }: TranslationRowProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const qAdditionalLanguages = state.qAdditionalLanguages || {};

    const itemTranslation: ItemTranslation = qAdditionalLanguages
        ? qAdditionalLanguages[targetLanguage].items[item.linkId] || {}
        : {};
    const [translatedText, setTranslatedText] = useState(itemTranslation.text || '');
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
                    onBlur={(text) => dispatchUpdateItemTranslation(text, TranslatableItemProperty.text)}
                />
            );
        }
        return (
            <textarea
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
        return <textarea defaultValue={item.text} disabled={true} />;
    }

    function getOptionRow(option: QuestionnaireItemAnswerOption): JSX.Element | null {
        if (option.valueCoding?.code) {
            const translation = itemTranslation.answerOptions
                ? itemTranslation.answerOptions[option.valueCoding.code] || ''
                : '';
            return (
                <TranslateOptionRow
                    key={`${targetLanguage}-${item.linkId}-${option.valueCoding.code}`}
                    option={option}
                    translation={translation}
                    onBlur={(text: string) => dispatchUpdateOptionTranslation(text, option.valueCoding?.code)}
                />
            );
        }
        return null;
    }

    return (
        <>
            <div className="translation-group-header">{itemHeading}</div>
            <div className="translation-row">
                <FormField>{getReadOnlyInputField()}</FormField>
                <FormField>{getInputField()}</FormField>
            </div>
            {getValidationMessage(item) && (
                <div className="translation-row">
                    <FormField>
                        <textarea defaultValue={getValidationMessage(item)} disabled={true} />
                    </FormField>
                    <FormField>
                        <textarea
                            defaultValue={getItemPropertyTranslation(
                                targetLanguage,
                                qAdditionalLanguages,
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
                <>
                    <div className="translation-group-header">Skyggetekst</div>
                    <div className="translation-row">
                        <FormField>
                            <textarea defaultValue={getPlaceHolderText(item)} disabled={true} />
                        </FormField>
                        <FormField>
                            <textarea
                                defaultValue={getItemPropertyTranslation(
                                    targetLanguage,
                                    qAdditionalLanguages,
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
                </>
            )}
            {(item.type === IQuestionnaireItemType.text || item.type === IQuestionnaireItemType.string) &&
                getInitialText(item) && (
                    <>
                        <div className="translation-group-header">Initiell verdi</div>
                        <div className="translation-row">
                            <FormField>
                                <textarea defaultValue={getInitialText(item)} disabled={true} />
                            </FormField>
                            <FormField>
                                <textarea
                                    defaultValue={getItemPropertyTranslation(
                                        targetLanguage,
                                        qAdditionalLanguages,
                                        item.linkId,
                                        TranslatableItemProperty.initial,
                                    )}
                                    onBlur={(event) =>
                                        dispatchUpdateItemTranslation(
                                            event.target.value,
                                            TranslatableItemProperty.initial,
                                        )
                                    }
                                />
                            </FormField>
                        </div>
                    </>
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
