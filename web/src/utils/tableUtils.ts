import { removeItemExtension, setItemExtension, createExtensionWithSystemAndCoding, addCodeToValueCodeableConcept } from "../helpers/extensionHelper";
import { ActionType } from "../store/treeStore/treeStore";
import { IValueSetSystem, IExtentionType } from "../types/IQuestionnareItemType";
import { Extension, QuestionnaireItem } from "../types/fhir";
import { TableOptionsEnum } from "../types/tableOptions";

export const doesExtensionHaveTableCode = (code: string | undefined): boolean => {
    return (
      code === TableOptionsEnum.GTable 
        || code === TableOptionsEnum.Table 
        || code === TableOptionsEnum.TableHN1 
        || code === TableOptionsEnum.TableHN2
    ) 
}

export const parseExtension = (extension: Extension): Extension => {
  return JSON.parse(JSON.stringify(extension));
}

export const removeTableCodesFromExtension = (extension: Extension): Extension => {
  const newCoding = extension.valueCodeableConcept?.coding?.filter(
    (coding) =>
      coding.system !== IValueSetSystem.itemControlValueSet ||
      !doesExtensionHaveTableCode(coding?.code)
  ) || [];
  if (extension?.valueCodeableConcept?.coding) {
    extension.valueCodeableConcept.coding = newCoding
  }
  return extension;
}

export const areAllCodesTableCodes = (extension: Extension): boolean | undefined => {
  return extension.valueCodeableConcept?.coding?.every(
    (coding) =>
      doesExtensionHaveTableCode(coding?.code)
  )
}

export const handleTableOptionChange = (selectedValue: string, item: QuestionnaireItem, dispatch: React.Dispatch<ActionType>) => {
  const extensionWithItemControl: Extension | undefined = item.extension?.find(
    (ext) =>
      ext.url === IExtentionType.itemControl
  );
  if (extensionWithItemControl && item.extension) {
    const extension: Extension = parseExtension(extensionWithItemControl);
    if (selectedValue === TableOptionsEnum.Ingen) {
      if (areAllCodesTableCodes(extension)) {
        removeItemExtension(item, IExtentionType.itemControl, dispatch);
      } else {
        const newExtension = removeTableCodesFromExtension(extension);
        setItemExtension(item, newExtension, dispatch);
      }
    } else {
        const newExtension = removeTableCodesFromExtension(extension);
        addCodeToValueCodeableConcept(item, newExtension, IValueSetSystem.itemControlValueSet, selectedValue, dispatch);
    }
  } else {
    createExtensionWithSystemAndCoding(item, IExtentionType.itemControl, IValueSetSystem.itemControlValueSet, selectedValue, dispatch);
  }
}