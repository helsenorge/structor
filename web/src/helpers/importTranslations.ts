import { ActionType, Items } from "../store/treeStore/treeStore"

import {
    updateItemTranslationAction,
    updateMetadataTranslationAction,
    updateContainedValueSetTranslationAction,
    updateItemOptionTranslationAction,
    updateSidebarTranslationAction,
} from '../store/treeStore/treeActions';
import {
    TranslatableItemProperty,
    TranslatableKeyProptey,
    TranslatableMetadataProperty,
} from '../types/LanguageTypes';
import { IExtentionType } from '../types/IQuestionnareItemType';
import { isItemControlSidebar } from "./itemControl";

export const importCSV = (scvData: string, qItems: Items, dispatch: React.Dispatch<ActionType>): void => {
    const result = convertCSVToJson(scvData);
    updateQuestionniareWithTranslation(result.translatableItems, result.headers, qItems, dispatch);
}

const convertCSVToJson = (csvData: string): {headers: any[], translatableItems: any[]} => {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const translatableItems = [];

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(",");
      if (currentLine.length === headers.length) {
        for (let j = 0; j < headers.length; j++) {             
          obj[headers[j]?.trim()] = currentLine[j]?.trim();
        }            
        translatableItems.push(obj);
      }
    }

    return {headers, translatableItems};
};

const updateQuestionniareWithTranslation = (translatableItems: any[], csvHeaders: string[], qItems: Items, dispatch: React.Dispatch<ActionType>) => {
    for (let languageIndex = 2; languageIndex < csvHeaders.length; languageIndex++) {
        const languageCode = csvHeaders[languageIndex];
        for (let itemIndex = 0; itemIndex < translatableItems.length; itemIndex++) {
            const key = translatableItems[itemIndex].key;
            const input = translatableItems[itemIndex][languageCode];
            if (input !== null && input.length >= 2 && input.charAt(0) === '\"' && input.charAt(input.length - 1) === '\"') {

                const text = input.substring(1, input.length - 1);

                if (key.startsWith(TranslatableKeyProptey.item)) {
                    const itemLinkId = key.split('[')[1].split(']')[0];

                    if (key.includes(`.${TranslatableItemProperty.prefix}`)) {
                        dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.prefix, text));
                        continue;
                    }
                    if (key.includes(IExtentionType.validationtext)) {
                        dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.validationText, text));
                        continue;
                    }
                    if (key.includes(IExtentionType.sublabel)) {
                        dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.sublabel, text));
                        continue;
                    }
                    if (key.includes(IExtentionType.repeatstext)) {
                        dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.repeatsText, text));
                        continue;
                    }
                    if (key.includes(TranslatableItemProperty.initial)) {
                        dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.initial, text));
                        continue;
                    }
                    if (key.includes(IExtentionType.entryFormat)) {
                        dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.entryFormatText, text));
                        continue;
                    }
                    if (key.includes(`.${TranslatableKeyProptey.answerOption}`)) {
                        const optionCode = key.split('[')[2].split(']')[0];

                        dispatch(updateItemOptionTranslationAction(languageCode, itemLinkId, text, optionCode));
                        continue;
                    }
                    if (isItemControlSidebar(qItems[itemLinkId])) {
                        dispatch(updateSidebarTranslationAction(languageCode, itemLinkId, text));
                        continue;
                    }
                    dispatch(updateItemTranslationAction(languageCode, itemLinkId, TranslatableItemProperty.text, text));                 
                }

                if (key.startsWith(TranslatableKeyProptey.metadata)) {
                    if (key.includes(`.${TranslatableMetadataProperty.publisher}`)) {
                        dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.publisher, text));
                        continue;
                    }
                    if (key.includes(`.${TranslatableMetadataProperty.description}`)) {
                        dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.description, text));
                        continue;
                    }
                    if (key.includes(`.${TranslatableMetadataProperty.title}`)) {
                        dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.title, text));
                        continue;
                    }
                    if (key.includes(`.${TranslatableMetadataProperty.purpose}`)) {
                        dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.purpose, text));
                        continue;
                    }
                    if (key.includes(`.${TranslatableMetadataProperty.copyright}`)) {
                        dispatch(updateMetadataTranslationAction(languageCode, TranslatableMetadataProperty.copyright, text));
                        continue;
                    }
                    continue;
                }

                if (key.startsWith(TranslatableKeyProptey.valueSet)) {
                    const valueSetId = key.split('[')[1].split(']')[0];
                    const conceptId = key.split('[')[3].split(']')[0];

                    dispatch(updateContainedValueSetTranslationAction(languageCode, valueSetId, conceptId, text));
                    continue;
                }
            }
        }
    }
};
