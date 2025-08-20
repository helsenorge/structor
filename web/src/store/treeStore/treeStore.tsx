import React, { createContext, Dispatch, useEffect, useReducer } from "react";

import { Coding, Extension, FhirResource, QuestionnaireItem } from "fhir/r4";
import produce from "immer";
import { HelsenorgeUrlStartText } from "src/components/Validation/validationHelper";

import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "../../types/IQuestionnaireMetadataType";
import { IItemProperty } from "../../types/IQuestionnareItemType";

import { findTreeArray } from "./findTreeArray";
import { saveQuestionnaire } from "./indexedDbHelper";
import { getInitialState, getMinimalInitialState } from "./initialState";
import {
  ADD_ITEM_CODE_ACTION,
  ADD_QUESTIONNAIRE_LANGUAGE_ACTION,
  AddItemCodeAction,
  AddQuestionnaireLanguageAction,
  DELETE_CHILD_ITEMS_ACTION,
  DELETE_ITEM_ACTION,
  DELETE_ITEM_CODE_ACTION,
  DeleteChildItemsAction,
  DeleteItemAction,
  DeleteItemCodeAction,
  DUPLICATE_ITEM_ACTION,
  DuplicateItemAction,
  MOVE_ITEM_ACTION,
  MoveItemAction,
  NEW_ITEM_ACTION,
  NewItemAction,
  REMOVE_ITEM_ATTRIBUTE_ACTION,
  REMOVE_QUESTIONNAIRE_LANGUAGE_ACTION,
  RemoveItemAttributeAction,
  RemoveQuestionnaireLanguageAction,
  REORDER_ITEM_ACTION,
  ReorderItemAction,
  RESET_QUESTIONNAIRE_ACTION,
  ResetQuestionnaireAction,
  SAVE_ACTION,
  SaveAction,
  UPDATE_CONTAINED_VALUESET_TRANSLATION_ACTION,
  UPDATE_ITEM_ACTION,
  UPDATE_ITEM_CODE_PROPERTY_ACTION,
  UPDATE_ITEM_CODE_PROPERTY_WITH_CODE_ACTION,
  UPDATE_ITEM_OPTION_TRANSLATION_ACTION,
  UPDATE_ITEM_TRANSLATION_ACTION,
  UPDATE_LINK_ID_ACTION,
  UPDATE_MARKED_LINK_ID,
  UPDATE_METADATA_TRANSLATION_ACTION,
  UPDATE_QUESTIONNAIRE_METADATA_ACTION,
  UPDATE_SIDEBAR_TRANSLATION_ACTION,
  UpdateContainedValueSetTranslationAction,
  UpdateItemAction,
  UpdateItemCodePropertyAction,
  UpdateItemCodePropertyWithCodeAction,
  UpdateItemOptionTranslationAction,
  UpdateItemTranslationAction,
  UpdateLinkIdAction,
  UpdateMarkedLinkId,
  UpdateMetadataTranslationAction,
  UpdateQuestionnaireMetadataAction,
  UpdateSidebarTranslationAction,
  UPDATE_SETTING_TRANSLATION_ACTION,
  UpdateSettingTranslationAction,
  UPDATE_ITEM_CODE_TRANSLATION_ACTION,
  UpdateItemCodeTranslationAction,
  UpdateItemExtensionAction,
  UPDATE_ITEM_EXTENSION_ACTION,
  REMOVE_FHIR_RESOURCE_ACTION,
  RemoveFhirResourceAction,
  ImportFhirResourceAction,
  IMPORT_FHIR_RESOURCE_ACTION,
  UpdateFhirResourceAction,
  UPDATE_FHIR_RESOURCE_ACTION,
} from "./treeActions";
import { findCodingBySystemAndCode } from "../../helpers/codeHelper";
import createUUID from "../../helpers/CreateUUID";
import { createOptionReferenceExtensions } from "../../helpers/extensionHelper";
import { isIgnorableItem, isRecipientList } from "../../helpers/itemControl";

