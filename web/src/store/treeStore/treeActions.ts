import {
  QuestionnaireItem,
  Extension,
  QuestionnaireItemAnswerOption,
  QuestionnaireItemInitial,
  Element,
  ValueSet,
  Meta,
  Coding,
  ContactDetail,
  CodeSystem,
  FhirResource,
} from "fhir/r4";

import { IQuestionnaireMetadataType } from "../../types/IQuestionnaireMetadataType";
import {
  ICodingProperty,
  IEnableWhen,
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
  IValueSetSystem,
} from "../../types/IQuestionnareItemType";
import { TranslatableItemProperty } from "../../types/LanguageTypes";

import { Translation, TreeState } from "./treeStore";
import CreateUUID from "../../helpers/CreateUUID";
import { createMarkdownExtension } from "../../helpers/extensionHelper";
import {
  createItemControlExtension,
  ItemControlType,
} from "../../helpers/itemControl";

export const ADD_ITEM_CODE_ACTION = "addItemCode";
export const ADD_QUESTIONNAIRE_LANGUAGE_ACTION = "addQuestionnaireLanguage";
export const DELETE_ITEM_CODE_ACTION = "deleteItemCode";
export const UPDATE_ITEM_CODE_PROPERTY_ACTION = "updateItemCodeProperty";
export const UPDATE_ITEM_EXTENSION_ACTION = "updateItemExtension";
export const UPDATE_ITEM_CODE_PROPERTY_WITH_CODE_ACTION =
  "updateItemCodePropertyWithCode";
export const REMOVE_QUESTIONNAIRE_LANGUAGE_ACTION =
  "removeQuestionnaireLanguage";
export const UPDATE_ITEM_TRANSLATION_ACTION = "updateItemTranslation";
export const UPDATE_ITEM_OPTION_TRANSLATION_ACTION =
  "updateItemOptionTranslation";
export const UPDATE_METADATA_TRANSLATION_ACTION = "updateMetadataTranslation";
export const UPDATE_SETTING_TRANSLATION_ACTION = "updateSettingTranslation";
export const UPDATE_CONTAINED_VALUESET_TRANSLATION_ACTION =
  "updateContainedValueSetTranslation";
export const UPDATE_SIDEBAR_TRANSLATION_ACTION = "updateSidebarTranslation";
export const UPDATE_QUESTIONNAIRE_METADATA_ACTION =
  "updateQuestionnaireMetadata";
export const NEW_ITEM_ACTION = "newItem";
export const REMOVE_ITEM_ATTRIBUTE_ACTION = "removeItemAttribute";
export const DELETE_ITEM_ACTION = "deleteItem";
export const DELETE_CHILD_ITEMS_ACTION = "deleteChildItems";
export const UPDATE_ITEM_ACTION = "updateItem";
export const DUPLICATE_ITEM_ACTION = "duplicateItem";
export const RESET_QUESTIONNAIRE_ACTION = "resetQuestionnaire";
export const REORDER_ITEM_ACTION = "reorderItem";
export const MOVE_ITEM_ACTION = "moveItem";
export const APPEND_VALUESET_ACTION = "appendValueSet";
export const UPDATE_LINK_ID_ACTION = "updateLinkId";
export const UPDATE_MARKED_LINK_ID = "updateMarkedLinkId";
export const REMOVE_VALUESET_ACTION = "REMOVE_VALUESET";

export const UPDATE_VALUESET_ACTION = "UPDATE_VALUESET";
export const REMOVE_CODESYSTEM_ACTION = "REMOVE_CODESYSTEM";
export const UPDATE_CODESYSTEM_ACTION = "UPDATE_CODESYSTEM";
export const IMPORT_VALUESET_ACTION = "IMPORT_VALUESET";
export const IMPORT_FHIR_RESOURCE_ACTION = "IMPORT_FHIR_RESOURCE_ACTION";
export const IMPORT_CODESYSTEM_ACTION = "IMPORT_CODESYSTEM_ACTION";
export const UPDATE_ITEM_CODE_TRANSLATION_ACTION =
  "UPDATE_ITEM_CODE_TRANSLATION_ACTION";
