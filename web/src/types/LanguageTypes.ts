import { Extension } from "fhir/r4";

import { IExtensionType } from "./IQuestionnareItemType";
import { TreeState } from "../store/treeStore/treeStore";

export type Language = {
  code: string;
  display: string;
  localDisplay: string;
};

export enum TranslatableMetadataProperty {
  id = "id",
  url = "url",
  title = "title",
  description = "description",
  publisher = "publisher",
  purpose = "purpose",
  copyright = "copyright",
}

export type MetadataProperty = {
  propertyName: TranslatableMetadataProperty;
  label: string;
  markdown: boolean;
  validate?: (
    value: string,
    state?: TreeState,
    targetLanguage?: string,
  ) => string;
};

export type SettingsProperty = {
  extension: IExtensionType;
  label: string;
  generate: (value: string) => Extension;
  getValue: (extension: Extension) => string | undefined;
};

export enum TranslatableItemProperty {
  initial = "initial",
  text = "text",
  validationText = "validationText",
  entryFormatText = "entryFormatText",
  sublabel = "sublabel",
  repeatsText = "repeatsText",
  prefix = "prefix",
  code = "code",
}

export enum TranslatableKeyProptey {
  item = "item",
  metadata = "metadata",
  valueSet = "valueSet",
  answerOption = "answerOption",
}
