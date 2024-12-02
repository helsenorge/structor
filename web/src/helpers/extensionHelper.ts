import { Element, Extension, Quantity, QuestionnaireItem } from "fhir/r4";

import { HyperlinkTarget } from "../types/hyperlinkTargetType";
import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "../types/IQuestionnaireMetadataType";
import {
  IExtensionType,
  IValueSetSystem,
  IItemProperty,
  ICodeSystem,
} from "../types/IQuestionnareItemType";

import createUUID from "./CreateUUID";
import {
  updateItemAction,
  updateQuestionnaireMetadataAction,
} from "../store/treeStore/treeActions";
import { ActionType } from "../store/treeStore/treeStore";

export const setQuestionnaireExtension = (
  qMetadata: IQuestionnaireMetadata,
  extensionValue: Extension,
  dispatch: (value: ActionType) => void
): void => {
  const extensionsToSet = (qMetadata.extension || []).filter(
    (x: Extension) => x.url !== extensionValue.url
  );
  extensionsToSet.push(extensionValue);
  dispatch(
    updateQuestionnaireMetadataAction(
      IQuestionnaireMetadataType.extension,
      extensionsToSet
    )
  );
};
export const findExtensionByUrl = (
  extentions: Extension[] | undefined,
  url: string
): Extension | undefined => {
  return extentions?.find((ext) => ext.url === url);
};
export const isExtensionValueTrue = (
  extensions: Extension[] | undefined,
  url: string,
  valueType: keyof Extension
): boolean | undefined => {
  const extension = findExtensionByUrl(extensions, url);
  if (!extension || typeof extension[valueType] !== "boolean") {
    return undefined;
  }

  return extension ? extension[valueType] === true : false;
};
export const getExtensionValue = <T extends keyof Extension>(
  extensions: Extension[] | undefined,
  url: string,
  valueType: T
): Extension[T] | undefined => {
  const extension = findExtensionByUrl(extensions, url);
  return extension ? extension[valueType] : undefined;
};

export const removeQuestionnaireExtension = (
  qMetadata: IQuestionnaireMetadata,
  extensionUrl: string,
  dispatch: (value: ActionType) => void
): void => {
  const extensionsToSet = (qMetadata.extension || []).filter(
    (x: Extension) => x.url !== extensionUrl
  );
  dispatch(
    updateQuestionnaireMetadataAction(
      IQuestionnaireMetadataType.extension,
      extensionsToSet
    )
  );
};

export const setItemExtension = (
  item: QuestionnaireItem,
  extensionValue: Extension,
  dispatch: (value: ActionType) => void
): void => {
  const extensionsToSet = (item.extension || []).filter(
    (x: Extension) => x.url !== extensionValue.url
  );
  extensionsToSet.push(extensionValue);
  dispatch(
    updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet)
  );
};

export const removeItemExtension = (
  item: QuestionnaireItem,
  extensionUrl: string | string[],
  dispatch: (value: ActionType) => void
): void => {
  const extensionsToSet = Array.isArray(extensionUrl)
    ? (item.extension || []).filter(
        (x: Extension) => extensionUrl.indexOf(x.url) === -1
      )
    : (item.extension || []).filter((x: Extension) => x.url !== extensionUrl);
  dispatch(
    updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet)
  );
};

export const createExtensionWithSystemAndCoding = (
  item: QuestionnaireItem,
  extensionUrl: IExtensionType,
  system: IValueSetSystem,
  code: string,
  dispatch: React.Dispatch<ActionType>
): void => {
  const newExtension: Extension = {
    url: extensionUrl,
    valueCodeableConcept: {
      coding: [
        {
          system: system,
          code: code,
        },
      ],
    },
  };
  setItemExtension(item, newExtension, dispatch);
};

export const addCodeToValueCodeableConcept = (
  item: QuestionnaireItem,
  extension: Extension,
  system: string,
  code: string,
  dispatch: React.Dispatch<ActionType>
): void => {
  extension.valueCodeableConcept?.coding?.push({
    system: system,
    code: code,
  });
  setItemExtension(item, extension, dispatch);
};

