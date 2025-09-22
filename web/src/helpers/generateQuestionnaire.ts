import {
  Bundle,
  Coding,
  Extension,
  FhirResource,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireItemInitial,
  ValueSet,
} from "fhir/r4";

import { IQuestionnaireMetadata } from "../types/IQuestionnaireMetadataType";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../types/IQuestionnareItemType";

import { emptyPropertyReplacer } from "./emptyPropertyReplacer";
import {
  FhirpathAgeExpression,
  FhirpathGenderExpression,
} from "./EnrichmentSet";
import { isItemControlSidebar } from "./itemControl";
import {
  getLanguageFromCode,
  translatableMetadata,
  translatableSettings,
} from "./LanguageHelper";
import { getValueSetValues } from "./valueSetHelper";
import {
  CodeStringValue,
  Items,
  Languages,
  OrderItem,
  Translation,
  TreeState,
} from "../store/treeStore/treeStore";

const getExtension = (
  extensions: Extension[] | undefined,
  extensionType: IExtensionType,
): Extension | undefined => {
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
  const replaceIndex = translatedExtensions.findIndex(
    (ext) => ext.url === translatedExtension.url,
  );
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
    const display =
      code && optionTranslations ? optionTranslations[code] || "" : "";
    return {
      valueCoding: { ...answerOption.valueCoding, display },
    };
  });
};

const getTranslatedContained = (
  qContained: FhirResource[] | undefined,
  translation: Translation,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
): ValueSet[] => {
  if (!qContained || qContained.length < 1) {
    return [];
  }

  return qContained
    .map((contained) => {
      if (contained.resourceType !== "ValueSet") {
        return;
      }
      if (getValueSetValues(contained).length === 0) {
        return contained;
      }

      const includes = contained.compose?.include.map((include) => {
        return {
          ...include,
          concept: include.concept?.map((c) => {
            const translatedValue =
              contained.id && translation.contained[contained.id]
                ? translation.contained[contained.id].concepts[c.code]
                : "";
            return { ...c, display: translatedValue };
          }),
        };
      });

      return {
        ...contained,
        compose: { ...contained.compose, include: includes },
      };
    })
    .filter(Boolean) as ValueSet[];
};

const getTranslatedSidebarItem = (
  translation: Translation,
  currentItem: QuestionnaireItem,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  const sidebarItemTranslation = translation?.sidebarItems[currentItem.linkId];
  let _text = undefined;

  // Set text to an emty sting if translation is not set
  const translatedText =
    sidebarItemTranslation && sidebarItemTranslation.markdown
      ? sidebarItemTranslation.markdown
      : "";
  const markdownExtension = getExtension(
    currentItem._text?.extension,
    IExtensionType.markdown,
  );
  if (markdownExtension) {
    const translatedMarkdownExtension = {
      ...markdownExtension,
      valueMarkdown: translatedText,
    };
    _text = {
      extension: updateTranslatedExtension(
        currentItem._text?.extension,
        translatedMarkdownExtension,
      ),
    };
  }
  return { ...currentItem, _text };
};

const getTranslatedItem = (
  languageCode: string,
  orderItem: OrderItem,
  items: Items,
  languages: Languages,
): QuestionnaireItem => {
  const currentItem = items[orderItem.linkId];
  if (isItemControlSidebar(currentItem)) {
    return getTranslatedSidebarItem(languages[languageCode], currentItem);
  }

  const itemTranslation = languages[languageCode].items[orderItem.linkId];

  // item.text
  let _text = undefined;
  const translatedText = itemTranslation?.text;
  const markdownExtension = getExtension(
    currentItem._text?.extension,
    IExtensionType.markdown,
  );
  if (markdownExtension) {
    const translatedMarkdownExtension = {
      ...markdownExtension,
      valueMarkdown: translatedText,
    };
    _text = {
      extension: updateTranslatedExtension(
        currentItem._text?.extension,
        translatedMarkdownExtension,
      ),
    };
  }

  let extension = undefined;
  if (currentItem.extension) {
    extension = [...currentItem.extension];
  }

  // ValidationMessage
  const validationTextExtension = getExtension(
    extension,
    IExtensionType.validationtext,
  );
  if (validationTextExtension) {
    const translatedValidationTextExtension = {
      ...validationTextExtension,
      valueString: itemTranslation?.validationText,
    };
    extension = updateTranslatedExtension(
      extension,
      translatedValidationTextExtension,
    );
  }

  // Placeholder
  const entryFormatExtension = getExtension(
    extension,
    IExtensionType.entryFormat,
  );
  if (entryFormatExtension) {
    const translatedEntryFormatExtension = {
      ...entryFormatExtension,
      valueString: itemTranslation?.entryFormatText,
    };
    extension = updateTranslatedExtension(
      extension,
      translatedEntryFormatExtension,
    );
  }

  // Sublabel
  const sublabelExtension = getExtension(extension, IExtensionType.sublabel);
  if (sublabelExtension) {
    const translatedSublabelExtension = {
      ...sublabelExtension,
      valueMarkdown: itemTranslation?.sublabel,
    };
    extension = updateTranslatedExtension(
      extension,
      translatedSublabelExtension,
    );
  }

  // Repeatstext
  const repeatsTextExtension = getExtension(
    extension,
    IExtensionType.repeatstext,
  );
  if (repeatsTextExtension) {
    const translatedRepeatsTextExtension = {
      ...repeatsTextExtension,
      valueString: itemTranslation?.repeatsText,
    };
    extension = updateTranslatedExtension(
      extension,
      translatedRepeatsTextExtension,
    );
  }
  // answerOption
  const answerOption = getTranslatedAnswerOptions(
    currentItem.answerOption,
    itemTranslation?.answerOptions,
  );

  //prefix
  const prefix = itemTranslation?.prefix || "";

  //initial
  const initial =
    (currentItem.type === IQuestionnaireItemType.text ||
      currentItem.type === IQuestionnaireItemType.string) &&
    itemTranslation?.initial
      ? [{ valueString: itemTranslation?.initial }]
      : currentItem.initial;

  //Coding
  const code: Coding[] = mergeCodes(currentItem?.code, itemTranslation?.code);
  const newItem: QuestionnaireItem = {
    ...currentItem,
    text: translatedText,
    _text,
    extension,
    answerOption,
    prefix,
    initial,
    code,
  };

  return newItem;
};
function mergeCodes(
  currentCodes?: Coding[],
  translationCodes?: Coding[],
): Coding[] {
  return (
    currentCodes?.map((currentCode) => {
      const match = translationCodes?.find(
        (translationCode) =>
          translationCode.system === currentCode.system &&
          translationCode.code === currentCode.code,
      );
      return match || currentCode;
    }) || []
  );
}