export type ActionType =
  | AddItemCodeAction
  | AddQuestionnaireLanguageAction
  | DeleteItemCodeAction
  | RemoveQuestionnaireLanguageAction
  | UpdateItemCodePropertyAction
  | UpdateItemCodePropertyWithCodeAction
  | UpdateItemTranslationAction
  | UpdateItemOptionTranslationAction
  | ResetQuestionnaireAction
  | UpdateQuestionnaireMetadataAction
  | NewItemAction
  | DeleteItemAction
  | DeleteChildItemsAction
  | UpdateItemAction
  | DuplicateItemAction
  | ReorderItemAction
  | MoveItemAction
  | UpdateContainedValueSetTranslationAction
  | UpdateLinkIdAction
  | UpdateMetadataTranslationAction
  | UpdateSettingTranslationAction
  | UpdateSidebarTranslationAction
  | RemoveItemAttributeAction
  | SaveAction
  | UpdateMarkedLinkId
  | UpdateItemCodeTranslationAction
  | UpdateItemExtensionAction
  | RemoveFhirResourceAction
  | ImportFhirResourceAction
  | UpdateFhirResourceAction;

export interface Items {
  [linkId: string]: QuestionnaireItem;
}

export interface CodeStringValue {
  [code: string]: string;
}

export interface ItemTranslation {
  answerOptions?: CodeStringValue;
  entryFormatText?: string;
  initial?: string;
  text?: string;
  validationText?: string;
  sublabel?: string;
  repeatsText?: string;
  prefix?: string;
  code?: Coding[];
}

export interface ContainedTranslation {
  concepts: CodeStringValue;
}

export interface ContainedTranslations {
  [id: string]: ContainedTranslation;
}

export interface ItemTranslations {
  [linkId: string]: ItemTranslation;
}

export interface MetadataTranslations {
  [key: string]: string;
}

export interface SidebarItemTranslation {
  markdown: string;
}

export interface SidebarItemTranslations {
  [linkId: string]: SidebarItemTranslation;
}

export interface SettingTranslations {
  [key: string]: Extension;
}

export interface Translation {
  items: ItemTranslations;
  sidebarItems: SidebarItemTranslations;
  metaData: MetadataTranslations;
  contained: ContainedTranslations;
  settings: SettingTranslations;
}

export interface Languages {
  [key: string]: Translation;
}

export interface OrderItem {
  linkId: string;
  items: Array<OrderItem>;
}

export interface MarkedItem {
  linkId: string;
  parentArray: Array<string>;
}

export interface TreeState {
  isEdited: boolean;
  isDirty: boolean;
  qItems: Items;
  qOrder: OrderItem[];
  qMetadata: IQuestionnaireMetadata;
  qContained?: FhirResource[];
  qCurrentItem?: MarkedItem;
  qAdditionalLanguages?: Languages;
}

function addLanguage(
  draft: TreeState,
  action: AddQuestionnaireLanguageAction,
): void {
  if (!draft.qAdditionalLanguages) {
    draft.qAdditionalLanguages = {};
  }
  // Autocreates a random questionnaire id for the translated version for the user which will be the default value
  if (!action.translation.metaData.id) {
    action.translation.metaData.id = createUUID();
  }
  if (!action.translation.metaData.url) {
    action.translation.metaData.url = `${HelsenorgeUrlStartText}${action.translation.metaData.id}`;
  }

  draft.qAdditionalLanguages[action.additionalLanguageCode] =
    action.translation;
}

function removeLanguage(
  draft: TreeState,
  action: RemoveQuestionnaireLanguageAction,
): void {
  if (!draft.qAdditionalLanguages) {
    draft.qAdditionalLanguages = {};
  }
  delete draft.qAdditionalLanguages[action.languageCode];
}

function getLinkIdOfAllSubItems(
  items: Array<OrderItem>,
  linkIds: Array<string>,
): Array<string> {
  items.forEach((x) => {
    linkIds.push(x.linkId);
    getLinkIdOfAllSubItems(x.items, linkIds);
  });
  return linkIds;
}

