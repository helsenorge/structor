import type { TreeState } from "../store/treeStore/treeStore";
import type { Bundle, Questionnaire, QuestionnaireItem } from "fhir/r4";

import { mapToTreeState } from "../helpers/FhirToTreeStateMapper";
import { generateQuestionnaire } from "../helpers/generateQuestionnaire";
import { sanitizeJsonInPlace } from "../helpers/sanitizeMarkdownExtensions";

/**
 * Loads a questionnaire JSON fixture into TreeState (simulates uploading a file).
 * Applies sanitizeJsonInPlace first, matching the real upload flow in useUploadFile.
 */
export function loadQuestionnaireIntoState(
  questionnaire: Bundle | Questionnaire,
): TreeState {
  sanitizeJsonInPlace(questionnaire);
  return mapToTreeState(questionnaire);
}

/**
 * Full round-trip: Questionnaire JSON → sanitize → TreeState → generateQuestionnaire → parsed output.
 * Returns a Questionnaire or Bundle depending on whether translations exist.
 * Simulates: user uploads a questionnaire, then presses Save/Export.
 */
export function roundTripQuestionnaire(
  questionnaire: Bundle | Questionnaire,
): Questionnaire | Bundle {
  const state = loadQuestionnaireIntoState(questionnaire);
  const outputJson = generateQuestionnaire(state);
  return JSON.parse(outputJson) as Questionnaire | Bundle;
}

/**
 * Extract all Questionnaire resources from a round-trip output (handles both Bundle and single Questionnaire).
 */
export function getQuestionnaires(
  output: Questionnaire | Bundle,
): Questionnaire[] {
  if (output.resourceType === "Bundle") {
    return (output.entry ?? [])
      .map((e) => e.resource)
      .filter((r): r is Questionnaire => r?.resourceType === "Questionnaire");
  }
  return [output];
}

/**
 * Recursively collect all items from nested questionnaire items.
 */
export function collectAllItems(
  items: QuestionnaireItem[] | undefined,
): QuestionnaireItem[] {
  if (!items) {
    return [];
  }
  const result: QuestionnaireItem[] = [];
  for (const item of items) {
    result.push(item);
    result.push(...collectAllItems(item.item));
  }
  return result;
}
