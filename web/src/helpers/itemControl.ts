import { Extension, QuestionnaireItem, Coding } from "fhir/r4";

import {
  IExtensionType,
  IQuestionnaireItemType,
  IValueSetSystem,
  IItemProperty,
  ICodeSystem,
} from "../types/IQuestionnareItemType";

import { getEnumKeyByString } from "./enumHelper";
import { getTextExtensionMarkdown } from "./QuestionHelper";
import { CodingSystemType } from "./uriHelper";
import { updateItemAction } from "../store/treeStore/treeActions";
import { ActionType } from "../store/treeStore/treeStore";

export enum ItemControlType {
  inline = "inline",
  help = "help",
  sidebar = "sidebar",
  dropdown = "drop-down",
  autocomplete = "autocomplete",
  highlight = "highlight",
  summary = "summary",
  summaryContainer = "summary-container",
  checkbox = "check-box",
  radioButton = "radio-button",
  yearMonth = "yearMonth",
  year = "year",
  receiverComponent = "receiver-component",
  dynamic = "dynamic",
  dataReceiver = "data-receiver",
  slider = "slider",
  step = "step",
  score = "score",
  gTable = "gtable",
  table = "table",
  tableHN1 = "table-hn1",
  tableHN2 = "table-hn2",
}

export const createItemControlExtension = (
  itemControlType: ItemControlType,
): Extension => {
  return {
    url: IExtensionType.itemControl,
    valueCodeableConcept: {
      coding: [
        {
          system: IValueSetSystem.itemControlValueSet,
          code: itemControlType,
        },
      ],
    },
  };
};

export const createItemControlExtensionWithTypes = (
  types: string[],
): Extension => {
  const initCodingArray: Coding[] = [];
  const extension = {
    url: IExtensionType.itemControl,
    valueCodeableConcept: { coding: initCodingArray },
  };

  types.forEach((type: string) => {
    extension.valueCodeableConcept.coding.push({
      system: IValueSetSystem.itemControlValueSet,
      code: type,
    });
  });
  return extension;
};

export const checkboxExtension = createItemControlExtension(
  ItemControlType.checkbox,
);
export const dropdownExtension = createItemControlExtension(
  ItemControlType.dropdown,
);
export const radiobuttonExtension = createItemControlExtension(
  ItemControlType.radioButton,
);
export const sliderExtension = createItemControlExtension(
  ItemControlType.slider,
);

const getItemControlType = (
  item?: QuestionnaireItem,
): ItemControlType | undefined => {
  const itemControlExtension = item?.extension?.find(
    (x) => x.url === IExtensionType.itemControl,
  );
  if (itemControlExtension) {
    const code = itemControlExtension.valueCodeableConcept?.coding
      ? itemControlExtension.valueCodeableConcept.coding[0]?.code
      : undefined;

    if (code) {
      const key = getEnumKeyByString(ItemControlType, code);
      return key ? ItemControlType[key] : undefined;
    }
  }
  return undefined;
};

export const existItemControlWithCode = (
  item: QuestionnaireItem,
  code: string,
): boolean => {
  const exist =
    item.extension
      ?.filter((x: Extension) => x.url === IExtensionType.itemControl)
      ?.find((x: Extension) =>
        x.valueCodeableConcept?.coding?.some((s: Coding) => s.code === code),
      ) !== undefined;
  return exist;
};

export const existItemWithCode = (
  item: QuestionnaireItem,
  code: string,
): boolean => {
  const exist = item.code?.find((x: Coding) => x.code === code);
  return exist ? true : false;
};

export const existItemWithSystem = (
  item: QuestionnaireItem,
  system: ICodeSystem,
): boolean => {
  const exist = item.code?.find((x: Coding) => x.system === system);
  return exist ? true : false;
};
export const oneOrMoreItemControlsExistOnItem = (
  item: QuestionnaireItem,
  itemControlList: ItemControlType[],
): boolean => {
  return (
    itemControlList.filter((itemControl) =>
      itemControlExistsInExtensionList(item.extension, itemControl),
    ).length > 0
  );
};
export const itemControlExistsInExtensionList = (
  extension?: Extension[],
  itemControlType?: ItemControlType,
): boolean =>
  !extension || !itemControlType
    ? false
    : extension?.some((ex) =>
        ex.valueCodeableConcept?.coding?.some(
          (cd) => cd.code === itemControlType,
        ),
      );

