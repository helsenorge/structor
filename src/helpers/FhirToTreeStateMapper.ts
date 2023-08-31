import {
    CodeStringValue,
    ContainedTranslations,
    Items,
    ItemTranslation,
    ItemTranslations,
    Languages,
    MetadataTranslations,
    OrderItem,
    SettingTranslations,
    SidebarItemTranslation,
    SidebarItemTranslations,
    Translation,
    TreeState,
} from '../store/treeStore/treeStore';
import { Bundle, Questionnaire, QuestionnaireItem, QuestionnaireItemAnswerOption, ValueSet } from '../types/fhir';

import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';
import { isSupportedLanguage, translatableMetadata, translatableSettings } from './LanguageHelper';
import { isItemControlSidebar } from './itemControl';
import {
    getInitialText,
    getMarkdownText,
    getPlaceHolderText,
    getSublabel,
    getRepeatsText,
    getValidationMessage,
    getPrefix,
} from './QuestionHelper';
import { IExtentionType } from '../types/IQuestionnareItemType';
import { initPredefinedValueSet } from './initPredefinedValueSet';
import { getValueSetValues } from './valueSetHelper';
import { addMetaSecurityIfDoesNotExist, addMetaSecurityIfCanBePerformedByExist } from './MetadataHelper';

function extractMetadata(questionnaireObj: Questionnaire) {
    const getMetadataParts = ({
        resourceType,
        language,
        id,
        name,
        title,
        description,
        version,
        status,
        publisher,
        meta,
        useContext,
        contact,
        subjectType,
        extension,
        purpose,
        copyright,
        date,
        url,
    }: IQuestionnaireMetadata) => ({
        resourceType,
        language,
        id,
        name,
        title,
        description,
        version,
        status,
        publisher,
        meta,
        useContext,
        contact,
        subjectType,
        extension,
        purpose,
        copyright,
        date,
        url,
    });
    return getMetadataParts(questionnaireObj);
}

function extractItemsAndOrder(item?: Array<QuestionnaireItem>): { qItems: Items; qOrder: Array<OrderItem> } {
    function mapToOrderItem(qItem: QuestionnaireItem, questionnaireItems: Items): OrderItem {
        let children: Array<OrderItem>;
        if (qItem.item !== undefined && qItem.item.length > 0) {
            children = qItem.item?.map((childItem: QuestionnaireItem) => {
                return mapToOrderItem(childItem, questionnaireItems);
            });
        } else {
            children = [];
        }

        const orderItem: OrderItem = {
            linkId: qItem.linkId,
            items: children,
        };

        // Order is handled by qOrder, removing child items
        delete qItem.item;
        questionnaireItems[qItem.linkId] = qItem;

        return orderItem;
    }

    const qItems: Items = {};
    const qOrder = item?.map((qItem) => {
        return mapToOrderItem(qItem, qItems);
    });

    return { qItems, qOrder: qOrder || [] };
}

function translateAnswerOptions(answerOptions?: QuestionnaireItemAnswerOption[]): CodeStringValue {
    const translatedAnswerOptions: CodeStringValue = {};
    answerOptions?.forEach((baseOption) => {
        if (baseOption.valueCoding && baseOption.valueCoding.code) {
            translatedAnswerOptions[baseOption.valueCoding.code] = baseOption.valueCoding.display || '';
        }
    });
    return translatedAnswerOptions;
}

function translateContained(base: Array<ValueSet>, translation: Array<ValueSet>): ContainedTranslations {
    if (!base || !translation) {
        return {};
    }
    const contained: ContainedTranslations = {};
    base.forEach((baseValueSet) => {
        const translatedValueSet = translation.find((x) => x.id === baseValueSet.id);
        if (baseValueSet.id && translatedValueSet) {
            const baseCodings = getValueSetValues(baseValueSet);
            const translationCodings = getValueSetValues(translatedValueSet);
            const concepts: CodeStringValue = {};
            baseCodings?.forEach((bConcept) => {
                const tConcept = translationCodings?.find(
                    (t) => t.code === bConcept.code && t.system === bConcept.system,
                );
                if (tConcept) {
                    concepts[tConcept.code || ''] = tConcept.display || '';
                }
            });
            contained[baseValueSet.id] = { concepts };
        }
    });
    return contained;
}

function translateItem(translationItem: QuestionnaireItem | undefined): ItemTranslation {
    const answerOptions = translateAnswerOptions(translationItem?.answerOption);
    const entryFormatText = getPlaceHolderText(translationItem);
    const markdownValue = translationItem?._text?.extension?.find(
        (ext) => ext.url === IExtentionType.markdown,
    )?.valueMarkdown;
    const text = markdownValue || translationItem?.text || '';
    const validationText = getValidationMessage(translationItem);
    const initial = getInitialText(translationItem);
    const sublabel = getSublabel(translationItem);
    const prefix = getPrefix(translationItem);
    const repeatsText = getRepeatsText(translationItem);
    return { answerOptions, entryFormatText, text, validationText, initial, sublabel, prefix, repeatsText };
}

