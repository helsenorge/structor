import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateItemOptionTranslationAction, updateItemTranslationAction } from '../../../store/treeStore/treeActions';
import { ItemTranslation, TreeContext } from '../../../store/treeStore/treeStore';
import TranslateOptionRow from './TranslateOptionRow';
import {
    getInitialText,
    getPlaceHolderText,
    getPrefix,
    getRepeatsText,
    getSublabel,
    getValidationMessage,
} from '../../../helpers/QuestionHelper';
import { getItemPropertyTranslation } from '../../../helpers/LanguageHelper';
import { TranslatableItemProperty } from '../../../types/LanguageTypes';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { getTextExtensionMarkdown } from '../../../utils/translationUtils';

type TranslationRowProps = {
    targetLanguage: string;
    item: QuestionnaireItem;
    itemHeading: string;
};

const TranslateItemRow = ({ targetLanguage, item, itemHeading }: TranslationRowProps): JSX.Element => {
    const { t } = useTranslation();
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
                <div className={!itemTranslation.text?.trim() ?  "validation-error" : "validation-warning"}>
                    <MarkdownEditor
                        data={translatedText}
                        onBlur={(text) => dispatchUpdateItemTranslation(text, TranslatableItemProperty.text)}
                    />
                </div>                
            );
        }
        return (
            <textarea
                value={translatedText}
                className={!itemTranslation.text?.trim() ?  "validation-error" : ""}
                onChange={(e) => setTranslatedText(e.target.value)}
                onBlur={(e) => dispatchUpdateItemTranslation(e.target.value, TranslatableItemProperty.text)}
            />
        );
    }

    function getReadOnlyInputField(): JSX.Element {
        if (isMarkdown) {
            const valueMarkdown = getTextExtensionMarkdown(item);
            return <MarkdownEditor data={valueMarkdown || item.text || ''} disabled={true} />;
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

    function getTranslatableField(
        header: string,
        textValue: string,
        propertyName: TranslatableItemProperty,
        isMarkdownField: boolean,
    ): JSX.Element {
        const itemPropertyTranslation = getItemPropertyTranslation(
            targetLanguage,
            qAdditionalLanguages,
            item.linkId,
            propertyName,
        );
        return (
            <>
                <div className="translation-group-header">{header}</div>
                <div className="translation-row">
                    <FormField>
                        {isMarkdownField ? (
                            <MarkdownEditor data={textValue} disabled={true} />
                        ) : (
                            <textarea defaultValue={textValue} disabled={true} />
                        )}
                    </FormField>
                    <FormField>
                        {isMarkdownField ? (
                            <div className={!itemPropertyTranslation?.trim() ?  "validation-error" : "validation-warning"}>
                                <MarkdownEditor
                                    data={itemPropertyTranslation}
                                    onBlur={(newValue: string) => dispatchUpdateItemTranslation(newValue, propertyName)}
                                />
                            </div>                            
                        ) : (
                            <textarea
                                className={!itemPropertyTranslation?.trim() ?  "validation-error" : ""}
                                defaultValue={itemPropertyTranslation}
                                onBlur={(event) => dispatchUpdateItemTranslation(event.target.value, propertyName)}
                            />
                        )}
                    </FormField>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="translation-group-header">{itemHeading}</div>
            <div className="translation-row">
                <FormField>{getReadOnlyInputField()}</FormField>
                <FormField>{getInputField()}</FormField>
            </div>
            {getSublabel(item) &&
                getTranslatableField(t('Sublabel'), getSublabel(item), TranslatableItemProperty.sublabel, true)}
            {getRepeatsText(item) &&
                getTranslatableField(
                    t('Repeat button text'),
                    getRepeatsText(item),
                    TranslatableItemProperty.repeatsText,
                    false,
                )}
            {getValidationMessage(item) &&
                getTranslatableField(
                    t('Error message for validation error'),
                    getValidationMessage(item),
                    TranslatableItemProperty.validationText,
                    false,
                )}
            {getPlaceHolderText(item) &&
                getTranslatableField(
                    t('Placeholder text'),
                    getPlaceHolderText(item),
                    TranslatableItemProperty.entryFormatText,
                    false,
                )}
            {getPrefix(item) &&
                getTranslatableField(t('Prefix'), getPrefix(item), TranslatableItemProperty.prefix, false)}
            {(item.type === IQuestionnaireItemType.text || item.type === IQuestionnaireItemType.string) &&
                getInitialText(item) &&
                getTranslatableField(t('Initial value'), getInitialText(item), TranslatableItemProperty.initial, false)}

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
