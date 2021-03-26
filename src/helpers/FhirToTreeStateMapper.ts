import {
    CodeStringValue,
    ContainedTranslations,
    Items,
    ItemTranslation,
    ItemTranslations,
    Languages,
    MetadataTranslations,
    OrderItem,
    SidebarItemTranslation,
    SidebarItemTranslations,
    Translation,
    TreeState,
} from '../store/treeStore/treeStore';
import {
    Bundle,
    Questionnaire,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    ValueSet,
    ValueSetComposeIncludeConcept,
} from '../types/fhir';

import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';
import { isSupportedLanguage, translatableMetadata } from './LanguageHelper';
import { isItemControlSidebar } from './itemControl';
import { getInitialText, getMarkdownText, getPlaceHolderText, getValidationMessage } from './QuestionHelper';

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
    });
    return getMetadataParts(questionnaireObj);
}

function extractItemsAndOrder(item?: Array<QuestionnaireItem>): { qItems: Items; qOrder: Array<OrderItem> } {
    function mapToOrderItem(qItem: QuestionnaireItem, qItems: Items): OrderItem {
        let children: Array<OrderItem>;
        if (qItem.item !== undefined && qItem.item.length > 0) {
            children = qItem.item?.map((childItem: QuestionnaireItem) => {
                return mapToOrderItem(childItem, qItems);
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
        qItems[qItem.linkId] = qItem;

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
    function getConcepts(valueSet: ValueSet): ValueSetComposeIncludeConcept[] | undefined {
        return valueSet.compose?.include[0].concept;
    }
    if (!base || !translation) {
        return {};
    }
    const contained: ContainedTranslations = {};
    base.forEach((baseValueSet) => {
        const translatedValueSet = translation.find((x) => x.id === baseValueSet.id);
        if (baseValueSet.id && translatedValueSet) {
            const baseConcepts = getConcepts(baseValueSet);
            const translationConcepts = getConcepts(translatedValueSet);
            const concepts: CodeStringValue = {};
            baseConcepts?.forEach((bConcept) => {
                const tConcept = translationConcepts?.find((t) => t.code === bConcept.code);
                if (tConcept) {
                    concepts[tConcept.code] = tConcept.display || '';
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
    const text = translationItem?.text || '';
    const validationText = getValidationMessage(translationItem);
    const initial = getInitialText(translationItem);
    return { answerOptions, entryFormatText, text, validationText, initial };
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
    const markdown = getMarkdownText(translationItem?.extension);
    return { markdown };
}

function translateQuestionnaire(mainQuestionnaire: Questionnaire, questionnaire: Questionnaire): Translation {
    const contained = translateContained(
        mainQuestionnaire.contained as Array<ValueSet>,
        questionnaire.contained as Array<ValueSet>,
    );
    const { items, sidebarItems } = translateItems(mainQuestionnaire.item, questionnaire.item);
    const metaData = translateMetadata(questionnaire);
    return { contained, items, metaData, sidebarItems };
}

function extractTranslations(bundle: Bundle): Languages {
    if (!bundle.entry || bundle.entry.length < 2) {
        return {};
    }
    const mainQuestionnaire = bundle.entry[0] as Questionnaire;
    const languages: Languages = {};
    bundle.entry.forEach((bundleEntry, index) => {
        const questionnaire = bundleEntry as Questionnaire;
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
        languages[questionnaire.language] = translateQuestionnaire(mainQuestionnaire, questionnaire);
    });
    return languages;
}

function mapToTreeState(resource: Bundle | Questionnaire): TreeState {
    let mainQuestionnaire: Questionnaire;
    let qAdditionalLanguages: Languages = {};
    if (resource.resourceType === 'Bundle' && resource.entry) {
        mainQuestionnaire = resource.entry[0] as Questionnaire;
        qAdditionalLanguages = extractTranslations(resource);
    } else {
        mainQuestionnaire = resource as Questionnaire;
    }

    const qMetadata: IQuestionnaireMetadata = extractMetadata(mainQuestionnaire);
    const qContained = mainQuestionnaire.contained as Array<ValueSet>; // we expect contained to only contain ValueSets
    const { qItems, qOrder } = extractItemsAndOrder(mainQuestionnaire.item);

    const newState: TreeState = {
        qItems,
        qOrder,
        qMetadata,
        qContained,
        qAdditionalLanguages,
    };

    return newState;
}

export default mapToTreeState;