function updateMarkedItemId(
  draft: TreeState,
  action: UpdateMarkedLinkId,
): void {
  if (action.linkId) {
    draft.qCurrentItem = {
      linkId: action.linkId,
      parentArray: action.parentArray || [],
    };
  } else {
    draft.qCurrentItem = undefined;
  }
}

function createNewItem(draft: TreeState, action: NewItemAction): void {
  const itemToAdd = action.item;
  draft.qItems[itemToAdd.linkId] = itemToAdd;
  const itemChildren = [];
  if (itemToAdd.item?.length === 1) {
    // special handling since type 'inline' has a child when it is created
    draft.qItems[itemToAdd.item[0].linkId] = itemToAdd.item[0];
    itemChildren.push({ linkId: itemToAdd.item[0].linkId, items: [] });
  }
  // find the correct place to add the new item
  const arrayToAddItemTo = findTreeArray(action.order, draft.qOrder);
  const newOrderNode = {
    linkId: itemToAdd.linkId,
    items: itemChildren,
  };
  if (!action.index && action.index !== 0) {
    arrayToAddItemTo.push(newOrderNode);
  } else {
    const ignorableItemsBeforeIndex = arrayToAddItemTo.filter(
      (x, index) =>
        isIgnorableItem(draft.qItems[x.linkId]) && index <= (action.index || 0),
    );
    arrayToAddItemTo.splice(
      action.index + ignorableItemsBeforeIndex.length,
      0,
      newOrderNode,
    );
  }

  const parentItem = draft.qItems[action.order[action.order.length - 1]];
  if (!isIgnorableItem(itemToAdd, parentItem)) {
    draft.qCurrentItem = {
      linkId: itemToAdd.linkId,
      parentArray: action.order,
    };
  }
}

function moveItem(draft: TreeState, action: MoveItemAction): void {
  const arrayToDeleteItemFrom = findTreeArray(action.oldOrder, draft.qOrder);
  const indexToDelete = arrayToDeleteItemFrom.findIndex(
    (x) => x.linkId === action.linkId,
  );
  const subTree = arrayToDeleteItemFrom[indexToDelete].items;

  // find the correct place to move the item
  const arrayToAddItemTo = findTreeArray(action.newOrder, draft.qOrder);
  if (!action.index && action.index !== 0) {
    arrayToAddItemTo.push({ linkId: action.linkId, items: subTree });
  } else {
    const ignorableItemsBeforeIndex = arrayToAddItemTo.filter(
      (x, index) =>
        isIgnorableItem(draft.qItems[x.linkId]) && index <= (action.index || 0),
    );
    arrayToAddItemTo.splice(
      action.index + ignorableItemsBeforeIndex.length,
      0,
      {
        linkId: action.linkId,
        items: subTree,
      },
    );
  }

  // delete node from qOrder
  arrayToDeleteItemFrom.splice(indexToDelete, 1);

  // update currentItem
  if (draft.qCurrentItem) {
    draft.qCurrentItem = {
      ...draft.qCurrentItem,
      parentArray: action.newOrder,
    };
  }
}

function deleteItemTranslations(
  linkIdToDelete: string,
  languages?: Languages,
): void {
  if (!languages) {
    return;
  }
  Object.values(languages).forEach((translation) => {
    delete translation.items[linkIdToDelete];
  });
}

function deleteChildItems(
  draft: TreeState,
  action: DeleteChildItemsAction,
): void {
  const itemToDeleteChildrenFrom = findTreeArray(
    action.order,
    draft.qOrder,
  ).find((item) => item.linkId === action.linkId);
  if (!itemToDeleteChildrenFrom) {
    return;
  }
  const itemsToDelete = getLinkIdOfAllSubItems(
    itemToDeleteChildrenFrom.items,
    [],
  );
  itemsToDelete.forEach((linkIdToDelete: string) => {
    delete draft.qItems[linkIdToDelete];
    deleteItemTranslations(linkIdToDelete, draft.qAdditionalLanguages);
  });
  // delete node from qOrder
  itemToDeleteChildrenFrom.items = [];
}

