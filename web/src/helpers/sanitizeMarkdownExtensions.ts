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

function sanitizeItemsInPlace(items: QuestionnaireItem[] | undefined): void {
  if (!items) return;
  for (const item of items) {
    if (needsSanitization(item) && item._text?.extension && item.text) {
      for (const ext of item._text.extension) {
        if (
          ext.url === IExtensionType.markdown &&
          (ext.valueMarkdown === undefined || ext.valueMarkdown === "")
        ) {
          ext.valueMarkdown = item.text;
        }
      }
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
    sanitizeItemsInPlace((json as Questionnaire).item);
  }
}
