import { IExtensionType } from "../types/IQuestionnareItemType";
import type { Bundle, Questionnaire, QuestionnaireItem } from "fhir/r4";

function needsSanitization(item: QuestionnaireItem): boolean {
  return !!(
    item._text?.extension &&
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
    item._text.extension = item._text.extension.filter(
      (ext) =>
        ext.url !== IExtensionType.markdown ||
        (ext.valueMarkdown !== undefined && ext.valueMarkdown !== ""),
    );
    if (item._text.extension.length === 0) {
      delete item._text;
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

function collectMarkdownLinkIds(
  items: QuestionnaireItem[] | undefined,
  result: Set<string>,
): void {
  if (!items) {
    return;
  }
  for (const item of items) {
    if (
      item._text?.extension?.some(
        (ext) => ext.url === IExtensionType.markdown && ext.valueMarkdown,
      )
    ) {
      result.add(item.linkId);
    }
    collectMarkdownLinkIds(item.item, result);
  }
}

function propagateMarkdownExtensionToItems(
  items: QuestionnaireItem[] | undefined,
  markdownLinkIds: Set<string>,
): void {
  if (!items) {
    return;
  }
  for (const item of items) {
    if (markdownLinkIds.has(item.linkId)) {
      const hasMarkdownExt = item._text?.extension?.some(
        (ext) => ext.url === IExtensionType.markdown,
      );
      if (!hasMarkdownExt && item.text) {
        item._text = {
          extension: [
            { url: IExtensionType.markdown, valueMarkdown: item.text },
          ],
        };
      }
    }
    propagateMarkdownExtensionToItems(item.item, markdownLinkIds);
  }
}

function sanitizeBundleInPlace(bundle: Bundle): void {
  if (!bundle.entry) return;

  const mainResource = bundle.entry[0]?.resource as Questionnaire | undefined;
  const markdownLinkIds = new Set<string>();
  if (mainResource?.resourceType === "Questionnaire") {
    sanitizeItemsInPlace(mainResource.item);
    collectMarkdownLinkIds(mainResource.item, markdownLinkIds);
  }

  for (let i = 1; i < bundle.entry.length; i++) {
    const resource = bundle.entry[i].resource as Questionnaire;
    if (resource?.resourceType !== "Questionnaire") continue;
    if (markdownLinkIds.size > 0) {
      propagateMarkdownExtensionToItems(resource.item, markdownLinkIds);
    }
    sanitizeItemsInPlace(resource.item);
  }
}

export function sanitizeJsonInPlace(json: Bundle | Questionnaire): void {
  if (json.resourceType === "Bundle") {
    sanitizeBundleInPlace(json);
  } else if (json.resourceType === "Questionnaire") {
    sanitizeItemsInPlace(json.item);
  }
}
