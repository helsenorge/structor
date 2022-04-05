import { CodeStringValue, Items, Languages, OrderItem, Translation, TreeState } from '../store/treeStore/treeStore';
import {
    Bundle,
    Extension,
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    QuestionnaireItemInitial,
    ValueSet,
} from '../types/fhir';
import { IExtentionType, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';
import { getLanguageFromCode, translatableMetadata, translatableSettings } from './LanguageHelper';
import { isItemControlSidebar } from './itemControl';
import { emptyPropertyReplacer } from './emptyPropertyReplacer';
import { FhirpathAgeExpression, FhirpathGenderExpression } from './EnrichmentSet';
import { getValueSetValues } from './valueSetHelper';

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
        if (getValueSetValues(valueSet).length === 0) {
            return valueSet;
        }

        const includes = valueSet.compose?.include.map((include) => {
            return {
                ...include,
                concept: include.concept?.map((c) => {
                    const translatedValue =
                        valueSet.id && translation.contained[valueSet.id]
                            ? translation.contained[valueSet.id].concepts[c.code]
                            : '';
                    return { ...c, display: translatedValue };
                }),
            };
        });

        return {
            ...valueSet,
            compose: { ...valueSet.compose, include: includes },
        };
    });
};

const getTranslatedSidebarItem = (translation: Translation, currentItem: QuestionnaireItem) => {
    const sidebarItemTranslation = translation?.sidebarItems[currentItem.linkId];
    let _text = undefined;

    // Set text to an emty sting if translation is not set
    const translatedText =
        sidebarItemTranslation && sidebarItemTranslation.markdown ? sidebarItemTranslation.markdown : '';
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

    // item.text
    let _text = undefined;
    const translatedText = itemTranslation?.text;
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
            valueString: itemTranslation?.validationText,
        };
        extension = updateTranslatedExtension(extension, translatedValidationTextExtension);
    }

    // Placeholder
    const entryFormatExtension = getExtension(extension, IExtentionType.entryFormat);
    if (entryFormatExtension) {
        const translatedEntryFormatExtension = {
            ...entryFormatExtension,
            valueString: itemTranslation?.entryFormatText,
        };
        extension = updateTranslatedExtension(extension, translatedEntryFormatExtension);
    }

    // Sublabel
    const sublabelExtension = getExtension(extension, IExtentionType.sublabel);
    if (sublabelExtension) {
        const translatedSublabelExtension = {
            ...sublabelExtension,
            valueMarkdown: itemTranslation?.sublabel,
        };
        extension = updateTranslatedExtension(extension, translatedSublabelExtension);
    }

    // Repeatstext
    const repeatsTextExtension = getExtension(extension, IExtentionType.repeatstext);
    if (repeatsTextExtension) {
        const translatedRepeatsTextExtension = {
            ...repeatsTextExtension,
            valueString: itemTranslation?.repeatsText,
        };
        extension = updateTranslatedExtension(extension, translatedRepeatsTextExtension);
    }

    const answerOption = getTranslatedAnswerOptions(currentItem.answerOption, itemTranslation?.answerOptions);
    const prefix = itemTranslation?.prefix || '';
    const initial =
        (currentItem.type === IQuestionnaireItemType.text || currentItem.type === IQuestionnaireItemType.string) &&
        itemTranslation?.initial
            ? [{ valueString: itemTranslation?.initial }]
            : currentItem.initial;

    return { ...currentItem, text: translatedText, _text, extension, answerOption, prefix, initial };
};

const getTranslatedMetadata = (qMetadata: IQuestionnaireMetadata, translation: Translation): IQuestionnaireMetadata => {
    const translatedMetadata: IQuestionnaireMetadata = {};
    translatableMetadata.forEach((metadataProperty) => {
        translatedMetadata[metadataProperty.propertyName] = translation.metaData[metadataProperty.propertyName];
    });
    return {
        ...qMetadata,
        ...translatedMetadata,
        extension: getTranslatedExtensions(qMetadata, translation),
    };
};