function deleteItem(draft: TreeState, action: DeleteItemAction): void {
  const arrayToDeleteItemFrom = findTreeArray(action.order, draft.qOrder);
  const indexToDelete = arrayToDeleteItemFrom.findIndex(
    (x) => x.linkId === action.linkId,
  );

  // find all child items in the tree below this node and delete from qItems
  const itemsToDelete = [
    action.linkId,
    ...getLinkIdOfAllSubItems(arrayToDeleteItemFrom[indexToDelete].items, []),
  ];
  itemsToDelete.forEach((linkIdToDelete: string) => {
    delete draft.qItems[linkIdToDelete];
    deleteItemTranslations(linkIdToDelete, draft.qAdditionalLanguages);
  });

  // delete node from qOrder
  arrayToDeleteItemFrom.splice(indexToDelete, 1);

  // set no item selected if the selected item was deleted
  if (draft.qCurrentItem?.linkId === action.linkId) {
    draft.qCurrentItem = undefined;
  }
}

function updateItem(draft: TreeState, action: UpdateItemAction): void {
  const isEmptyArray = (): boolean => {
    const { itemProperty, itemValue } = action;
    if (
      itemProperty === IItemProperty.extension &&
      (itemValue as Array<Extension>).length === 0
    ) {
      return true;
    }
    return false;
  };

  if (!action.itemValue || isEmptyArray()) {
    delete draft.qItems[action.linkId][action.itemProperty];
    return;
  }

  draft.qItems[action.linkId] = {
    ...draft.qItems[action.linkId],
    [action.itemProperty]: action.itemValue,
  };

  if (
    action.itemValue === "choice" &&
    isRecipientList(draft.qItems[action.linkId])
  ) {
    //handle dropdown!
    draft.qItems[action.linkId].extension = [
      ...(draft.qItems[action.linkId].extension || []),
      ...createOptionReferenceExtensions,
    ];
  }
}

function addItemCode(draft: TreeState, action: AddItemCodeAction): void {
  if (!draft.qItems[action.linkId]) {
    // eslint-disable-next-line no-console
    console.error('Trying to add "code" to non-extistent item');
    return;
  }
  if (!draft.qItems[action.linkId].code) {
    draft.qItems[action.linkId].code = [];
  }
  draft.qItems[action.linkId].code?.push(action.code);
}

function deleteItemCode(draft: TreeState, action: DeleteItemCodeAction): void {
  if (!draft.qItems[action.linkId]) {
    // eslint-disable-next-line no-console
    console.error('Trying to delete "code" from non-extistent item');
    return;
  }
  const { code } = draft.qItems[action.linkId];
  if (code && code.length > 1) {
    draft.qItems[action.linkId].code?.splice(action.index, 1);
  } else {
    delete draft.qItems[action.linkId].code;
  }
}

function updateItemExtension(
  draft: TreeState,
  action: UpdateItemExtensionAction,
): void {
  if (!draft.qItems[action.linkId]) {
    // eslint-disable-next-line no-console
    console.error('Trying to update "extension" from non-existent item');
    return;
  }

  draft.qItems[action.linkId].extension = action.extensions;
}

function updateItemCodeProperty(
  draft: TreeState,
  action: UpdateItemCodePropertyAction,
): void {
  const code = draft.qItems[action.linkId].code;
  if (!code) {
    // eslint-disable-next-line no-console
    console.error('Trying to update "code" from non-extistent item or code');
    return;
  }

  if (code && code[action.index]) {
    code[action.index][action.property] = action.value;
  }
}

function updateItemCodePropertyWithCode(
  draft: TreeState,
  action: UpdateItemCodePropertyWithCodeAction,
): void {
  const code = draft.qItems[action.linkId]?.code;

  if (!code) {
    // eslint-disable-next-line no-console
    console.error('Trying to update "code" from non-existent item or code');
    return;
  }

  const targetCodingIndex = code.findIndex(
    (item) => item.system === action.system && item.code === action.code,
  );

  if (targetCodingIndex !== -1) {
    code[targetCodingIndex][action.property] = action.value;
  }
}