const getTranslatedMetadata = (
  qMetadata: IQuestionnaireMetadata,
  translation: Translation,
): IQuestionnaireMetadata => {
  const translatedMetadata: IQuestionnaireMetadata = {};
  translatableMetadata.forEach((metadataProperty) => {
    translatedMetadata[metadataProperty.propertyName] =
      translation.metaData[metadataProperty.propertyName];
  });
  return {
    ...qMetadata,
    ...translatedMetadata,
    extension: getTranslatedExtensions(qMetadata, translation),
  };
};

const getTranslatedExtensions = (
  qMetadata: IQuestionnaireMetadata,
  translation: Translation,
): Array<Extension> => {
  const translatedSettings = translation.settings;
  const extensions = [];
  for (const e of qMetadata.extension || []) {
    const translatable = translatableSettings[e.url as IExtensionType];
    if (translatable) continue;

    extensions.push(e);
  }

  // look for translated extensions that might not have an equal in the original
  for (const extensionUrl in translatedSettings) {
    extensions.push(translatedSettings[extensionUrl]);
  }

  return extensions;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getLanguageData(
  qMetadata: IQuestionnaireMetadata,
  languageCode: string,
) {
  const tag = qMetadata.meta?.tag;
  if (!tag || !tag[0]) {
    return { language: languageCode };
  }
  return {
    language: languageCode,
    meta: {
      ...qMetadata.meta,
      tag: [
        {
          ...tag[0],
          code: languageCode,
          display: getLanguageFromCode(languageCode)?.localDisplay,
        },
      ],
    },
  };
}

export const generateTree = (
  order: Array<OrderItem>,
  items: Items,
): Array<QuestionnaireItem> => {
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
      item: generateTreeWithTranslations(
        x.items,
        items,
        languageCode,
        languages,
      ),
    };
  });
};

export const generateMainQuestionnaire = (state: TreeState): Questionnaire => {
  const usedValueSet = getUsedValueSet(state);
  return {
    ...state.qMetadata,
    contained: state.qContained?.filter(
      (x) => x.id && usedValueSet?.includes(x.id) && x,
    ) as ValueSet[],
    resourceType: "Questionnaire",
    status: (state.qMetadata.status as Questionnaire["status"]) || "draft",
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
    contained: getTranslatedContained(
      state.qContained,
      languages[languageCode],
    ).filter((x) => x.id && usedValueSet?.includes(x.id)) as FhirResource[],
    resourceType: "Questionnaire",
    status: state.qMetadata.status as Questionnaire["status"],
    item: generateTreeWithTranslations(
      state.qOrder,
      state.qItems,
      languageCode,
      languages,
    ),
  };
};

export function getUsedValueSetToTranslate(
  state: TreeState,
): ValueSet[] | undefined {
  const usedValueSet = getUsedValueSet(state);
  const valueSetsToTranslate = state.qContained
    ?.filter((x) => x.resourceType === "ValueSet")
    .filter((x) => x.id && usedValueSet?.includes(x.id) && x);

  return valueSetsToTranslate;
}

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
        questionnaires.push(
          generateTranslatedQuestionnaire(
            state,
            languageCode,
            qAdditionalLanguages,
          ),
        ),
      );
    }
    return questionnaires;
  }

  // Return bundle if translations exist
  if (
    state.qAdditionalLanguages &&
    Object.keys(state.qAdditionalLanguages).length > 0
  ) {
    const bundle: Bundle = {
      resourceType: "Bundle",
      type: "searchset",
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

  return JSON.stringify(
    generateMainQuestionnaire(state),
    emptyPropertyReplacer,
  );
};
export const generarteQuestionnaireOrBundle = (
  state: TreeState,
): Questionnaire | Bundle => JSON.parse(generateQuestionnaire(state));

const setEnrichmentValues = (
  items: QuestionnaireItem[],
  replacementValues: {
    expression: string;
    initialValue: QuestionnaireItemInitial;
  }[],
): void => {
  items.forEach((qItem) => {
    (qItem.extension || []).forEach((extension) => {
      replacementValues.forEach((replacementValue) => {
        if (
          extension.url === IExtensionType.fhirPath &&
          extension.valueString?.replace(" ", "") ===
            replacementValue.expression.replace(" ", "")
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
