import { ActionType, Items } from "../store/treeStore/treeStore"

import {
    updateItemTranslationAction,
    updateMetadataTranslationAction,
    updateContainedValueSetTranslationAction,
    updateItemOptionTranslationAction,
    updateSidebarTranslationAction,
    updateItemCodeTranslation,
} from '../store/treeStore/treeActions';
import {
    TranslatableItemProperty,
    TranslatableKeyProptey,
    TranslatableMetadataProperty,
} from '../types/LanguageTypes';
import { IExtensionType } from '../types/IQuestionnareItemType';
import { isItemControlSidebar } from "./itemControl";
import Papa from "papaparse";

export const importCSV = (csvData: string, qItems: Items, dispatch: React.Dispatch<ActionType>): void => {
    const parsedCsv = Papa.parse(csvData, {skipEmptyLines: true});
    updateQuestionniareWithTranslation(parsedCsv.data as any[], parsedCsv.data[0] as any[], qItems, dispatch);
}

const updateQuestionniareWithTranslation = (translatableItems: any[], csvHeaders: string[], qItems: Items, dispatch: React.Dispatch<ActionType>) => {
    for (let languageIndex = 2; languageIndex < csvHeaders.length; languageIndex++) {
        const languageCode = csvHeaders[languageIndex];

        for (let itemIndex = 1; itemIndex < translatableItems.length; itemIndex++) {
            const key = translatableItems[itemIndex][0];
            const text = translatableItems[itemIndex][languageIndex];

            if (text !== null) {
                const itemUpdated = updateItemTranslation(key, languageCode, qItems, text, dispatch);
                if (itemUpdated) continue;

                const metadataUpdated = updateMetadataTranslation(key, languageCode, text, dispatch);
                if (metadataUpdated) continue;

                const valuesetUpdated = updateValueSetTranslation(key, languageCode, text, dispatch);
                if (valuesetUpdated) continue;

            }
        }
    }
};

const updateItemTranslation = (
    key: string,
    languageCode: string,
    qItems: Items,
    text: string,
    dispatch: React.Dispatch<ActionType>,
): boolean => {
    if (key.startsWith(TranslatableKeyProptey.item)) {
        const itemLinkId = key.split('[')[1].split(']')[0];

        if (key.includes(`.${TranslatableItemProperty.prefix}`)) {
            dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.prefix, text));
            return true;
        }
        if (key.includes(IExtensionType.validationtext)) {
            dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.validationText, text));
            return true;
        }
        if (key.includes(IExtensionType.sublabel)) {
            dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.sublabel, text));
            return true;
        }
        if (key.includes(IExtensionType.repeatstext)) {
            dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.repeatsText, text));
            return true;
        }
        if (key.includes(TranslatableItemProperty.initial)) {
            dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.initial, text));
            return true;
        }
        if (key.includes(IExtensionType.entryFormat)) {
            dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.entryFormatText, text));
            return true;
        }
        if (key.includes(`.${TranslatableKeyProptey.answerOption}`)) {
            const optionCode = key.split('[')[2].split(']')[0];

            dispatch(updateItemOptionTranslationAction(languageCode, itemLinkId, text, optionCode));
            return true;
        }
        if (isItemControlSidebar(qItems[itemLinkId])) {
            dispatch(updateSidebarTranslationAction(languageCode, itemLinkId, text));
            return true;
        }
        if(key.includes(`.${TranslatableItemProperty.code}`)){
            return updateCodeTranslation(key, languageCode, text, dispatch, qItems);
        }

        return false;
    }
    return false;
}

const updateMetadataTranslation = (
    key: string,
    languageCode: string,
    text: string,
    dispatch: React.Dispatch<ActionType>,
): boolean => {
    if (key.startsWith(TranslatableKeyProptey.metadata)) {
        if (key.includes(`.${TranslatableMetadataProperty.publisher}`)) {
            dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.publisher, text));
            return true;
        }
        if (key.includes(`.${TranslatableMetadataProperty.description}`)) {
            dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.description, text));
            return true;
        }
        if (key.includes(`.${TranslatableMetadataProperty.title}`)) {
            dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.title, text));
            return true;
        }
        if (key.includes(`.${TranslatableMetadataProperty.purpose}`)) {
            dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.purpose, text));
            return true;
        }
        if (key.includes(`.${TranslatableMetadataProperty.copyright}`)) {
            dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.copyright, text));
            return true;
        }
        return true;
    }
    return false;
}

const updateValueSetTranslation = (
    key: string,
    languageCode: string,
    text: string,
    dispatch: React.Dispatch<ActionType>,
): boolean => {
    if (key.startsWith(TranslatableKeyProptey.valueSet)) {
        const valueSetId = key.split('[')[1].split(']')[0];
        const conceptId = key.split('[')[3].split(']')[0];

        dispatch(updateContainedValueSetTranslationAction(languageCode, valueSetId, conceptId, text));
        return true;
    }
    return false;
}

const updateCodeTranslation = (key: string, languageCode: string, text: string, dispatch: React.Dispatch<ActionType>, qItems: Items): boolean => {
    if (key.startsWith(TranslatableKeyProptey.item)) {
        const itemLinkId = key.split('[')?.[1].split(']')?.[0];
        const system: string | undefined = key?.split('[')?.[2]?.split(']')?.[0];
        const code: string | undefined = key?.split('[')?.[3]?.split(']')?.[0];
        const item = qItems[itemLinkId];
        const currentCode = item?.code?.find((c) => c.system === system && c.code === code);

        if(currentCode )
        dispatch(updateItemCodeTranslation(languageCode, itemLinkId, text, currentCode));
        return true;
    }
    return false;
}