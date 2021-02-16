import { Items, OrderItem, TreeState } from '../store/treeStore/treeStore';
import { Bundle, Questionnaire, QuestionnaireItem } from '../types/fhir';
import { IExtentionType } from '../types/IQuestionnareItemType';

export const generateQuestionnaire = (state: TreeState): string => {
    const generateTree = (order: Array<OrderItem>, items: Items): Array<QuestionnaireItem> => {
        return order.map((x) => {
            return {
                ...items[x.linkId],
                item: generateTree(x.items, items),
            };
        });
    };

    function getTranslatedTexts(languageCode: string, orderItem: OrderItem, items: Items) {
        if (state.qAdditionalLanguages) {
            const currentItem = items[orderItem.linkId];
            const translatedText = state.qAdditionalLanguages[languageCode].items[orderItem.linkId].text;
            if (
                currentItem._text?.extension &&
                currentItem._text?.extension?.some((ext) => ext.url === IExtentionType.markdown)
            ) {
                const markdownExtension = currentItem._text?.extension?.find(
                    (ext) => ext.url === IExtentionType.markdown,
                ) || { url: IExtentionType.markdown };
                const otherExtensions = currentItem._text?.extension.filter(
                    (ext) => ext.url !== IExtentionType.markdown,
                );
                const translatedMarkdownExt = { ...markdownExtension, valueMarkdown: translatedText };

                return {
                    text: translatedText,
                    _text: { extension: [translatedMarkdownExt, ...otherExtensions] },
                };
            }
            return { text: translatedText };
        }
        return {};
    }

    const generateTreeWithTranslations = (
        order: Array<OrderItem>,
        items: Items,
        languageCode: string,
    ): Array<QuestionnaireItem> => {
        if (!state.qAdditionalLanguages) {
            return [];
        }
        return order.map((x) => {
            return {
                ...items[x.linkId],
                ...getTranslatedTexts(languageCode, x, items),
                item: generateTreeWithTranslations(x.items, items, languageCode),
            };
        });
    };

    function generateMainQuestionnaire(): Questionnaire {
        return {
            ...state.qMetadata,
            contained: state.qContained,
            resourceType: 'Questionnaire',
            status: 'draft',
            item: generateTree(state.qOrder, state.qItems),
        };
    }

    function generateTranslatedQuestionnaire(languageCode: string): Questionnaire {
        return {
            ...state.qMetadata,
            language: languageCode,
            contained: state.qContained,
            resourceType: 'Questionnaire',
            status: 'draft',
            item: generateTreeWithTranslations(state.qOrder, state.qItems, languageCode),
        };
    }

    function translateQuestionnaires(): Questionnaire[] {
        const questionnaires: Questionnaire[] = [];

        if (state.qAdditionalLanguages) {
            Object.keys(state.qAdditionalLanguages).forEach((languageCode) =>
                questionnaires.push(generateTranslatedQuestionnaire(languageCode)),
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
            entry: [generateMainQuestionnaire(), ...translateQuestionnaires()],
        };

        return JSON.stringify(bundle);
    }

    return JSON.stringify(generateMainQuestionnaire());
};