export const SAVE_ACTION = "save";

type ItemValueType =
  | string
  | boolean
  | Extension[]
  | IEnableWhen[]
  | number
  | QuestionnaireItemAnswerOption[]
  | QuestionnaireItemAnswerOption[][]
  | Element
  | QuestionnaireItemInitial[]
  | Coding[]
  | undefined; // TODO: legg på alle lovlige verdier

export interface AddItemCodeAction {
  type: typeof ADD_ITEM_CODE_ACTION;
  linkId: string;
  code: Coding;
}

export interface DeleteItemCodeAction {
  type: typeof DELETE_ITEM_CODE_ACTION;
  linkId: string;
  index: number;
}

export interface UpdateItemCodePropertyAction {
  type: typeof UPDATE_ITEM_CODE_PROPERTY_ACTION;
  linkId: string;
  index: number;
  property: ICodingProperty;
  value: string;
}

export interface UpdateItemExtensionAction {
  type: typeof UPDATE_ITEM_EXTENSION_ACTION;
  linkId: string;
  extensions: Extension[];
}
export interface UpdateItemCodePropertyWithCodeAction {
  type: typeof UPDATE_ITEM_CODE_PROPERTY_WITH_CODE_ACTION;
  linkId: string;
  property: ICodingProperty;
  value: string;
  system: string;
  code: string;
}

export interface UpdateMarkedLinkId {
  type: typeof UPDATE_MARKED_LINK_ID;
  linkId?: string;
  parentArray?: Array<string>;
}
export interface AddQuestionnaireLanguageAction {
  type: typeof ADD_QUESTIONNAIRE_LANGUAGE_ACTION;
  additionalLanguageCode: string;
  translation: Translation;
}

export interface RemoveQuestionnaireLanguageAction {
  type: typeof REMOVE_QUESTIONNAIRE_LANGUAGE_ACTION;
  languageCode: string;
}

export interface UpdateItemTranslationAction {
  type: typeof UPDATE_ITEM_TRANSLATION_ACTION;
  languageCode: string;
  linkId: string;
  propertyName: Exclude<TranslatableItemProperty, "code">;
  value: string;
}

export interface UpdateItemCodeTranslationAction {
  type: typeof UPDATE_ITEM_CODE_TRANSLATION_ACTION;
  languageCode: string;
  linkId: string;
  value: string;
  code: Coding;
}
export interface UpdateItemOptionTranslationAction {
  type: typeof UPDATE_ITEM_OPTION_TRANSLATION_ACTION;
  languageCode: string;
  linkId: string;
  text: string;
  optionCode: string;
}

export interface UpdateMetadataTranslationAction {
  type: typeof UPDATE_METADATA_TRANSLATION_ACTION;
  languageCode: string;
  propertyName: string;
  translation: string;
}

export interface UpdateSettingTranslationAction {
  type: typeof UPDATE_SETTING_TRANSLATION_ACTION;
  languageCode: string;
  extension: IExtensionType;
  translatedValue: Extension | null;
}

export interface UpdateContainedValueSetTranslationAction {
  type: typeof UPDATE_CONTAINED_VALUESET_TRANSLATION_ACTION;
  languageCode: string;
  valueSetId: string;
  conceptId: string;
  translation: string;
}

export interface UpdateSidebarTranslationAction {
  type: typeof UPDATE_SIDEBAR_TRANSLATION_ACTION;
  languageCode: string;
  linkId: string;
  value: string;
}

export interface UpdateLinkIdAction {
  type: typeof UPDATE_LINK_ID_ACTION;
  oldLinkId: string;
  newLinkId: string;
  parentArray: Array<string>;
}

export interface UpdateQuestionnaireMetadataAction {
  type: typeof UPDATE_QUESTIONNAIRE_METADATA_ACTION;
  propName: IQuestionnaireMetadataType;
  value: string | Meta | Extension[] | ContactDetail[];
}

export interface NewItemAction {
  type: typeof NEW_ITEM_ACTION;
  item: QuestionnaireItem;
  order: Array<string>;
  index?: number;
}

