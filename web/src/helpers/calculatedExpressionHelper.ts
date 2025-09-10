import { QuestionnaireItem } from "fhir/r4";
import { OrderItem } from "src/store/treeStore/treeStore";
import { IExtensionType } from "src/types/IQuestionnareItemType";
import { buildLinkIdIndexSet } from "src/utils/traversionUtils";

import { getExtensionStringValue } from "./extensionHelper";

const LINK_ID_REGEX = /linkid=(['"])(.*?)\1/gi;

export function getLinkIdsFromCalculatedExpression(
  item: QuestionnaireItem,
): string[] {
  const valueString =
    getExtensionStringValue(item, IExtensionType.calculatedExpression) ?? "";
  if (!valueString) return [];

  const out: string[] = [];
  const seen = new Set<string>();
  LINK_ID_REGEX.lastIndex = 0;

  let matches: RegExpExecArray | null;
  while ((matches = LINK_ID_REGEX.exec(valueString)) !== null) {
    const id = (matches[2] ?? "").trim();
    if (id && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

export function existAllCalculatedExpressionLinkIds(
  qItem: QuestionnaireItem,
  qOrder: OrderItem[],
  index?: ReadonlySet<string>,
): string[] {
  const referenced = getLinkIdsFromCalculatedExpression(qItem);
  if (referenced.length === 0) return [];

  const existing = index ?? buildLinkIdIndexSet(qOrder);
  const missing: string[] = [];
  for (const id of referenced) {
    if (!existing.has(id)) missing.push(id);
  }
  return missing;
}