const getTranslatedExtensions = (qMetadata: IQuestionnaireMetadata, translation: Translation): Array<Extension> => {
    const translatedSettings = translation.settings;
    const extensions = [];
    for (const e of qMetadata.extension || []) {
        const translatable = translatableSettings[e.url as IExtentionType];
        if (translatable) continue;

        extensions.push(e);
    }

    // look for translated extensions that might not have an equal in the original
    for (const extensionUrl in translatedSettings) {
        extensions.push(translatedSettings[extensionUrl]);
    }

    return extensions;
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

export const generateMainQuestionnaire = (state: TreeState): Questionnaire => {
    const usedValueSet = getUsedValueSet(state);
    return {
        ...state.qMetadata,
        contained: state.qContained?.filter((x) => x.id && usedValueSet?.includes(x.id) && x) as ValueSet[],
        resourceType: 'Questionnaire',
        status: state.qMetadata.status || 'draft',
        item: generateTree(state.qOrder, state.qItems),
    };
};

const generateTranslatedQuestionnaire = (
    state: TreeState,
    languageCode: string,
    languages: Languages,
): Questionnaire => {
    const usedValueSet = getUsedValueSet(state);
    return {
        ...getTranslatedMetadata(state.qMetadata, languages[languageCode]),
        ...getLanguageData(state.qMetadata, languageCode),
        contained: getTranslatedContained(state.qContained, languages[languageCode]).filter(
            (x) => x.id && usedValueSet?.includes(x.id),
        ),
        resourceType: 'Questionnaire',
        status: state.qMetadata.status || 'draft',
        item: generateTreeWithTranslations(state.qOrder, state.qItems, languageCode, languages),
    };
};

export function getUsedValueSet(state: TreeState): string[] {
    const allValueSets = [] as string[];
    Object.keys(state.qItems).forEach(function (linkId) {
        const item = state.qItems[linkId];
        if (item.type && item.answerValueSet) {
            allValueSets.push(item.answerValueSet?.slice(1));
        }
    });

    return Array.from(new Set(allValueSets));
}

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
            entry: [
                { resource: generateMainQuestionnaire(state) },
                ...translateQuestionnaires().map((q) => {
                    return { resource: q };
                }),
            ],
        };

        return JSON.stringify(bundle, emptyPropertyReplacer);
    }

    return JSON.stringify(generateMainQuestionnaire(state), emptyPropertyReplacer);
};

const setEnrichmentValues = (
    items: QuestionnaireItem[],
    replacementValues: {
        expression: string;
        initialValue: QuestionnaireItemInitial;
    }[],
) => {
    items.forEach((qItem) => {
        (qItem.extension || []).forEach((extension) => {
            replacementValues.forEach((replacementValue) => {
                if (
                    extension.url === IExtentionType.fhirPath &&
                    extension.valueString?.replace(' ', '') === replacementValue.expression.replace(' ', '')
                ) {
                    qItem.initial = [replacementValue.initialValue];
                }
            });
        });
        setEnrichmentValues(qItem.item || [], replacementValues);
    });
};

export const generateQuestionnaireForPreview = (
    state: TreeState,
    language?: string,
    selectedGender?: string,
    selectedAge?: string,
): Questionnaire => {
    const { qAdditionalLanguages } = state;
    const questionnaire =
        language && qAdditionalLanguages && qAdditionalLanguages[language]
            ? generateTranslatedQuestionnaire(state, language, qAdditionalLanguages)
            : generateMainQuestionnaire(state);

    // replace enrichment values with inital values set in preview:
    const enrichmentValues = [];
    if (selectedGender) {
        enrichmentValues.push({
            expression: FhirpathGenderExpression,
            initialValue: { valueString: selectedGender },
        });
    }
    if (selectedAge) {
        enrichmentValues.push({
            expression: FhirpathAgeExpression,
            initialValue: { valueInteger: parseInt(selectedAge) },
        });
    }

    setEnrichmentValues(questionnaire.item || [], enrichmentValues);

    return questionnaire;
};