export interface DeleteItemAction {
  type: typeof DELETE_ITEM_ACTION;
  linkId: string;
  order: Array<string>;
}

export interface DeleteChildItemsAction {
  type: typeof DELETE_CHILD_ITEMS_ACTION;
  linkId: string;
  order: Array<string>;
}

export interface UpdateItemAction {
  type: typeof UPDATE_ITEM_ACTION;
  linkId: string;
  itemProperty: IItemProperty;
  itemValue: ItemValueType;
}

export interface RemoveItemAttributeAction {
  type: typeof REMOVE_ITEM_ATTRIBUTE_ACTION;
  linkId: string;
  itemProperty: IItemProperty;
}

export interface DuplicateItemAction {
  type: typeof DUPLICATE_ITEM_ACTION;
  linkId: string;
  order: Array<string>;
}

export interface ResetQuestionnaireAction {
  type: typeof RESET_QUESTIONNAIRE_ACTION;
  newState?: TreeState;
}

export interface ReorderItemAction {
  type: typeof REORDER_ITEM_ACTION;
  linkId: string;
  order: Array<string>;
  newIndex: number;
}

export interface MoveItemAction {
  type: typeof MOVE_ITEM_ACTION;
  linkId: string;
  oldOrder: string[];
  newOrder: string[];
  index?: number;
}

export interface UpdateValueSetAction {
  type: typeof UPDATE_VALUESET_ACTION;
  item: ValueSet;
}
export interface RemoveCodeSystemAction {
  type: typeof REMOVE_CODESYSTEM_ACTION;
  item: CodeSystem;
}
export interface UpdateCodeSystemAction {
  type: typeof UPDATE_CODESYSTEM_ACTION;
  item: CodeSystem;
}
export interface RemoveValueSetAction {
  type: typeof REMOVE_VALUESET_ACTION;
  item: ValueSet;
}
export interface ImportValueSetAction {
  type: typeof IMPORT_VALUESET_ACTION;
  items: ValueSet[];
}
export interface ImportFhirResourceAction {
  type: typeof IMPORT_FHIR_RESOURCE_ACTION;
  items: FhirResource[];
}
export interface ImportCodeSystemAction {
  type: typeof IMPORT_CODESYSTEM_ACTION;
  items: CodeSystem[];
}

export interface SaveAction {
  type: typeof SAVE_ACTION;
}

export const updateMarkedLinkIdAction = (
  markedLinkId?: string,
  parentArray?: Array<string>,
): UpdateMarkedLinkId => {
  return {
    type: UPDATE_MARKED_LINK_ID,
    linkId: markedLinkId,
    parentArray,
  };
};

export const addItemCodeAction = (
  linkId: string,
  code: Coding,
): AddItemCodeAction => {
  return {
    type: ADD_ITEM_CODE_ACTION,
    linkId,
    code,
  };
};

export const deleteItemCodeAction = (
  linkId: string,
  index: number,
): DeleteItemCodeAction => {
  return {
    type: DELETE_ITEM_CODE_ACTION,
    linkId,
    index,
  };
};

export const updateItemCodePropertyAction = (
  linkId: string,
  index: number,
  property: ICodingProperty,
  value: string,
): UpdateItemCodePropertyAction => {
  return {
    type: UPDATE_ITEM_CODE_PROPERTY_ACTION,
    linkId,
    index,
    property,
    value,
  };
};
export const updateItemExtensionAction = (
  linkId: string,
  extensions: Extension[],
): UpdateItemExtensionAction => {
  return {
    type: UPDATE_ITEM_EXTENSION_ACTION,
    linkId,
    extensions,
  };
};

export const updateItemCodePropertyWithCodeAction = (
  linkId: string,
  property: ICodingProperty,
  value: string,
  system: string,
  code: string,
): UpdateItemCodePropertyWithCodeAction => {
  return {
    type: UPDATE_ITEM_CODE_PROPERTY_WITH_CODE_ACTION,
    linkId,
    property,
    value,
    system,
    code,
  };
};

