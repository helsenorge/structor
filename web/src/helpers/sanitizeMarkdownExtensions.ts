import { IExtensionType } from "../types/IQuestionnareItemType";
import type { Bundle, Questionnaire, QuestionnaireItem } from "fhir/r4";

function needsSanitization(item: QuestionnaireItem): boolean {
  return !!(
    item._text?.extension &&
    item.text &&
    item._text.extension.some(
      (ext) =>
        ext.url === IExtensionType.markdown &&
        (ext.valueMarkdown === undefined || ext.valueMarkdown === ""),
    )
  );
}

function populateMissingMarkdownExtensionValue(item: QuestionnaireItem): void {
  if (!item._text || !item._text.extension) {
    return;
  }
  if (item.text) {
    for (const ext of item._text.extension) {
      if (
        ext.url === IExtensionType.markdown &&
        (ext.valueMarkdown === undefined || ext.valueMarkdown === "")
      ) {
        ext.valueMarkdown = item.text;
      }
    }
  } else {
    for (const ext of item._text.extension) {
      if (
        ext.url === IExtensionType.markdown &&
        (ext.valueMarkdown === undefined || ext.valueMarkdown === "")
      ) {
        ext.valueMarkdown = "";
      }
    }
  }
}

function sanitizeItemsInPlace(items: QuestionnaireItem[] | undefined): void {
  if (!items) {
    return;
  }
  for (const item of items) {
    if (needsSanitization(item)) {
      populateMissingMarkdownExtensionValue(item);
    }
    sanitizeItemsInPlace(item.item);
  }
}

export function sanitizeJsonInPlace(json: Bundle | Questionnaire): void {
  if (json.resourceType === "Bundle" && "entry" in json && json.entry) {
    for (const entry of json.entry) {
      const resource = entry.resource as Questionnaire;
      if (resource?.resourceType === "Questionnaire") {
        sanitizeItemsInPlace(resource.item);
      }
    }
  } else if (json.resourceType === "Questionnaire") {
    sanitizeItemsInPlace(json.item);
  }
}