export const createOptionReferenceExtensions = [
  {
    url: IExtensionType.optionReference,
    valueReference: {
      reference: "",
      display: "",
      id: createUUID(),
    },
  },
  {
    url: IExtensionType.optionReference,
    valueReference: {
      reference: "",
      display: "",
      id: createUUID(),
    },
  },
];

export const createMarkdownExtension = (markdownValue: string): Element => {
  return {
    extension: [
      {
        url: IExtensionType.markdown,
        valueMarkdown: markdownValue,
      },
    ],
  };
};

export const hasExtension = (
  extensionParent: Element | undefined,
  extensionType: IExtensionType
): boolean => {
  return extensionParent && extensionParent.extension
    ? extensionParent.extension.some((ext) => ext.url === extensionType)
    : false;
};
export const hasOneOrMoreExtensions = (
  extensions: Extension[],
  extensionTypes: IExtensionType[]
): boolean => {
  return extensions.some((ex) =>
    extensionTypes.includes(ex.url as IExtensionType)
  );
};

export const findExtensionInExtensionArray = (
  extensionArray: Extension[],
  url: string
): Extension | undefined => {
  return extensionArray.find((x) => x.url === url);
};

export const getExtensionStringValue = (
  item: QuestionnaireItem,
  extensionType: IExtensionType
): string | undefined => {
  return findExtensionByUrl(item.extension, extensionType)?.valueString;
};

export const createGuidanceActionExtension = (valueString = ""): Extension => ({
  url: IExtensionType.guidanceAction,
  valueString,
});

export const createGuidanceParameterExtension = (
  valueString = ""
): Extension => ({
  url: IExtensionType.guidanceParam,
  valueString,
});

export const createHyperlinkTargetExtension = (codeValue = 2): Extension => ({
  url: IExtensionType.hyperlinkTarget,
  valueCoding: {
    system: IValueSetSystem.hyperlinkTargetValueset,
    code: `${codeValue}`,
  },
});

export const getHyperlinkTargetvalue = (
  extensions: Extension[]
): HyperlinkTarget | undefined => {
  const hyperlinkExtension = extensions?.find(
    (extension) => extension.url === IExtensionType.hyperlinkTarget
  );
  if (hyperlinkExtension) {
    const value = hyperlinkExtension.valueCoding?.code;
    if (value) return ~~value;
  }
  return undefined;
};

export const getQuantityExtension = (
  extensions: Extension[]
): Quantity | undefined => {
  const extension = extensions.filter(
    (f: Extension) => f.url === IExtensionType.questionnaireUnit
  );
  return extension.length > 0
    ? {
        unit: extension[0].valueCoding?.display,
        code: extension[0].valueCoding?.code,
        system: extension[0].valueCoding?.system,
      }
    : undefined;
};

export const getQuantityCode = (
  extensions: Extension[]
): string | undefined => {
  const extension = getQuantityExtension(extensions);
  return extension?.code;
};

export const getExtentionsFromElement = (
  element: Element
): Extension[] | undefined => {
  return element.extension;
};

export const getExtentionByType = (
  extentions: Extension[],
  type: IExtensionType
): Extension | undefined => {
  return extentions.find((x) => x.url === type);
};

type ExclusiveExtensionKeys = Exclude<keyof Extension, keyof Element>;

type ExclusiveExtensionValues = {
  [K in ExclusiveExtensionKeys]: Extension[K];
};

export function getExtentionValueByType<T extends ExclusiveExtensionKeys>(
  element: Element,
  extentionType: IExtensionType,
  valueType: T
): ExclusiveExtensionValues[T] | undefined {
  const extentions = getExtentionsFromElement(element) ?? [];
  const extention = getExtentionByType(extentions || [], extentionType);

  return !extention || !(valueType in extention)
    ? undefined
    : (extention as ExclusiveExtensionValues)[valueType];
}

export const findExtentionByCode = (
  code: ICodeSystem,
  extentions?: Extension[]
): Extension | undefined => {
  return extentions?.find((x) => x.valueCoding?.system === code);
};

export const getExtensionByCodeAndElement = (
  element: Element,
  code: ICodeSystem
): Extension | undefined => {
  const extentions = getExtentionsFromElement(element);
  return findExtentionByCode(code, extentions);
};