export const addQuestionnaireLanguageAction = (
  additionalLanguageCode: string,
  translation: Translation,
): AddQuestionnaireLanguageAction => {
  return {
    type: ADD_QUESTIONNAIRE_LANGUAGE_ACTION,
    additionalLanguageCode,
    translation,
  };
};

export const removeQuestionnaireLanguageAction = (
  languageCode: string,
): RemoveQuestionnaireLanguageAction => {
  return {
    type: REMOVE_QUESTIONNAIRE_LANGUAGE_ACTION,
    languageCode,
  };
};

export const updateItemTranslationAction = (
  languageCode: string,
  linkId: string,
  propertyName: Exclude<TranslatableItemProperty, "code">,
  value: string,
): UpdateItemTranslationAction => {
  return {
    type: UPDATE_ITEM_TRANSLATION_ACTION,
    languageCode,
    linkId,
    propertyName,
    value,
  };
};
export const updateItemCodeTranslation = (
  languageCode: string,
  linkId: string,
  value: string,
  code: Coding,
): UpdateItemCodeTranslationAction => {
  return {
    type: UPDATE_ITEM_CODE_TRANSLATION_ACTION,
    languageCode,
    linkId,
    value,
    code,
  };
};

export const updateItemOptionTranslationAction = (
  languageCode: string,
  linkId: string,
  text: string,
  optionCode: string,
): UpdateItemOptionTranslationAction => {
  return {
    type: UPDATE_ITEM_OPTION_TRANSLATION_ACTION,
    languageCode,
    linkId,
    text,
    optionCode,
  };
};

export const updateMetadataTranslationAction = (
  languageCode: string,
  propertyName: string,
  translation: string,
): UpdateMetadataTranslationAction => {
  return {
    type: UPDATE_METADATA_TRANSLATION_ACTION,
    languageCode,
    propertyName,
    translation,
  };
};

export const updateSettingTranslationAction = (
  languageCode: string,
  extension: IExtensionType,
  translatedValue: Extension | null,
): UpdateSettingTranslationAction => {
  return {
    type: UPDATE_SETTING_TRANSLATION_ACTION,
    languageCode,
    extension,
    translatedValue,
  };
};

export const updateContainedValueSetTranslationAction = (
  languageCode: string,
  valueSetId: string,
  conceptId: string,
  translation: string,
): UpdateContainedValueSetTranslationAction => {
  return {
    type: UPDATE_CONTAINED_VALUESET_TRANSLATION_ACTION,
    languageCode,
    valueSetId,
    conceptId,
    translation,
  };
};

export const updateSidebarTranslationAction = (
  languageCode: string,
  linkId: string,
  value: string,
): UpdateSidebarTranslationAction => {
  return {
    type: UPDATE_SIDEBAR_TRANSLATION_ACTION,
    languageCode,
    linkId,
    value,
  };
};

export const updateLinkIdAction = (
  oldLinkId: string,
  newLinkId: string,
  parentArray: Array<string>,
): UpdateLinkIdAction => {
  return {
    type: UPDATE_LINK_ID_ACTION,
    oldLinkId,
    newLinkId,
    parentArray,
  };
};

export const updateQuestionnaireMetadataAction = (
  propName: IQuestionnaireMetadataType,
  value: string | Meta | Extension[] | ContactDetail[],
): UpdateQuestionnaireMetadataAction => {
  return {
    type: UPDATE_QUESTIONNAIRE_METADATA_ACTION,
    propName,
    value,
  };
};

export const newItemAction = (
  newQuestionnaireItem: QuestionnaireItem,
  order: Array<string>,
  index?: number,
): NewItemAction => {
  return {
    type: NEW_ITEM_ACTION,
    item: newQuestionnaireItem,
    order,
    index,
  };
};

export const newItemSidebar = (order: Array<string>): NewItemAction => {
  const sidebar = {
    extension: [createItemControlExtension(ItemControlType.sidebar)],
    linkId: CreateUUID(),
    code: [
      {
        system: IValueSetSystem.sotHeader,
        code: "",
        display: "",
      },
    ],
    _text: createMarkdownExtension(""),
    type: IQuestionnaireItemType.text,
    required: false,
    repeats: false,
    readOnly: false,
  } as QuestionnaireItem;
  return {
    type: NEW_ITEM_ACTION,
    item: sidebar,
    order,
  };
};