function updateItemTranslation(
  draft: TreeState,
  action: UpdateItemTranslationAction,
): void {
  if (
    draft.qAdditionalLanguages &&
    draft.qAdditionalLanguages[action.languageCode]
  ) {
    if (!draft.qAdditionalLanguages[action.languageCode].items[action.linkId]) {
      draft.qAdditionalLanguages[action.languageCode].items[action.linkId] = {};
    }
    draft.qAdditionalLanguages[action.languageCode].items[action.linkId][
      action.propertyName
    ] = action.value;
  }
}

function updateItemCodeTranslation(
  draft: TreeState,
  action: UpdateItemCodeTranslationAction,
): void {
  if (
    draft.qAdditionalLanguages &&
    draft.qAdditionalLanguages[action.languageCode]
  ) {
    if (!draft.qAdditionalLanguages[action.languageCode].items[action.linkId]) {
      draft.qAdditionalLanguages[action.languageCode].items[action.linkId] = {};
    }
    if (
      !draft.qAdditionalLanguages[action.languageCode].items[action.linkId].code
    ) {
      draft.qAdditionalLanguages[action.languageCode].items[
        action.linkId
      ].code = [];
    }
    const coding =
      draft.qAdditionalLanguages[action.languageCode].items[action.linkId].code;
    const code = findCodingBySystemAndCode(
      coding,
      action.code.system,
      action.code.code,
    );
    if (code === undefined) {
      draft.qAdditionalLanguages[action.languageCode].items[
        action.linkId
      ].code?.push({ ...action.code, display: action.value });
    } else {
      draft.qAdditionalLanguages[action.languageCode].items[
        action.linkId
      ].code?.map((x) => {
        if (x.code === action.code.code && x.system === action.code.system) {
          x.display = action.value;
        }
      });
    }
  }
}

function updateItemOptionTranslation(
  draft: TreeState,
  action: UpdateItemOptionTranslationAction,
): void {
  if (
    draft.qAdditionalLanguages &&
    draft.qAdditionalLanguages[action.languageCode]
  ) {
    const item =
      draft.qAdditionalLanguages[action.languageCode].items[action.linkId] ??
      ({} as ItemTranslation);
    if (!item.answerOptions) {
      item.answerOptions = {};
    }
    item.answerOptions[action.optionCode] = action.text;
    draft.qAdditionalLanguages[action.languageCode].items[action.linkId] = item;
  }
}

function updateMetadataTranslation(
  draft: TreeState,
  action: UpdateMetadataTranslationAction,
): void {
  if (
    draft.qAdditionalLanguages &&
    draft.qAdditionalLanguages[action.languageCode]
  ) {
    draft.qAdditionalLanguages[action.languageCode].metaData[
      action.propertyName
    ] = action.translation;
  }
}

function updateSettingTranslationAction(
  draft: TreeState,
  action: UpdateSettingTranslationAction,
): void {
  if (
    draft.qAdditionalLanguages &&
    draft.qAdditionalLanguages[action.languageCode]
  ) {
    const settings = draft.qAdditionalLanguages[action.languageCode].settings;

    if (action.translatedValue) {
      settings[action.extension] = action.translatedValue;
    } else {
      delete settings[action.extension];
    }
  }
}

function updateContainedValueSetTranslation(
  draft: TreeState,
  action: UpdateContainedValueSetTranslationAction,
): void {
  if (
    draft.qAdditionalLanguages &&
    draft.qAdditionalLanguages[action.languageCode]
  ) {
    const contained = draft.qAdditionalLanguages[action.languageCode].contained;
    if (!contained[action.valueSetId]) {
      contained[action.valueSetId] = { concepts: {} };
    }
    contained[action.valueSetId].concepts[action.conceptId] =
      action.translation;
  }
}

