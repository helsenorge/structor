import { translatableMetadata } from './LanguageHelper';
import { IQuestionnaireMetadata } from '../types/IQuestionnaireMetadataType';
import { Items, Languages } from '../store/treeStore/treeStore';
import { isItemControlSidebar } from './itemControl';
import { IExtentionType } from '../types/IQuestionnareItemType';
import {
    getInitialText,
    getPlaceHolderText,
    getPrefix,
    getRepeatsText,
    getSublabel,
    getValidationMessage,
} from './QuestionHelper';
import { ValueSet } from '../types/fhir';
import { getValueSetValues } from './valueSetHelper';
import { TranslatableKeyProptey, TranslatableItemProperty } from '../types/LanguageTypes';
import { getTextExtensionMarkdown } from '../utils/validationUtils';
import Papa, { UnparseConfig } from "papaparse";

export const exportTranslations = (
    qMetadata: IQuestionnaireMetadata,
    qItems: Items,
    valueSetsToTranslate: ValueSet[],
    additionalLanguagesInUse: string[],
    qAdditionalLanguages: Languages | undefined,
): void => {
    const additionalLanguages = qAdditionalLanguages || {};
    const header = ['key', qMetadata.language, ...additionalLanguagesInUse] as string[];
    const papaparseConfig = {
        quoteChar: '"',
        escapeChar: '"',
        delimiter: "|",
        newline: "\r\n",
    } as UnparseConfig;


    let data: string[][] = [];
    // add metadata translations: all fields from translatableMetadata.
    exportMetadataTranslations(qMetadata, additionalLanguagesInUse, additionalLanguages, data);

    // add predefined valueset translations
    exportPredefinedValueSets(valueSetsToTranslate, additionalLanguagesInUse, additionalLanguages, data);

    // add item translations: text/_text, sublabel, repeatsText, validationMessage, placeholderText, initial, answerOption.display
    exportItemTranslations(qItems, additionalLanguagesInUse, additionalLanguages, data);
    
    const csv = Papa.unparse({fields: header, data}, papaparseConfig);
    const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.download = `${qMetadata.name}.csv`;
    a.href = window.URL.createObjectURL(csvData);
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const exportMetadataTranslations = (
    qMetadata: IQuestionnaireMetadata,
    additionalLanguagesInUse: string[],
    additionalLanguages: Languages,
    data: string[][],
) => {
    translatableMetadata.forEach((prop) => {
        const translatedValues = additionalLanguagesInUse.map((lang) => {
            return additionalLanguages[lang].metaData[prop.propertyName];
        });
        const key = `${TranslatableKeyProptey.metadata}.${prop.propertyName}`;
        data.push([key, qMetadata[prop.propertyName], ...translatedValues] as string[]);
    });
};

const exportPredefinedValueSets = (
    valueSetsToTranslate: ValueSet[],
    additionalLanguagesInUse: string[],
    additionalLanguages: Languages,
    data: string[][],
) => {
    if (valueSetsToTranslate.length > 0) {
        // for each valueset, for each row, add one translation row
        valueSetsToTranslate.forEach((valueSet) => {
            getValueSetValues(valueSet).forEach((coding) => {
                const translatedValues = additionalLanguagesInUse.map((lang) => {
                    return additionalLanguages[lang]?.contained[valueSet.id || '']?.concepts[coding.code || ''];
                });
                const key = `${TranslatableKeyProptey.valueSet}[${valueSet.id}][${coding.system}][${coding.code}].display`;
                data.push([key, coding.display, ...translatedValues] as string[]);
            });
        });
    }
};

const exportItemTranslations = (
    qItems: Items,
    additionalLanguagesInUse: string[],
    additionalLanguages: Languages,
    data: string[][],
) => {
    Object.keys(qItems).forEach((linkId) => {
        const item = qItems[linkId];

        if (item._text) {
            const translatedValues: Array<string | undefined> = [];
            if (isItemControlSidebar(item)) {
                translatedValues.push(
                    ...additionalLanguagesInUse.map((lang) => {
                        return additionalLanguages[lang].sidebarItems[linkId]?.markdown;
                    }),
                );
            } else {
                translatedValues.push(
                    ...additionalLanguagesInUse.map((lang) => {
                        return additionalLanguages[lang].items[linkId]?.text;
                    }),
                );
            }

            const markdownValue = getTextExtensionMarkdown(item);
            const key = `${TranslatableKeyProptey.item}[${linkId}]._text.extension[${IExtentionType.markdown}].valueMarkdown`;
            data.push([key, markdownValue, ...translatedValues] as string[]);
        } else {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.text;
            });
            const key = `${TranslatableKeyProptey.item}[${linkId}].text`;
            data.push([key, item.text, ...translatedValues] as string[]);
        }

        if (getSublabel(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.sublabel;
            });
            const key = `${TranslatableKeyProptey.item}[${linkId}].extension[${IExtentionType.sublabel}].valueMarkdown`;
            data.push([key, getSublabel(item), ...translatedValues] as string[]);          
        }

        if (getRepeatsText(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.repeatsText;
            });
            const key = `${TranslatableKeyProptey.item}[${linkId}].extension[${IExtentionType.repeatstext}].valueString`;
            data.push([key, getRepeatsText(item), ...translatedValues] as string[]);            
        }

        if (getValidationMessage(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.validationText;
            });
            const key = `${TranslatableKeyProptey.item}[${linkId}].extension[${IExtentionType.validationtext}].valueString`;
            data.push([key, getValidationMessage(item), ...translatedValues] as string[]);            
        }

        if (getPlaceHolderText(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.entryFormatText;
            });
            const key = `${TranslatableKeyProptey.item}[${linkId}].extension[${IExtentionType.entryFormat}].valueString`;
            data.push([key, getPlaceHolderText(item), ...translatedValues] as string[]);            
        }

        if (getInitialText(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.initial;
            });
            const key = `${TranslatableKeyProptey.item}[${linkId}].${TranslatableItemProperty.initial}[0].valueString`;
            data.push([key, getInitialText(item), ...translatedValues] as string[]);            
        }

        if (getPrefix(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.prefix;
            });
            const key = `${TranslatableKeyProptey.item}[${linkId}].${TranslatableItemProperty.prefix}`;
            data.push([key, getPrefix(item), ...translatedValues] as string[]);            
        }

        if (item.answerOption) {
            const translatedOptions = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.answerOptions;
            });
            item.answerOption.forEach((x) => {
                const key = `${TranslatableKeyProptey.item}[${linkId}].answerOption[${x.valueCoding?.code}].display`;
                data.push([
                    key,
                    x.valueCoding?.display,
                    ...translatedOptions.map((y) => y && y[x.valueCoding?.code || '']),
                ] as string[]);
            });
        }
    });
};