export const newItemHelpIconAction = (order: Array<string>): NewItemAction => {
  const newQuestionnaireItem = {
    linkId: CreateUUID(),
    type: IQuestionnaireItemType.text,
    required: false,
    repeats: false,
    readOnly: true,
    maxLength: 250,
    _text: createMarkdownExtension(""),
    extension: [createItemControlExtension(ItemControlType.help)],
  } as QuestionnaireItem;
  return {
    type: NEW_ITEM_ACTION,
    item: newQuestionnaireItem,
    order,
  };
};

export const deleteItemAction = (
  linkId: string,
  order: Array<string>,
): DeleteItemAction => {
  return {
    type: DELETE_ITEM_ACTION,
    linkId,
    order,
  };
};

export const deleteChildItemsAction = (
  linkId: string,
  order: Array<string>,
): DeleteChildItemsAction => {
  return {
    type: DELETE_CHILD_ITEMS_ACTION,
    linkId,
    order,
  };
};

export const updateItemAction = (
  linkId: string,
  itemProperty: IItemProperty,
  itemValue: ItemValueType,
): UpdateItemAction => {
  return {
    type: UPDATE_ITEM_ACTION,
    linkId,
    itemProperty,
    itemValue,
  };
};

export const removeItemAttributeAction = (
  linkId: string,
  itemProperty: IItemProperty,
): RemoveItemAttributeAction => {
  return {
    type: REMOVE_ITEM_ATTRIBUTE_ACTION,
    linkId,
    itemProperty,
  };
};

export const duplicateItemAction = (
  linkId: string,
  order: Array<string>,
): DuplicateItemAction => {
  return {
    type: DUPLICATE_ITEM_ACTION,
    linkId,
    order,
  };
};

export const resetQuestionnaireAction = (
  newState?: TreeState | undefined,
): ResetQuestionnaireAction => {
  return {
    type: RESET_QUESTIONNAIRE_ACTION,
    newState,
  };
};

export const reorderItemAction = (
  linkId: string,
  order: Array<string>,
  newIndex: number,
): ReorderItemAction => {
  return {
    type: REORDER_ITEM_ACTION,
    linkId,
    order,
    newIndex,
  };
};

export const moveItemAction = (
  linkId: string,
  newOrder: string[],
  oldOrder: string[],
  index?: number,
): MoveItemAction => {
  return {
    type: MOVE_ITEM_ACTION,
    linkId,
    newOrder,
    oldOrder,
    index,
  };
};
export const removeValueSet = (item: ValueSet): RemoveValueSetAction => {
  return {
    type: REMOVE_VALUESET_ACTION,
    item,
  };
};

export const updateValueSetAction = (item: ValueSet): UpdateValueSetAction => {
  return {
    type: UPDATE_VALUESET_ACTION,
    item,
  };
};

export const removeCodeSystemAction = (
  item: CodeSystem,
): RemoveCodeSystemAction => {
  return {
    type: REMOVE_CODESYSTEM_ACTION,
    item,
  };
};

export const updateCodeSystemAction = (
  item: CodeSystem,
): UpdateCodeSystemAction => {
  return {
    type: UPDATE_CODESYSTEM_ACTION,
    item,
  };
};

export const importValueSetAction = (
  items: ValueSet[],
): ImportValueSetAction => {
  return {
    type: IMPORT_VALUESET_ACTION,
    items,
  };
};
export const importFhirResourceAction = (
  items: FhirResource[],
): ImportFhirResourceAction => {
  return {
    type: IMPORT_FHIR_RESOURCE_ACTION,
    items,
  };
};
export const importCodeSystemAction = (
  items: CodeSystem[],
): ImportCodeSystemAction => {
  return {
    type: IMPORT_CODESYSTEM_ACTION,
    items,
  };
};

export const saveAction = (): SaveAction => {
  return { type: SAVE_ACTION };
};