function updateSidebarTranslation(
  draft: TreeState,
  action: UpdateSidebarTranslationAction,
): void {
  if (
    draft.qAdditionalLanguages &&
    draft.qAdditionalLanguages[action.languageCode]
  ) {
    const sidebarItems =
      draft.qAdditionalLanguages[action.languageCode].sidebarItems;
    if (!sidebarItems[action.linkId]) {
      sidebarItems[action.linkId] = { markdown: "" };
    }
    sidebarItems[action.linkId].markdown = action.value;
  }
}

function updateQuestionnaireMetadataProperty(
  draft: TreeState,
  { propName, value }: UpdateQuestionnaireMetadataAction,
): void {
  draft.qMetadata = {
    ...draft.qMetadata,
    [propName]: value,
  };

  if (IQuestionnaireMetadataType.title === propName) {
    const useContext = draft.qMetadata.useContext;
    if (useContext !== undefined && useContext.length > 0) {
      const codings = useContext[0].valueCodeableConcept?.coding;
      if (codings !== undefined && codings.length > 0) {
        codings[0].display = value as string;
      }
    }
  }
}

function resetQuestionnaire(
  draft: TreeState,
  action: ResetQuestionnaireAction,
): void {
  const newState: TreeState = action.newState || getInitialState();
  draft.isEdited = newState.isEdited;
  draft.isDirty = newState.isDirty;
  draft.qOrder = newState.qOrder;
  draft.qItems = newState.qItems;
  draft.qMetadata = newState.qMetadata;
  draft.qContained = newState?.qContained;
  draft.qAdditionalLanguages = newState.qAdditionalLanguages;
  draft.qCurrentItem = newState.qCurrentItem;
}

function duplicateItemAction(
  draft: TreeState,
  action: DuplicateItemAction,
): void {
  // find index of item to duplicate
  const arrayToDuplicateInto = findTreeArray(action.order, draft.qOrder);
  const indexToDuplicate = arrayToDuplicateInto.findIndex(
    (x) => x.linkId === action.linkId,
  );

  const copyItemTranslations = (
    linkIdToCopyFrom: string,
    newLinkId: string,
  ): void => {
    if (draft.qAdditionalLanguages) {
      Object.values(draft.qAdditionalLanguages).forEach((translation) => {
        const translationItemToCopyFrom = translation.items[linkIdToCopyFrom];
        if (translationItemToCopyFrom) {
          translation.items[newLinkId] = translationItemToCopyFrom;
        }
      });
    }
  };

  const copyItemWithSubtrees = (
    itemToCopyFrom: OrderItem,
    parentMap: { [key: string]: string },
  ): OrderItem => {
    const copyItem: QuestionnaireItem = JSON.parse(
      JSON.stringify(draft.qItems[itemToCopyFrom.linkId]),
    );
    const newId = createUUID();
    parentMap[copyItem.linkId] = newId;
    copyItem.linkId = newId;

    // update enableWhen if condition is a copied parent
    if (copyItem.enableWhen) {
      copyItem.enableWhen = copyItem.enableWhen.map((x) => {
        return { ...x, question: parentMap[x.question] || x.question };
      });
    }

    // add new item
    draft.qItems[copyItem.linkId] = copyItem;

    copyItemTranslations(itemToCopyFrom.linkId, newId);

    // add item to tree and generate subtrees
    return {
      linkId: copyItem.linkId,
      items: itemToCopyFrom.items.map((item) =>
        copyItemWithSubtrees(item, parentMap),
      ),
    };
  };

  const duplictedItem = copyItemWithSubtrees(
    arrayToDuplicateInto[indexToDuplicate],
    {},
  );

  // insert duplicated item below item that was copied from
  arrayToDuplicateInto.splice(indexToDuplicate + 1, 0, duplictedItem);

  draft.qCurrentItem = {
    linkId: duplictedItem.linkId,
    parentArray: action.order,
  };
}

