import {
  Coding,
  QuestionnaireItem,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import { TFunction } from "react-i18next";
import { isSystemTableConfigSystem } from "src/utils/tableutils";

import {
  ICodeSystem,
  ICodingProperty,
  IItemProperty,
} from "../types/IQuestionnareItemType";
import { Option } from "../types/OptionTypes";

import createUUID from "./CreateUUID";
import {
  deleteItemCodeAction,
  addItemCodeAction,
  updateItemCodePropertyWithCodeAction,
  updateItemAction,
} from "../store/treeStore/treeActions";
import { ActionType, Items, OrderItem } from "../store/treeStore/treeStore";

export enum RenderingOptionsEnum {
  None = "0",
  Default = "1",
  KunPdf = "2",
  KunSkjemautfyller = "3",
  Hidden = "4",
}

export enum ChoiceRenderOptionCodes {
  Default = "Default",
  Full = "Full",
  Compact = "Compact",
}

export enum SliderLabelEnum {
  LabelRight = "LabelRight",
  LabelLeft = "LabelLeft",
}

export enum SliderDisplayTypes {
  Label = "label",
  OrdinalValue = "ordnialValue",
}

export enum ValidationOptionsCodes {
  validateReadOnly = "ValidateReadOnly",
}

export const renderingOptions = [
  {
    code: RenderingOptionsEnum.Default,
    display: "Display in form filler and PDF",
    codeDisplay: "Default",
  },
  {
    code: RenderingOptionsEnum.KunPdf,
    display: "Display only in PDF",
    codeDisplay: "KunPdf",
  },
  {
    code: RenderingOptionsEnum.KunSkjemautfyller,
    display: "Display only in form filler",
    codeDisplay: "KunSkjemautfyller",
  },
  { code: RenderingOptionsEnum.Hidden, display: "Hide in form filler and PDF" },
];

export const choiceRenderOptions = (
  t: TFunction<"translation">,
): ValueSetComposeIncludeConcept[] => [
  {
    code: ChoiceRenderOptionCodes.Default,
    display: t("Show only answered options"),
  },
  { code: ChoiceRenderOptionCodes.Full, display: t("Full display") },
  { code: ChoiceRenderOptionCodes.Compact, display: t("Compact display") },
];

export const getItemCode = (
  item: QuestionnaireItem,
  system: ICodeSystem,
): Coding | undefined => {
  return item.code?.find((code: Coding) => code.system === system);
};

export const getItemCodeWithMatchingSystemAndCode = (
  item: QuestionnaireItem,
  system: ICodeSystem,
  code: string,
): Coding | undefined => {
  return item.code?.find(
    (coding) => coding.system === system && coding.code === code,
  );
};

export const getAllMatchingCodes = (
  item: QuestionnaireItem,
  system: ICodeSystem,
): Coding[] | undefined => {
  const matchingCodes = item.code?.filter(
    (code: Coding) => code.system === system,
  );
  return matchingCodes;
};

export const getDisplayAndCodeValuesFromAllMatchingCodes = (
  item: QuestionnaireItem,
  system: ICodeSystem,
): Option[] => {
  const stringArrayToReturn: Option[] = [];
  item.code?.forEach((code: Coding) => {
    if (code.system === system && code.code && code.display) {
      stringArrayToReturn.push({ code: code?.code, display: code?.display });
    }
  });
  return stringArrayToReturn;
};

export const erRenderingOption = (code: Coding): boolean => {
  return code.system === ICodeSystem.renderOptionsCodeSystem;
};

export const addItemCode = (
  item: QuestionnaireItem,
  code: Coding,
  dispatch: (value: ActionType) => void,
): void => {
  dispatch(addItemCodeAction(item.linkId, code));
};

export const removeItemCode = (
  item: QuestionnaireItem,
  systemUrl: string,
  dispatch: (value: ActionType) => void,
): void => {
  const codeIndex = item.code?.findIndex((code) => systemUrl === code.system);

  if (codeIndex !== undefined && codeIndex > -1) {
    const newCodes =
      item.code?.filter((code) => systemUrl !== code.system) ?? [];
    dispatch(updateItemAction(item.linkId, IItemProperty.code, newCodes));
  }
};

export const removeItemCodes = (
  item: QuestionnaireItem,
  systemUrls: string[],
  dispatch: (value: ActionType) => void,
): void => {
  let newCodes: Coding[] = item.code ?? [];
  systemUrls.forEach((system) => {
    newCodes = newCodes?.filter((code) => system !== code.system) ?? [];
  });
  dispatch(updateItemAction(item.linkId, IItemProperty.code, newCodes));
};

export const removeItemCodeWithCode = (
  item: QuestionnaireItem,
  systemUrl: string,
  code: string,
  dispatch: (value: ActionType) => void,
): void => {
  const index = item.code?.findIndex(
    (coding) => coding.system === systemUrl && coding.code === code,
  );
  if (index !== undefined && index > -1) {
    dispatch(deleteItemCodeAction(item.linkId, index));
  }
};

export const addRenderOptionItemCode = (
  item: QuestionnaireItem,
  code: string,
  dispatch: (value: ActionType) => void,
): void => {
  const renderOption = renderingOptions.find((c) => c.code === code);
  if (renderOption) {
    const coding = {
      code: renderOption.code,
      display: renderOption.codeDisplay,
      system: ICodeSystem.renderOptionsCodeSystem,
      id: createUUID(),
    };
    dispatch(addItemCodeAction(item.linkId, coding));
  }
};

export const addValidateReadOnlyItemCode = (
  item: QuestionnaireItem,
  code: string,
  dispatch: (value: ActionType) => void,
): void => {
  const coding = {
    code: code,
    display: "Valider skrivebeskyttet felt",
    system: ICodeSystem.validationOptions,
    id: createUUID(),
  };
  dispatch(addItemCodeAction(item.linkId, coding));
};

export const addChoiceRenderOptionItemCode = (
  item: QuestionnaireItem,
  code: string,
  t: TFunction<"translation">,
  dispatch: (value: ActionType) => void,
): void => {
  const choiceRenderOption = choiceRenderOptions(t).find(
    (c) => c.code === code,
  );
  if (choiceRenderOption) {
    const coding = {
      code: choiceRenderOption.code,
      display: choiceRenderOption.display,
      system: ICodeSystem.choiceRenderOptions,
      id: createUUID(),
    };
    dispatch(addItemCodeAction(item.linkId, coding));
  }
};

export const getOrderItemByLinkId = (
  qOrder: OrderItem[],
  linkIdToSearch: string,
): OrderItem | undefined => {
  for (const orderItem of qOrder) {
    if (orderItem.linkId === linkIdToSearch) {
      return orderItem;
    }

    if (orderItem.items) {
      const nestedResult = getOrderItemByLinkId(
        orderItem.items,
        linkIdToSearch,
      );
      if (nestedResult) {
        return nestedResult;
      }
    }
  }

  return undefined;
};

export const getAllOrderItemChildrenOfItem = (
  qOrder: OrderItem[],
  parentLinkId: string,
): OrderItem[] => {
  const result: OrderItem[] = [];

  for (const orderItem of qOrder) {
    if (orderItem.linkId === parentLinkId && orderItem.items) {
      result.push(...orderItem.items);
    }

    if (orderItem.items) {
      result.push(
        ...getAllOrderItemChildrenOfItem(orderItem.items, parentLinkId),
      );
    }
  }

  return result;
};

export const getQuestionnaireItemWithChildren = ({
  linkId,
  qItems,
  qOrder,
}: {
  linkId: string;
  qItems: Items;
  qOrder: OrderItem[];
}): QuestionnaireItem | undefined => {
  const orderItem = getOrderItemByLinkId(qOrder, linkId);
  if (!orderItem) return undefined;

  const currentItem = qItems[linkId];
  if (!currentItem) return undefined;

  const children: QuestionnaireItem[] = [];

  if (orderItem.items && orderItem.items.length > 0) {
    for (const childOrderItem of orderItem.items) {
      const childWithItsChildren = getQuestionnaireItemWithChildren({
        linkId: childOrderItem.linkId,
        qItems,
        qOrder,
      });
      if (childWithItsChildren) {
        children.push(childWithItsChildren);
      }
    }
  }

  return { ...currentItem, item: children.length > 0 ? children : undefined };
};

export const updateChildWithMatchingCode = (
  item: QuestionnaireItem,
  qItems: Items,
  qOrder: OrderItem[],
  displayValue: string,
  systemValue: ICodeSystem,
  codeValue: string,
  dispatch: (value: ActionType) => void,
): void => {
  const parentOrderItem = getOrderItemByLinkId(qOrder, item.linkId);
  parentOrderItem?.items.forEach((childOrderItem) => {
    const childItem = qItems[childOrderItem.linkId];
    dispatch(
      updateItemCodePropertyWithCodeAction(
        childItem.linkId,
        ICodingProperty.display,
        displayValue,
        systemValue,
        codeValue,
      ),
    );
  });
};

export const findCodingBySystemAndCode = (
  codeing?: Coding[],
  system?: string,
  codeValue?: string,
): Coding | undefined => {
  if (
    system === undefined ||
    codeValue === undefined ||
    codeing === undefined
  ) {
    return;
  }
  return codeing?.find((c) => c.system === system && c.code === codeValue);
};

export const canEditCode = (
  system: string,
  codingProp: ICodingProperty,
): boolean => {
  if (codingProp === ICodingProperty.display) {
    return system !== ICodeSystem.tableColumn;
  } else {
    return !isSystemTableConfigSystem(system);
  }
};
