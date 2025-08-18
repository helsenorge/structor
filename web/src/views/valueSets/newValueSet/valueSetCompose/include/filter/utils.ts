import { ValueSetComposeIncludeFilter } from "fhir/r4";

type FilterOp = ValueSetComposeIncludeFilter["op"];
export const VS_FILTER_OPERATORS = [
  "=",
  "is-a",
  "descendent-of",
  "is-not-a",
  "regex",
  "in",
  "not-in",
  "generalizes",
  "exists",
] as const satisfies readonly FilterOp[];
export const isFilterOp = (v: string): v is FilterOp =>
  (VS_FILTER_OPERATORS as readonly string[]).includes(v);
export const OPERATOR_LABELS: Record<FilterOp, string> = {
  "=": "=",
  "is-a": "is-a (subtype of)",
  "descendent-of": "descendent-of",
  "is-not-a": "is-not-a",
  regex: "regex",
  in: "in (set membership)",
  "not-in": "not-in",
  generalizes: "generalizes",
  exists: "exists",
};