function reorderItem(draft: TreeState, action: ReorderItemAction): void {
  const arrayToReorderFrom = findTreeArray(action.order, draft.qOrder);
  const indexToMove = arrayToReorderFrom.findIndex(
    (x) => x.linkId === action.linkId,
  );
  if (indexToMove === -1) {
    throw new Error("Could not find item to move");
  }
  const ignorableItemsBeforeIndex = arrayToReorderFrom.filter(
    (x, index) =>
      isIgnorableItem(draft.qItems[x.linkId]) && index <= action.newIndex,
  );
  const movedOrderItem = arrayToReorderFrom.splice(indexToMove, 1);
  arrayToReorderFrom.splice(
    action.newIndex + ignorableItemsBeforeIndex.length,
    0,
    movedOrderItem[0],
  );
}

function importFhirResource(
  draft: TreeState,
  action: ImportFhirResourceAction,
): void {
  draft.qContained = [...(draft?.qContained || []), ...action.items];
}

function updateFhirResource(
  draft: TreeState,
  action: UpdateFhirResourceAction,
): void {
  const indexToUpdate =
    draft?.qContained?.findIndex((x) => x.id === action.item.id) ?? -1;
  if (draft.qContained && indexToUpdate >= 0) {
    draft.qContained[indexToUpdate] = action.item;
  } else {
    draft.qContained = [...(draft?.qContained || []), action.item];
  }
}
function removeFhirResource(
  draft: TreeState,
  action: RemoveFhirResourceAction,
): void {
  if (draft.qContained && action.item.id) {
    draft.qContained = draft.qContained.filter((x) => x.id !== action.item.id);
  }
}

function updateLinkId(draft: TreeState, action: UpdateLinkIdAction): void {
  const { qItems, qOrder, qAdditionalLanguages } = draft;
  const { oldLinkId, newLinkId, parentArray } = action;

  // Replace in qItems
  const oldItem = qItems[oldLinkId];
  const newItem = {
    ...oldItem,
    linkId: newLinkId,
  };
  qItems[newLinkId] = newItem;
  delete qItems[oldLinkId];

  // Replace in qOrder
  const arrayToUpdateIn = findTreeArray(parentArray, qOrder);
  const itemToUpdate = arrayToUpdateIn.find(
    (item) => item.linkId === oldLinkId,
  );
  if (!itemToUpdate) {
    throw new Error(`Trying to update linkId that doesn't exist`);
  }
  itemToUpdate.linkId = newLinkId;

  // Replace enableWhen(s)
  Object.values(qItems).forEach((item) => {
    if (!item.enableWhen) {
      return;
    }
    item.enableWhen.forEach((enableWhen) => {
      if (enableWhen.question === oldLinkId) {
        enableWhen.question = newLinkId;
      }
    });
  });

  if (qAdditionalLanguages) {
    Object.values(qAdditionalLanguages).forEach((translation) => {
      const oldItemTranslation = translation.items[oldLinkId];
      translation.items[newLinkId] = oldItemTranslation;
      delete translation.items[oldLinkId];
    });
  }

  // Update currentItem
  if (draft.qCurrentItem) {
    draft.qCurrentItem = { ...draft.qCurrentItem, linkId: newLinkId };
  }
}

function removeAttributeFromItem(
  draft: TreeState,
  action: RemoveItemAttributeAction,
): void {
  if (
    draft.qItems[action.linkId] &&
    draft.qItems[action.linkId][action.itemProperty]
  ) {
    delete draft.qItems[action.linkId][action.itemProperty];
  }
}