export const existItemControlExtension = (item: QuestionnaireItem): boolean => {
  return (
    item.extension?.find(
      (x: Extension) => x.url === IExtensionType.itemControl,
    ) !== undefined
  );
};

const handleTypeInItemControlExtension = (
  item: QuestionnaireItem,
  code: ItemControlType,
): Extension | null => {
  if (!existItemControlExtension(item)) {
    return createItemControlExtension(code);
  }

  const coding = item.extension
    ?.find((f: Extension) => f.url === IExtensionType.itemControl)
    ?.valueCodeableConcept?.coding?.filter((f: Coding) => f.code !== code)
    ?.map((c: Coding) => c.code) as string[];

  if (!existItemControlWithCode(item, code)) {
    coding.push(code);
  }

  return coding.length > 0 ? createItemControlExtensionWithTypes(coding) : null;
};

export const isIgnorableItem = (
  item: QuestionnaireItem,
  parentItem?: QuestionnaireItem,
): boolean => {
  return (
    isItemControlHelp(item) ||
    isItemControlSidebar(item) ||
    isItemControlInline(parentItem)
  );
};

export const isItemControlReceiverComponent = (
  item: QuestionnaireItem,
): boolean => {
  return getItemControlType(item) === ItemControlType.receiverComponent;
};

export const isItemControlDropDown = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.dropdown;
};

export const isItemControlSlider = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.slider;
};

export const isItemControlRadioButton = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.radioButton;
};

export const isItemControlAutocomplete = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.autocomplete;
};

export const isItemControlCheckbox = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.checkbox;
};

export const isItemControlHelp = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.help;
};

export const isItemControlHighlight = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.highlight;
};

export const isItemControlSidebar = (item: QuestionnaireItem): boolean => {
  return getItemControlType(item) === ItemControlType.sidebar;
};

export const isItemControlInline = (item?: QuestionnaireItem): boolean => {
  return (
    item?.type === IQuestionnaireItemType.text &&
    getItemControlType(item) === ItemControlType.inline
  );
};

export const isItemControlSummary = (item: QuestionnaireItem): boolean => {
  return existItemControlWithCode(item, ItemControlType.summary);
};

export const isItemControlSummaryContainer = (
  item: QuestionnaireItem,
): boolean => {
  return existItemControlWithCode(item, ItemControlType.summaryContainer);
};

export const isItemControlDataReceiver = (item: QuestionnaireItem): boolean => {
  return existItemControlWithCode(item, ItemControlType.dataReceiver);
};

export const getHelpText = (item: QuestionnaireItem): string => {
  if (!isItemControlHelp(item)) {
    return "";
  }
  return getTextExtensionMarkdown(item) || item.text || "";
};

export const setItemControlExtension = (
  item: QuestionnaireItem,
  code: ItemControlType,
  dispatch: (value: ActionType) => void,
): void => {
  const extensionsToSet = (item.extension || []).filter(
    (x: Extension) => x.url !== IExtensionType.itemControl,
  );
  const extension = handleTypeInItemControlExtension(item, code);
  if (extension) {
    extensionsToSet.push(extension);
  }
  dispatch(
    updateItemAction(item.linkId, IItemProperty.extension, extensionsToSet),
  );
};

export const scoreCoding: Coding = {
  system: ICodeSystem.score,
  code: ItemControlType.score,
  display: ItemControlType.score,
};

export const isRecipientList = (item: QuestionnaireItem): boolean => {
  const isReceiverComponent = isItemControlReceiverComponent(item);
  return (
    !isReceiverComponent &&
    item.code?.find((x) => x.system === CodingSystemType.valueSetTqqc) !==
      undefined
  );
};
