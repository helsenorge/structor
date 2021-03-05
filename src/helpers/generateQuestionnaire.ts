import { CodeStringValue, Items, Languages, OrderItem, Translation, TreeState } from '../store/treeStore/treeStore';
import {
    Bundle,
    Extension,
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    ValueSet,
} from '../types/fhir';
import { IExtentionType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';
import { getLanguageFromCode, translatableMetadata } from './LanguageHelper';
import { isItemControlSidebar } from './itemControl';

const getExtension = (extensions: Extension[] | undefined, extensionType: IExtentionType): Extension | undefined => {
    return extensions?.find((ext) => ext.url === extensionType);
};

const updateTranslatedExtension = (
    extensions: Extension[] | undefined,
    translatedExtension: Extension,
): Extension[] => {
    if (!extensions) {
        return [translatedExtension];
    }
    const translatedExtensions = [...extensions];
    const replaceIndex = translatedExtensions.findIndex((ext) => ext.url === translatedExtension.url);
    if (replaceIndex > -1) {
        translatedExtensions.splice(replaceIndex, 1, translatedExtension);
    }
    return translatedExtensions;
};

const getTranslatedAnswerOptions = (
    answerOptions: QuestionnaireItemAnswerOption[] | undefined,
    optionTranslations: CodeStringValue | undefined,
): QuestionnaireItemAnswerOption[] | undefined => {
    if (!answerOptions) {
        return undefined;
    }

    return answerOptions.map((answerOption) => {
        const code = answerOption.valueCoding?.code;
        const display = code && optionTranslations ? optionTranslations[code] || '' : '';
        return {
            valueCoding: { ...answerOption.valueCoding, display },
        };
    });
};

const getTranslatedContained = (qContained: Array<ValueSet> | undefined, translation: Translation) => {
    if (!qContained || qContained.length < 1) {
        return [];
    }

    return qContained.map((valueSet) => {
        if (!valueSet.compose?.include || !valueSet.compose.include[0].concept) {
            return valueSet;
        }

        const concept = valueSet.compose.include[0].concept.map((c) => {
            const translatedValue = valueSet.id ? translation.contained[valueSet.id].concepts[c.code] : '';
            return { ...c, display: translatedValue };
        });

        return {
            ...valueSet,
            compose: { ...valueSet.compose, include: [{ ...valueSet.compose.include[0], concept }] },
        };
    });
};

const getTranslatedSidebarItem = (translation: Translation, currentItem: QuestionnaireItem) => {
    const sidebarItemTranslation = translation?.sidebarItems[currentItem.linkId];
    let _text = undefined;
    const translatedText = sidebarItemTranslation.markdown;
    const markdownExtension = getExtension(currentItem._text?.extension, IExtentionType.markdown);
    if (markdownExtension) {
        const translatedMarkdownExtension = { ...markdownExtension, valueMarkdown: translatedText };
        _text = { extension: updateTranslatedExtension(currentItem._text?.extension, translatedMarkdownExtension) };
    }
    return { ...currentItem, _text };
};

const getTranslatedItem = (languageCode: string, orderItem: OrderItem, items: Items, languages: Languages) => {
    const currentItem = items[orderItem.linkId];
    if (isItemControlSidebar(currentItem)) {
        return getTranslatedSidebarItem(languages[languageCode], currentItem);
    }

    const itemTranslation = languages[languageCode].items[orderItem.linkId];

    // TODO i18n håndtere hvis ingen oversettelse finnes
    // item.text
    let _text = undefined;
    const translatedText = itemTranslation.text;
    const markdownExtension = getExtension(currentItem._text?.extension, IExtentionType.markdown);
    if (markdownExtension) {
        const translatedMarkdownExtension = { ...markdownExtension, valueMarkdown: translatedText };
        _text = { extension: updateTranslatedExtension(currentItem._text?.extension, translatedMarkdownExtension) };
    }

    let extension = undefined;
    if (currentItem.extension) {
        extension = [...currentItem.extension];
    }

    // ValidationMessage
    const validationTextExtension = getExtension(extension, IExtentionType.validationtext);
    if (validationTextExtension) {
        const translatedValidationTextExtension = {
            ...validationTextExtension,
            valueString: itemTranslation.validationText,
        };
        extension = updateTranslatedExtension(extension, translatedValidationTextExtension);
    }

    // Placeholder
    const entryFormatExtension = getExtension(extension, IExtentionType.entryFormat);
    if (entryFormatExtension) {
        const translatedEntryFormatExtension = {
            ...entryFormatExtension,
            valueString: itemTranslation.entryFormatText,
        };
        extension = updateTranslatedExtension(extension, translatedEntryFormatExtension);
    }

    const answerOption = getTranslatedAnswerOptions(currentItem.answerOption, itemTranslation.answerOptions);

    return { ...currentItem, text: translatedText, _text, extension, answerOption };
};

const getTranslatedMetadata = (qMetadata: IQuestionnaireMetadata, translation: Translation): IQuestionnaireMetadata => {
    const translatedMetadata: IQuestionnaireMetadata = {};
    translatableMetadata.forEach((metadataProperty) => {
        translatedMetadata[metadataProperty.propertyName] = translation.metaData[metadataProperty.propertyName];
    });
    return { ...qMetadata, ...translatedMetadata };
};

function getLanguageData(qMetadata: IQuestionnaireMetadata, languageCode: string) {
    const tag = qMetadata.meta?.tag;
    if (!tag || !tag[0]) {
        return { language: languageCode };
    }
    return {
        language: languageCode,
        meta: {
            ...qMetadata.meta,
            tag: [{ ...tag[0], code: languageCode, display: getLanguageFromCode(languageCode)?.localDisplay }],
        },
    };
}

const generateTree = (order: Array<OrderItem>, items: Items): Array<QuestionnaireItem> => {
    return order.map((x) => {
        return {
            ...items[x.linkId],
            item: generateTree(x.items, items),
        };
    });
};

const generateTreeWithTranslations = (
    order: Array<OrderItem>,
    items: Items,
    languageCode: string,
    languages: Languages,
): Array<QuestionnaireItem> => {
    return order.map((x) => {
        return {
            ...items[x.linkId],
            ...getTranslatedItem(languageCode, x, items, languages),
            item: generateTreeWithTranslations(x.items, items, languageCode, languages),
        };
    });
};

const generateMainQuestionnaire = (state: TreeState): Questionnaire => ({
    ...state.qMetadata,
    contained: state.qContained,
    resourceType: 'Questionnaire',
    status: 'draft',
    item: generateTree(state.qOrder, state.qItems),
});

const generateTranslatedQuestionnaire = (
    state: TreeState,
    languageCode: string,
    languages: Languages,
): Questionnaire => ({
    ...getTranslatedMetadata(state.qMetadata, languages[languageCode]),
    ...getLanguageData(state.qMetadata, languageCode),
    contained: getTranslatedContained(state.qContained, languages[languageCode]),
    resourceType: 'Questionnaire',
    status: 'draft',
    item: generateTreeWithTranslations(state.qOrder, state.qItems, languageCode, languages),
});

export const generateQuestionnaire = (state: TreeState): string => {
    function translateQuestionnaires(): Questionnaire[] {
        const questionnaires: Questionnaire[] = [];

        const { qAdditionalLanguages } = state;
        if (qAdditionalLanguages) {
            Object.keys(qAdditionalLanguages).forEach((languageCode) =>
                questionnaires.push(generateTranslatedQuestionnaire(state, languageCode, qAdditionalLanguages)),
            );
        }
        return questionnaires;
    }

    // Return bundle if translations exist
    if (state.qAdditionalLanguages && Object.keys(state.qAdditionalLanguages).length > 0) {
        const bundle: Bundle = {
            resourceType: 'Bundle',
            type: 'searchset',
            total: Object.keys(state.qAdditionalLanguages).length + 1,
            entry: [generateMainQuestionnaire(state), ...translateQuestionnaires()],
        };

        return JSON.stringify(bundle);
    }

    return JSON.stringify(generateMainQuestionnaire(state));
};

export const generateQuestionnaireForPreview = (state: TreeState, language?: string): string => {
    const { qAdditionalLanguages } = state;
    if (language && qAdditionalLanguages && qAdditionalLanguages[language]) {
        return JSON.stringify(generateTranslatedQuestionnaire(state, language, qAdditionalLanguages));
    }
    return JSON.stringify(generateMainQuestionnaire(state));
};