const reducer = produce((draft: TreeState, action: ActionType) => {
  // Flag as dirty on all changes except reset, save and "scroll"
  if (
    action.type !== RESET_QUESTIONNAIRE_ACTION &&
    action.type !== SAVE_ACTION &&
    action.type !== UPDATE_MARKED_LINK_ID
  ) {
    draft.isDirty = true;
    draft.isEdited = true;
  }
  switch (action.type) {
    case ADD_ITEM_CODE_ACTION:
      addItemCode(draft, action);
      break;
    case DELETE_ITEM_CODE_ACTION:
      deleteItemCode(draft, action);
      break;
    case UPDATE_ITEM_CODE_PROPERTY_ACTION:
      updateItemCodeProperty(draft, action);
      break;
    case UPDATE_ITEM_CODE_PROPERTY_WITH_CODE_ACTION:
      updateItemCodePropertyWithCode(draft, action);
      break;
    case ADD_QUESTIONNAIRE_LANGUAGE_ACTION:
      addLanguage(draft, action);
      break;
    case UPDATE_ITEM_EXTENSION_ACTION:
      updateItemExtension(draft, action);
      break;
    case REMOVE_QUESTIONNAIRE_LANGUAGE_ACTION:
      removeLanguage(draft, action);
      break;
    case RESET_QUESTIONNAIRE_ACTION:
      resetQuestionnaire(draft, action);
      break;
    case SAVE_ACTION:
      draft.isDirty = false;
      break;
    case UPDATE_QUESTIONNAIRE_METADATA_ACTION:
      updateQuestionnaireMetadataProperty(draft, action);
      break;
    case NEW_ITEM_ACTION:
      createNewItem(draft, action);
      break;
    case DELETE_ITEM_ACTION:
      deleteItem(draft, action);
      break;
    case DELETE_CHILD_ITEMS_ACTION:
      deleteChildItems(draft, action);
      break;
    case UPDATE_ITEM_ACTION:
      updateItem(draft, action);
      break;
    case UPDATE_ITEM_TRANSLATION_ACTION:
      updateItemTranslation(draft, action);
      break;
    case UPDATE_ITEM_CODE_TRANSLATION_ACTION:
      updateItemCodeTranslation(draft, action);
      break;
    case UPDATE_ITEM_OPTION_TRANSLATION_ACTION:
      updateItemOptionTranslation(draft, action);
      break;
    case UPDATE_CONTAINED_VALUESET_TRANSLATION_ACTION:
      updateContainedValueSetTranslation(draft, action);
      break;
    case UPDATE_METADATA_TRANSLATION_ACTION:
      updateMetadataTranslation(draft, action);
      break;
    case UPDATE_SETTING_TRANSLATION_ACTION:
      updateSettingTranslationAction(draft, action);
      break;
    case UPDATE_SIDEBAR_TRANSLATION_ACTION:
      updateSidebarTranslation(draft, action);
      break;
    case DUPLICATE_ITEM_ACTION:
      duplicateItemAction(draft, action);
      break;
    case REORDER_ITEM_ACTION:
      reorderItem(draft, action);
      break;
    case MOVE_ITEM_ACTION:
      moveItem(draft, action);
      break;
    case UPDATE_FHIR_RESOURCE_ACTION:
      updateFhirResource(draft, action);
      break;
    case REMOVE_FHIR_RESOURCE_ACTION:
      removeFhirResource(draft, action);
      break;
    case IMPORT_FHIR_RESOURCE_ACTION:
      importFhirResource(draft, action);
      break;
    case UPDATE_LINK_ID_ACTION:
      updateLinkId(draft, action);
      break;
    case REMOVE_ITEM_ATTRIBUTE_ACTION:
      removeAttributeFromItem(draft, action);
      break;
    case UPDATE_MARKED_LINK_ID:
      updateMarkedItemId(draft, action);
      break;
  }
});

export const TreeContext = createContext<{
  state: TreeState;
  dispatch: Dispatch<ActionType>;
}>({
  state: getMinimalInitialState(),
  dispatch: () => null,
});

export const TreeContextProvider = (props: {
  children: React.JSX.Element;
}): React.JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getMinimalInitialState());

  useEffect(() => {
    const startTime = performance.now();

    const save = async (): Promise<void> => {
      await saveQuestionnaire(JSON.parse(JSON.stringify(state)));
    };
    if (state.qMetadata.id) {
      save().then(() => {
        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        // eslint-disable-next-line no-console
        console.log(
          `[IndexedDB] Save took ${timeTaken.toFixed(2)} milliseconds`,
        );
      });
    }
  }, [state]);

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <TreeContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TreeContext.Provider>
  );
};
