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

export const exportTranslations = (
    qMetadata: IQuestionnaireMetadata,
    qItems: Items,
    valueSetsToTranslate: ValueSet[],
    additionalLanguagesInUse: string[],
    qAdditionalLanguages: Languages | undefined,
): void => {
    let returnString = `key,${[qMetadata.language, ...additionalLanguagesInUse]}\n`;
    const additionalLanguages = qAdditionalLanguages || {};

    // add metadata translations: all fields from translatableMetadata.
    returnString = returnString + exportMetadataTranslations(qMetadata, additionalLanguagesInUse, additionalLanguages);

    // add predefined valueset translations
    returnString =
        returnString + exportPredefinedValueSets(valueSetsToTranslate, additionalLanguagesInUse, additionalLanguages);

    // add item translations: text/_text, sublabel, repeatsText, validationMessage, placeholderText, initial, answerOption.display
    returnString = returnString + exportItemTranslations(qItems, additionalLanguagesInUse, additionalLanguages);

    const a = document.createElement('a');
    a.download = `${qMetadata.name}.csv`;
    a.href = 'data:' + 'text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(returnString);
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const exportMetadataTranslations = (
    qMetadata: IQuestionnaireMetadata,
    additionalLanguagesInUse: string[],
    additionalLanguages: Languages,
): string => {
    let returnString = '';
    translatableMetadata.forEach((prop) => {
        const translatedValues = additionalLanguagesInUse.map((lang) => {
            return additionalLanguages[lang].metaData[prop.propertyName];
        });
        const stringValues = escapeValues([qMetadata[prop.propertyName], ...translatedValues]);
        returnString = returnString + `metadata.${prop.propertyName},${stringValues}\n`;
    });
    return returnString;
};

const exportPredefinedValueSets = (
    valueSetsToTranslate: ValueSet[],
    additionalLanguagesInUse: string[],
    additionalLanguages: Languages,
): string => {
    let returnString = '';
    if (valueSetsToTranslate.length > 0) {
        // for each valueset, for each row, add one translation row
        valueSetsToTranslate.forEach((valueSet) => {
            getValueSetValues(valueSet).forEach((coding) => {
                const translatedValues = additionalLanguagesInUse.map((lang) => {
                    return additionalLanguages[lang].contained[valueSet.id || ''].concepts[coding.code || ''];
                });
                const stringValues = escapeValues([coding.display, ...translatedValues]);

                returnString =
                    returnString +
                    `valueSet[${valueSet.id}][${coding.system}][${coding.code}].display,${stringValues}\n`;
            });
        });
    }
    return returnString;
};

const exportItemTranslations = (
    qItems: Items,
    additionalLanguagesInUse: string[],
    additionalLanguages: Languages,
): string => {
    let returnString = '';
    Object.keys(qItems).forEach((linkId) => {
        const item = qItems[linkId];

        if (item._text) {
            const translatedValues: Array<string | undefined> = [];
            if (isItemControlSidebar(item)) {
                translatedValues.push(
                    ...additionalLanguagesInUse.map((lang) => {
                        return additionalLanguages[lang].sidebarItems[linkId].markdown;
                    }),
                );
            } else {
                translatedValues.push(
                    ...additionalLanguagesInUse.map((lang) => {
                        return additionalLanguages[lang].items[linkId].text;
                    }),
                );
            }

            const markdownValue = item._text?.extension?.find(
                (extension) => extension.url === IExtentionType.markdown,
            )?.valueMarkdown;
            const stringValues = escapeValues([markdownValue, ...translatedValues]);
            returnString =
                returnString +
                `item[${linkId}]._text.extension[${IExtentionType.markdown}].valueMarkdown,${stringValues}\n`;
        } else {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId]?.text;
            });
            const stringValues = escapeValues([item.text, ...translatedValues]);
            returnString = returnString + `item[${linkId}].text,${stringValues}\n`;
        }

        if (getSublabel(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId].sublabel;
            });
            const stringValues = escapeValues([getSublabel(item), ...translatedValues]);
            returnString =
                returnString + `item[${linkId}].extension[${IExtentionType.sublabel}].valueMarkdown,${stringValues}\n`;
        }

        if (getRepeatsText(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId].repeatsText;
            });
            const stringValues = escapeValues([getRepeatsText(item), ...translatedValues]);
            returnString =
                returnString + `item[${linkId}].extension[${IExtentionType.repeatstext}].valueString,${stringValues}\n`;
        }

        if (getValidationMessage(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId].validationText;
            });
            const stringValues = escapeValues([getValidationMessage(item), ...translatedValues]);
            returnString =
                returnString +
                `item[${linkId}].extension[${IExtentionType.validationtext}].valueString,${stringValues}\n`;
        }

        if (getPlaceHolderText(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId].entryFormatText;
            });
            const stringValues = escapeValues([getPlaceHolderText(item), ...translatedValues]);
            returnString =
                returnString + `item[${linkId}].extension[${IExtentionType.entryFormat}].valueString,${stringValues}\n`;
        }

        if (getInitialText(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId].initial;
            });
            const stringValues = escapeValues([getInitialText(item), ...translatedValues]);
            returnString = returnString + `item[${linkId}].initial[0].valueString,${stringValues}\n`;
        }

        if (getPrefix(item)) {
            const translatedValues = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId].prefix;
            });
            const stringValues = escapeValues([getPrefix(item), ...translatedValues]);
            returnString = returnString + `item[${linkId}].prefix,${stringValues}\n`;
        }

        if (item.answerOption) {
            const translatedOptions = additionalLanguagesInUse.map((lang) => {
                return additionalLanguages[lang].items[linkId].answerOptions;
            });
            item.answerOption.forEach((x) => {
                const stringValues = escapeValues([
                    x.valueCoding?.display,
                    ...translatedOptions.map((y) => y && y[x.valueCoding?.code || '']),
                ]);
                returnString =
                    returnString + `item[${linkId}].answerOption[${x.valueCoding?.code}].display,${stringValues}\n`;
            });
        }
    });
    return returnString;
};

const escapeValues = (values: Array<string | undefined>): string => {
    return values.map((value) => `"${value || ''}"`).join(',');
};
