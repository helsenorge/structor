import { Items, Languages, OrderItem, TreeState } from '../store/treeStore/treeStore';
import { Bundle, Questionnaire, QuestionnaireItem } from '../types/fhir';
import { IExtentionType } from '../types/IQuestionnareItemType';

const getTranslatedTexts = (languageCode: string, orderItem: OrderItem, items: Items, languages: Languages) => {
    const currentItem = items[orderItem.linkId];
    const translatedText = languages[languageCode].items[orderItem.linkId].text;
    if (
        currentItem._text?.extension &&
        currentItem._text?.extension?.some((ext) => ext.url === IExtentionType.markdown)
    ) {
        const markdownExtension = currentItem._text?.extension?.find((ext) => ext.url === IExtentionType.markdown) || {
            url: IExtentionType.markdown,
        };
        const otherExtensions = currentItem._text?.extension.filter((ext) => ext.url !== IExtentionType.markdown);
        const translatedMarkdownExt = { ...markdownExtension, valueMarkdown: translatedText };

        return {
            text: translatedText,
            _text: { extension: [translatedMarkdownExt, ...otherExtensions] },
        };
    }
    return { text: translatedText };
};

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
            ...getTranslatedTexts(languageCode, x, items, languages),
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
    ...state.qMetadata,
    language: languageCode,
    contained: state.qContained,
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