function translateItems(
    baseItems: QuestionnaireItem[] | undefined,
    translationItems: QuestionnaireItem[] | undefined,
    items: ItemTranslations = {},
    sidebarItems: SidebarItemTranslations = {},
): { items: ItemTranslations; sidebarItems: SidebarItemTranslations } {
    baseItems?.forEach((baseItem) => {
        const translationItem = translationItems?.find((tItem) => tItem.linkId === baseItem.linkId);
        if (isItemControlSidebar(baseItem)) {
            sidebarItems[baseItem.linkId] = translateSidebarItem(translationItem);
        } else {
            items[baseItem.linkId] = translateItem(translationItem);
            translateItems(baseItem.item, translationItem?.item, items, sidebarItems);
        }
    });

    return { items, sidebarItems };
}

function translateMetadata(to: Questionnaire): MetadataTranslations {
    const translations: MetadataTranslations = {};
    translatableMetadata.forEach((prop) => {
        translations[prop.propertyName] = to[prop.propertyName] || '';
    });
    return translations;
}

function translateSidebarItem(translationItem: QuestionnaireItem | undefined): SidebarItemTranslation {
    const markdown = getMarkdownText(translationItem?._text?.extension);
    return { markdown };
}

function translateSettings(q: Questionnaire): SettingTranslations {
    const translations: SettingTranslations = {};
    Object.values(translatableSettings).forEach((ext) => {
        if (!ext) return;

        const extension = q.extension?.find((it) => it.url === ext.extension);
        if (extension) {
            translations[ext.extension] = extension;
        }
    });
    return translations;
}

export function translateQuestionnaire(mainQuestionnaire: Questionnaire, questionnaire: Questionnaire): Translation {
    const contained = translateContained(
        mainQuestionnaire.contained as Array<ValueSet>,
        questionnaire.contained as Array<ValueSet>,
    );
    const { items, sidebarItems } = translateItems(mainQuestionnaire.item, questionnaire.item);
    const metaData = translateMetadata(questionnaire);
    const settings = translateSettings(questionnaire);

    return { contained, items, metaData, sidebarItems, settings };
}

export function languageToIsoString(language: string): string {
    const parts = language.split('-');
    return `${parts[0]}-${parts[1].toUpperCase()}`;
}

function extractTranslations(bundle: Bundle): Languages {
    if (!bundle.entry || bundle.entry.length < 2) {
        return {};
    }
    const mainQuestionnaire = bundle.entry[0].resource as Questionnaire;
    const languages: Languages = {};
    bundle.entry.forEach((bundleEntry, index) => {
        const questionnaire = bundleEntry.resource as Questionnaire;
        if (
            index === 0 || // Skip first, as this is the main questionnaire
            !questionnaire.language ||
            questionnaire.language.toLowerCase() === mainQuestionnaire.language?.toLowerCase() ||
            !isSupportedLanguage(questionnaire.language)
        ) {
            if (index !== 0) {
                console.error(
                    `Skipping questionnaire with index ${index} and language '${questionnaire.language}' due to missing or unsupported language`,
                );
            }
            return;
        }
        languages[languageToIsoString(questionnaire.language)] = translateQuestionnaire(
            mainQuestionnaire,
            questionnaire,
        );
    });
    return languages;
}

export function mapToTreeState(resource: Bundle | Questionnaire): TreeState {
    let mainQuestionnaire: Questionnaire;
    let qAdditionalLanguages: Languages = {};
    if (resource.resourceType === 'Bundle' && resource.entry) {
        mainQuestionnaire = resource.entry[0].resource as Questionnaire;
        qAdditionalLanguages = extractTranslations(resource);
    } else {
        mainQuestionnaire = resource as Questionnaire;
    }
    mainQuestionnaire = addMetaSecurityIfDoesNotExist(mainQuestionnaire);
    mainQuestionnaire = addMetaSecurityIfCanBePerformedByExist(mainQuestionnaire);
    const qMetadata: IQuestionnaireMetadata = extractMetadata(mainQuestionnaire);
    const qContained = (mainQuestionnaire.contained as Array<ValueSet>) || []; // we expect contained to only contain ValueSets
    const { qItems, qOrder } = extractItemsAndOrder(mainQuestionnaire.item);

    // add missing initial value sets:
    initPredefinedValueSet.forEach((x) => {
        if (!qContained.find((contained) => contained.id === x.id)) {
            qContained.push(x);
        }
    });

    const newState: TreeState = {
        isDirty: false,
        qItems,
        qOrder,
        qMetadata,
        qContained,
        qAdditionalLanguages,
    };

    return newState;
}
